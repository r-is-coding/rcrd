/* ═══════════════════════════════════════════════════════════════
   RCRD — Co-living map logic
   Content lives in data.js
   ═══════════════════════════════════════════════════════════════ */

(function () {
    const STATUS_LABEL = { been: 'been', notyet: 'not been yet' };
    const categories = new Map(colivingCategories.map(c => [c.id, c]));

    const map = L.map('map', {
        preferCanvas: true,
        zoomControl: true,
        minZoom: 2,
        maxZoom: 8,
        maxBounds: [[-75, -200], [85, 200]],
        maxBoundsViscosity: 0.8
    }).setView([30, 10], 2);

    // Faint graticule, like a star chart
    const gridStyle = { color: '#ffffff', opacity: 0.05, weight: 1, interactive: false };
    for (let lat = -60; lat <= 60; lat += 30) L.polyline([[lat, -180], [lat, 180]], gridStyle).addTo(map);
    for (let lng = -180; lng <= 180; lng += 30) L.polyline([[-75, lng], [85, lng]], gridStyle).addTo(map);

    // Country outlines from Natural Earth (no API key needed)
    map.attributionControl.setPrefix(false).addAttribution('<a href="https://www.naturalearthdata.com/">Natural Earth</a>');
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-50m.json')
        .then(r => r.json())
        .then(topo => {
            L.geoJSON(topojson.feature(topo, topo.objects.countries), {
                interactive: false,
                style: { color: 'rgba(168, 212, 255, 0.28)', weight: 0.6, fillColor: '#1a1530', fillOpacity: 1 }
            }).addTo(map).bringToBack();
        })
        .catch(() => { /* map still works, just without outlines */ });

    const $list = document.getElementById('places');
    const $filters = document.getElementById('filters');
    const entries = new Map(); // id → { space, marker, $item }
    const groups = new Map();  // category id → $group
    const filter = { category: 'all', beenOnly: false };
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

    function applyFilter() {
        const visibleCount = new Map();
        entries.forEach(entry => {
            const s = entry.space;
            const show = (filter.category === 'all' || s.category === filter.category) &&
                         (!filter.beenOnly || s.status === 'been');
            entry.$item.hidden = !show;
            if (show) entry.marker.addTo(map); else entry.marker.remove();
            if (show) visibleCount.set(s.category, (visibleCount.get(s.category) || 0) + 1);
        });
        groups.forEach(($group, id) => { $group.hidden = !visibleCount.get(id); });
    }

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
        $c.addEventListener('click', () => onClick($c));
        return $c;
    }

    const $catRow = el('div', 'filter-row');
    const pickCategory = (id) => ($c) => {
        filter.category = id;
        $catRow.querySelectorAll('.chip').forEach(x => x.classList.toggle('is-active', x === $c));
        applyFilter();
    };
    const $all = chip('all', null, pickCategory('all'));
    $all.classList.add('is-active');
    $catRow.appendChild($all);
    colivingCategories.forEach(c => $catRow.appendChild(chip(c.short || c.name, c.color, pickCategory(c.id))));
    $filters.appendChild($catRow);

    const $statusRow = el('div', 'filter-row');
    const $been = chip('only where I\'ve been', null, ($c) => {
        filter.beenOnly = !filter.beenOnly;
        $c.classList.toggle('is-active', filter.beenOnly);
        $c.setAttribute('aria-pressed', String(filter.beenOnly));
        applyFilter();
    });
    $been.setAttribute('aria-pressed', 'false');
    $statusRow.appendChild($been);
    const $legend = el('span', 'legend');
    $legend.innerHTML = '<span class="dot dot-been"></span>been <span class="dot dot-notyet"></span>not yet';
    $statusRow.appendChild($legend);
    $filters.appendChild($statusRow);

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
            entries.set(space.id, { space, marker, $item });
        });
        $group.appendChild($ol);
        $list.appendChild($group);
        groups.set(cat.id, $group);
    });

    if (!entries.size) $list.appendChild(el('li', 'empty', 'Nothing here yet.'));

    // Open on Europe-ish: fit everything, but don't zoom in too far
    const all = [...entries.values()].map(e => [e.space.lat, e.space.lng]);
    if (all.length > 1) map.fitBounds(L.latLngBounds(all), { padding: [40, 40], maxZoom: 5 });
})();
