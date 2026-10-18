/* ═══════════════════════════════════════════════════════════════
   RCRD — Co-living map logic
   Content lives in data.js
   ═══════════════════════════════════════════════════════════════ */

(function () {
    const STATUS_LABEL = { been: 'been', notyet: 'not been yet' };
    const categories = new Map(colivingCategories.map(c => [c.id, c]));

    // Equal Earth projection: shows countries at their true relative size,
    // unlike the usual Web Mercator, which inflates Europe and the north.
    const EE_X = 17243959.06, EE_Y = 8392927.6; // projected extent in metres
    const crs = new L.Proj.CRS('EPSG:8857', '+proj=eqearth +lon_0=0 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs', {
        origin: [-EE_X, EE_Y],
        bounds: L.bounds([-EE_X, -EE_Y], [EE_X, EE_Y]),
        resolutions: Array.from({ length: 12 }, (_, z) => (2 * EE_X / 256) / Math.pow(2, z))
    });

    const map = L.map('map', {
        crs,
        zoomControl: true,
        zoomSnap: 0.25,
        minZoom: 1.5,
        maxZoom: 9,
        maxBounds: [[-89, -180], [89, 180]],
        maxBoundsViscosity: 0.8
    }).setView([30, 10], 2);
    window.colivingMap = map; // used by propose.js

    // Background layers, each in its own pane so they stack correctly
    [['ocean', 200], ['land', 250], ['grid', 300]].forEach(([name, z]) => {
        map.createPane(name).style.zIndex = z;
        map.getPane(name).style.pointerEvents = 'none';
    });
    const renderer = (pane) => L.canvas({ pane, padding: 0.5 });

    // Meridians curve in Equal Earth, so lines need many points
    const meridian = (lng) => Array.from({ length: 37 }, (_, i) => [-90 + i * 5, lng]);

    // The globe's outline, filled as the ocean
    L.polygon([...meridian(-180), ...meridian(180).reverse()], {
        renderer: renderer('ocean'), interactive: false,
        stroke: true, color: 'rgba(168, 212, 255, 0.18)', weight: 1,
        fillColor: '#0b0820', fillOpacity: 1
    }).addTo(map);

    // Faint graticule, like a star chart
    const gridStyle = { renderer: renderer('grid'), color: '#ffffff', opacity: 0.05, weight: 1, interactive: false };
    for (let lat = -60; lat <= 60; lat += 30) L.polyline([[lat, -180], [lat, 180]], gridStyle).addTo(map);
    for (let lng = -150; lng <= 150; lng += 30) L.polyline(meridian(lng), gridStyle).addTo(map);

    // Some outlines (Russia, Fiji) cross the 180° line. Leaflet would draw
    // that as a line straight across the world, so split rings where they cross.
    function splitAtAntimeridian(ring) {
        const pieces = [[ring[0]]];
        for (let i = 1; i < ring.length; i++) {
            const [lng1, lat1] = ring[i - 1], [lng2, lat2] = ring[i];
            if (Math.abs(lng2 - lng1) > 180 && Math.abs(lat1) < 80) {
                const side = Math.sign(lng1);
                const span = lng2 + 360 * side - lng1;
                const t = span === 0 ? 0 : (180 * side - lng1) / span; // 0 when a point sits on the line
                const lat = lat1 + t * (lat2 - lat1);
                pieces[pieces.length - 1].push([180 * side, lat]);
                pieces.push([[-180 * side, lat]]);
            }
            pieces[pieces.length - 1].push(ring[i]);
        }
        if (pieces.length > 1) pieces[0] = pieces.pop().concat(pieces[0]); // ring wraps around
        return pieces;
    }

    function fixAntimeridian(geojson) {
        geojson.features.forEach(f => {
            const g = f.geometry;
            if (!g) return;
            const polys = g.type === 'Polygon' ? [g.coordinates] : g.coordinates;
            const out = [];
            polys.forEach(rings => {
                const [outer, ...holes] = rings;
                const parts = splitAtAntimeridian(outer);
                if (parts.length === 1) out.push(rings);
                else parts.forEach(p => out.push([p])); // holes never cross the line here
            });
            f.geometry = { type: 'MultiPolygon', coordinates: out };
        });
        return geojson;
    }

    // Country outlines from Natural Earth (no API key needed)
    map.attributionControl.setPrefix(false).addAttribution('<a href="https://www.naturalearthdata.com/">Natural Earth</a> · Equal Earth projection');
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-50m.json')
        .then(r => r.json())
        .then(topo => {
            L.geoJSON(fixAntimeridian(topojson.feature(topo, topo.objects.countries)), {
                renderer: renderer('land'),
                interactive: false,
                style: { color: 'rgba(168, 212, 255, 0.28)', weight: 0.6, fillColor: '#1a1530', fillOpacity: 1 }
            }).addTo(map);
        })
        .catch(() => { /* map still works, just without outlines */ });

    const $list = document.getElementById('places');
    const $filters = document.getElementById('filters');
    const entries = new Map(); // id → { space, marker, $item }
    const groups = new Map();  // category id → $group
    const filter = { category: 'all', beenOnly: false, sort: 'vibe' };
    let activeId = null;

    function el(tag, className, text) {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text != null) node.textContent = text;
        return node;
    }

    function paragraphs(text, className) {
        const $wrap = el('div', className);
        (text || '').split(/\n\s*\n/).filter(Boolean).forEach(p => $wrap.appendChild(el('p', null, p.trim())));
        return $wrap;
    }

    function buildList(title, items) {
        const frag = document.createDocumentFragment();
        if (!items || !items.length) return frag;
        frag.appendChild(el('p', 'place-list-title', title));
        const $ul = el('ul', 'place-list');
        items.forEach(i => $ul.appendChild(el('li', null, i)));
        frag.appendChild($ul);
        return frag;
    }

    function dot(space) {
        const $d = el('span', `dot dot-${space.status}`);
        $d.style.setProperty('--c', categories.get(space.category)?.color || '#fff');
        return $d;
    }

    function buildItem(space) {
        const $item = el('li', 'place');

        const $head = el('button', 'place-head');
        $head.type = 'button';
        $head.setAttribute('aria-expanded', 'false');
        $head.appendChild(dot(space));
        $head.appendChild(el('span', 'place-name', space.name));
        const meta = [space.place, STATUS_LABEL[space.status], space.when].filter(Boolean).join(' · ');
        $head.appendChild(el('span', 'place-meta', meta));
        if (space.verdict) $head.appendChild(el('span', 'place-verdict', space.verdict));
        if (space.suggestedBy) $head.appendChild(el('span', 'place-meta place-suggested', `suggested by ${space.suggestedBy}`));
        // Shown only when sorting by price
        const price = space.priceFrom == null ? 'price unknown' : space.priceFrom === 0 ? 'free / donation' : `from ~€${space.priceFrom.toLocaleString('en')}/month`;
        $head.appendChild(el('span', 'place-meta place-price', price));
        $item.appendChild($head);

        const $body = el('div', 'place-body');
        $body.appendChild(paragraphs(space.why, 'place-why'));
        if (space.practical) $body.appendChild(el('p', 'place-practical', space.practical));
        $body.appendChild(buildList('good for', space.goodFor));
        $body.appendChild(buildList('maybe not for', space.notFor));

        if (space.tags && space.tags.length) {
            const $tags = el('div', 'tags');
            space.tags.forEach(t => $tags.appendChild(el('span', 'tag', t)));
            $body.appendChild($tags);
        }
        if (space.links && space.links.length) {
            const $links = el('div', 'links');
            space.links.forEach(link => {
                const $a = el('a', null, link.text);
                $a.href = link.url;
                $a.target = '_blank';
                $a.rel = 'noopener noreferrer';
                $links.appendChild($a);
            });
            $body.appendChild($links);
        }
        $item.appendChild($body);

        $head.addEventListener('click', () => select(space.id, { fly: true, toggle: true }));
        return $item;
    }

    function buildMarker(space) {
        const color = categories.get(space.category)?.color || '#fff';
        const icon = L.divIcon({
            className: '',
            html: `<div class="marker marker-${space.status}" style="--c:${color}"><span></span></div>`,
            iconSize: [18, 18],
            iconAnchor: [9, 9]
        });
        const marker = L.marker([space.lat, space.lng], { icon, title: space.name, keyboard: true });
        marker.bindTooltip(space.name, { className: 'place-tooltip', direction: 'top', offset: [0, -10] });
        marker.on('click', () => select(space.id, { scroll: true }));
        return marker;
    }

    function setActive(entry, on) {
        entry.$item.classList.toggle('is-open', on);
        entry.$item.querySelector('.place-head').setAttribute('aria-expanded', String(on));
        const $m = entry.marker.getElement();
        if ($m) $m.querySelector('.marker').classList.toggle('is-active', on);
        entry.marker.setZIndexOffset(on ? 1000 : 0);
    }

    function select(id, { fly = false, scroll = false, toggle = false } = {}) {
        const wasActive = activeId === id;
        if (activeId && entries.has(activeId)) setActive(entries.get(activeId), false);
        activeId = null;
        if (toggle && wasActive) return;

        const entry = entries.get(id);
        activeId = id;
        setActive(entry, true);
        if (fly) map.flyTo([entry.space.lat, entry.space.lng], Math.max(map.getZoom(), 6), { duration: 1.2 });
        if (scroll) entry.$item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function isFiltered() {
        return filter.category !== 'all' || filter.beenOnly;
    }

    // Europe is home: if any shown places are in Europe, frame just those.
    // Places further away appear when you zoom out or filter to them.
    const EUROPE = L.latLngBounds([34, -25], [72, 45]);
    function framePoints(points) {
        const inEurope = points.filter(p => EUROPE.contains(p));
        return inEurope.length ? inEurope : points;
    }

    function fitTo(points, animate = true) {
        points = framePoints(points);
        const opts = { padding: [40, 40], maxZoom: 5 };
        if (points.length === 1) animate ? map.flyTo(points[0], 6, { duration: 1 }) : map.setView(points[0], 6);
        else if (points.length > 1) animate ? map.flyToBounds(L.latLngBounds(points), { ...opts, duration: 1 }) : map.fitBounds(L.latLngBounds(points), opts);
    }

    function applyFilter({ fit = true } = {}) {
        const visibleCount = new Map();
        const points = [];
        entries.forEach(entry => {
            const s = entry.space;
            const show = (filter.category === 'all' || s.category === filter.category) &&
                         (!filter.beenOnly || s.status === 'been');
            entry.$item.hidden = !show;
            if (show) {
                entry.marker.addTo(map);
                points.push([s.lat, s.lng]);
                visibleCount.set(s.category, (visibleCount.get(s.category) || 0) + 1);
            } else {
                entry.marker.remove();
                if (activeId === s.id) { setActive(entry, false); activeId = null; }
            }
        });
        arrange();
        groups.forEach(($group, id) => { $group.hidden = filter.sort === 'price' || !visibleCount.get(id); });
        $priceGroup.hidden = filter.sort !== 'price' || !points.length;
        $list.classList.toggle('by-price', filter.sort === 'price');
        $sortRow.querySelectorAll('.chip').forEach(x => x.classList.toggle('is-active', x.dataset.sort === filter.sort));

        $catRow.querySelectorAll('.chip').forEach(x => x.classList.toggle('is-active', x.dataset.category === filter.category));
        $been.classList.toggle('is-active', filter.beenOnly);
        $been.setAttribute('aria-pressed', String(filter.beenOnly));
        $reset.hidden = !isFiltered();
        if (fit) fitTo(points);
    }

    // Filters live in the URL hash (#ea, #been, #ea+been), so the browser
    // back button steps back through them.
    function filterToHash() {
        const parts = [];
        if (filter.category !== 'all') parts.push(filter.category);
        if (filter.beenOnly) parts.push('been');
        if (filter.sort === 'price') parts.push('price');
        return parts.length ? '#' + parts.join('+') : '';
    }

    function filterFromHash() {
        const parts = location.hash.replace(/^#/, '').split('+').filter(Boolean);
        return {
            category: parts.find(p => categories.has(p)) || 'all',
            beenOnly: parts.includes('been'),
            sort: parts.includes('price') ? 'price' : 'vibe'
        };
    }

    function setFilter(next) {
        Object.assign(filter, next);
        const hash = filterToHash();
        if (hash !== location.hash) history.pushState(null, '', hash || location.pathname + location.search);
        applyFilter();
    }

    window.addEventListener('popstate', () => {
        Object.assign(filter, filterFromHash());
        applyFilter();
    });

    // ── Filters ──
    function chip(label, color, onClick) {
        const $c = el('button', 'chip');
        $c.type = 'button';
        if (color) {
            const $d = el('span', 'dot dot-been');
            $d.style.setProperty('--c', color);
            $c.appendChild($d);
        }
        $c.appendChild(document.createTextNode(label));
        $c.addEventListener('click', onClick);
        return $c;
    }

    const $reset = el('button', 'reset', '← all places');
    $reset.type = 'button';
    $reset.hidden = true;
    $reset.addEventListener('click', () => setFilter({ category: 'all', beenOnly: false }));

    const $catRow = el('div', 'filter-row');
    const $all = chip('all', null, () => setFilter({ category: 'all' }));
    $all.dataset.category = 'all';
    $catRow.appendChild($all);
    colivingCategories.forEach(c => {
        // Clicking the active category again goes back to all
        const $c = chip(c.short || c.name, c.color, () => setFilter({ category: filter.category === c.id ? 'all' : c.id }));
        $c.dataset.category = c.id;
        $catRow.appendChild($c);
    });

    const $statusRow = el('div', 'filter-row');
    const $been = chip('only where I\'ve been', null, () => setFilter({ beenOnly: !filter.beenOnly }));
    $statusRow.appendChild($been);
    const $legend = el('span', 'legend');
    $legend.innerHTML = '<span class="dot dot-been"></span>been <span class="dot dot-notyet"></span>not yet';
    $statusRow.appendChild($legend);

    const $sortRow = el('div', 'filter-row');
    $sortRow.appendChild(el('span', 'sort-label', 'sort'));
    [['vibe', 'by vibe'], ['price', 'by price']].forEach(([id, label]) => {
        const $c = chip(label, null, () => setFilter({ sort: id }));
        $c.dataset.sort = id;
        $sortRow.appendChild($c);
    });

    $filters.append($catRow, $statusRow, $sortRow, $reset);

    // Moves each card into its category group, or into one list sorted
    // by price. Places with no known price go last.
    function arrange() {
        if (filter.sort === 'price') {
            [...entries.values()]
                .sort((a, b) => (a.space.priceFrom ?? Infinity) - (b.space.priceFrom ?? Infinity))
                .forEach(e => $priceList.appendChild(e.$item));
        } else {
            entries.forEach(e => e.$home.appendChild(e.$item)); // entries keep their original order
        }
    }

    // ── List, grouped by category; places I've been come first ──
    const statusOrder = { been: 0, notyet: 1 };
    colivingCategories.forEach(cat => {
        const spaces = colivingSpaces
            .filter(s => s.category === cat.id)
            .sort((a, b) => (statusOrder[a.status] ?? 2) - (statusOrder[b.status] ?? 2));
        if (!spaces.length) return;

        const $group = el('li', 'group');
        $group.style.setProperty('--c', cat.color);
        $group.appendChild(el('h2', 'group-title', cat.name));
        if (cat.description) $group.appendChild(paragraphs(cat.description, 'group-desc'));
        const $ol = el('ol', 'places');
        spaces.forEach(space => {
            const $item = buildItem(space);
            const marker = buildMarker(space).addTo(map);
            $ol.appendChild($item);
            entries.set(space.id, { space, marker, $item, $home: $ol });
        });
        $group.appendChild($ol);
        $list.appendChild($group);
        groups.set(cat.id, $group);
    });

    const $priceGroup = el('li', 'group group-price');
    $priceGroup.appendChild(el('h2', 'group-title', 'cheapest first'));
    $priceGroup.appendChild(paragraphs("Rough monthly cost of the cheapest option. What's included (meals, VAT) varies, so open a card for details.", 'group-desc'));
    const $priceList = el('ol', 'places');
    $priceGroup.appendChild($priceList);
    $priceGroup.hidden = true;
    $list.appendChild($priceGroup);

    // ── Lists of lists ──
    if (typeof colivingDirectories !== 'undefined' && colivingDirectories.length) {
        const $more = el('section', 'more');
        $more.appendChild(el('h2', 'group-title', 'there are many more'));
        $more.appendChild(paragraphs('These are just a few. Directories with hundreds of other places:', 'group-desc'));
        const $ul = el('ul', 'more-list');
        colivingDirectories.forEach(d => {
            const $li = el('li');
            const $a = el('a', null, d.name);
            $a.href = d.url;
            $a.target = '_blank';
            $a.rel = 'noopener noreferrer';
            $li.append($a, el('span', null, d.description));
            $ul.appendChild($li);
        });
        $more.appendChild($ul);
        document.getElementById('list-view').appendChild($more);
    }

    if (!entries.size) $list.appendChild(el('li', 'empty', 'Nothing here yet.'));

    // Start from the filter in the URL, if any; otherwise show everything
    Object.assign(filter, filterFromHash());
    applyFilter({ fit: false });
    fitTo([...entries.values()].filter(e => !e.$item.hidden).map(e => [e.space.lat, e.space.lng]), false);
})();
