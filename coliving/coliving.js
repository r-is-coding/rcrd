/* ═══════════════════════════════════════════════════════════════
   RCRD — Co-living map logic
   Content lives in data.js
   ═══════════════════════════════════════════════════════════════ */

(function () {
    const STATUS_LABEL = { been: 'been', considering: 'considering' };

    const map = L.map('map', {
        preferCanvas: true,
        zoomControl: true,
        attributionControl: true,
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
            const land = topojson.feature(topo, topo.objects.countries);
            L.geoJSON(land, {
                interactive: false,
                style: {
                    color: 'rgba(168, 212, 255, 0.28)',
                    weight: 0.6,
                    fillColor: '#1a1530',
                    fillOpacity: 1
                }
            }).addTo(map).bringToBack();
        })
        .catch(() => { /* map still works, just without outlines */ });

    const $list = document.getElementById('places');
    const entries = new Map(); // id → { space, marker, $item }
    let activeId = null;

    function el(tag, className, text) {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text != null) node.textContent = text;
        return node;
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

    function buildItem(space) {
        const $item = el('li', 'place');
        $item.dataset.status = space.status;

        const $head = el('button', 'place-head');
        $head.type = 'button';
        $head.setAttribute('aria-expanded', 'false');
        $head.appendChild(el('span', `dot dot-${space.status}`));
        $head.appendChild(el('span', 'place-name', space.name));
        const meta = [space.place, STATUS_LABEL[space.status], space.when].filter(Boolean).join(' · ');
        $head.appendChild(el('span', 'place-meta', meta));
        if (space.verdict) $head.appendChild(el('span', 'place-verdict', space.verdict));
        $item.appendChild($head);

        const $body = el('div', 'place-body');
        const $why = el('div', 'place-why');
        (space.why || '').split(/\n\s*\n/).filter(Boolean).forEach(p => $why.appendChild(el('p', null, p.trim())));
        $body.appendChild($why);
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
        const icon = L.divIcon({
            className: '',
            html: `<div class="marker marker-${space.status}"><span></span></div>`,
            iconSize: [18, 18],
            iconAnchor: [9, 9]
        });
        const marker = L.marker([space.lat, space.lng], { icon, title: space.name, keyboard: true });
        marker.bindTooltip(space.name, { className: 'place-tooltip', direction: 'top', offset: [0, -10] });
        marker.on('click', () => select(space.id, { scroll: true }));
        return marker;
    }

    function setMarkerActive(entry, on) {
        const $m = entry.marker.getElement();
        if ($m) $m.querySelector('.marker').classList.toggle('is-active', on);
        entry.marker.setZIndexOffset(on ? 1000 : 0);
    }

    function select(id, { fly = false, scroll = false, toggle = false } = {}) {
        if (activeId && entries.has(activeId)) {
            const prev = entries.get(activeId);
            prev.$item.classList.remove('is-open');
            prev.$item.querySelector('.place-head').setAttribute('aria-expanded', 'false');
            setMarkerActive(prev, false);
        }
        if (toggle && activeId === id) { activeId = null; return; }

        activeId = id;
        const entry = entries.get(id);
        entry.$item.classList.add('is-open');
        entry.$item.querySelector('.place-head').setAttribute('aria-expanded', 'true');
        setMarkerActive(entry, true);

        if (fly) map.flyTo([entry.space.lat, entry.space.lng], Math.max(map.getZoom(), 5), { duration: 1.2 });
        if (scroll) entry.$item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function applyFilter(filter) {
        entries.forEach(entry => {
            const show = filter === 'all' || entry.space.status === filter;
            entry.$item.hidden = !show;
            if (show) entry.marker.addTo(map); else entry.marker.remove();
        });
    }

    // Build everything — places you've been come first
    const order = { been: 0, considering: 1 };
    const spaces = [...colivingSpaces].sort((a, b) => (order[a.status] ?? 2) - (order[b.status] ?? 2));

    if (!spaces.length) $list.appendChild(el('li', 'empty', 'Nothing here yet.'));

    spaces.forEach(space => {
        const $item = buildItem(space);
        const marker = buildMarker(space).addTo(map);
        $list.appendChild($item);
        entries.set(space.id, { space, marker, $item });
    });

    if (spaces.length > 1) {
        map.fitBounds(L.latLngBounds(spaces.map(s => [s.lat, s.lng])), { padding: [60, 60], maxZoom: 5 });
    }

    document.querySelectorAll('.chip').forEach($chip => {
        $chip.addEventListener('click', () => {
            document.querySelectorAll('.chip').forEach(c => c.classList.toggle('is-active', c === $chip));
            applyFilter($chip.dataset.filter);
        });
    });
})();
