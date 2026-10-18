/* ═══════════════════════════════════════════════════════════════
   RCRD — "Propose a place" form
   Proposals are sent to Formspree, which emails them to me.
   ═══════════════════════════════════════════════════════════════ */

// The ID from your Formspree form's endpoint: https://formspree.io/f/<ID>
const FORMSPREE_ID = '';

(function () {
    const map = window.colivingMap;
    const $listView = document.getElementById('list-view');
    const $view = document.getElementById('propose-view');
    const $form = document.getElementById('propose-form');
    const $status = document.getElementById('form-status');
    const $done = document.getElementById('propose-done');
    const $hint = document.getElementById('pin-hint');
    const $pinField = $form.elements['Map pin'];
    const $submit = $form.querySelector('.submit-btn');
    const $panel = document.querySelector('.panel');
    const HASH = '#propose';
    const defaultHint = $hint.textContent;

    let pin = null;

    // ── Showing and hiding the form ──
    function render() {
        const open = location.hash === HASH;
        $view.hidden = !open;
        $listView.hidden = open;
        map.getContainer().classList.toggle('is-picking', open);
        if (!open) clearPin();
        $panel.scrollTop = 0;
    }

    let openedFromList = false;

    document.getElementById('propose-open').addEventListener('click', () => {
        openedFromList = true;
        history.pushState(null, '', HASH);
        render();
    });

    document.getElementById('propose-close').addEventListener('click', () => {
        // Step back if we came from the list, so the back button stays in sync
        if (openedFromList) history.back();
        else { history.pushState(null, '', location.pathname + location.search); render(); }
        openedFromList = false;
    });

    window.addEventListener('popstate', render);

    document.getElementById('propose-again').addEventListener('click', () => {
        $form.reset();
        clearPin();
        $done.hidden = true;
        $form.hidden = false;
        $panel.scrollTop = 0;
    });

    // ── Dropping a pin on the map ──
    const pinIcon = L.divIcon({
        className: '',
        html: '<div class="marker marker-pin"><span></span></div>',
        iconSize: [18, 18],
        iconAnchor: [9, 9]
    });

    function setPin(latlng) {
        const lat = latlng.lat.toFixed(4);
        const lng = L.Util.wrapNum(latlng.lng, [-180, 180], true).toFixed(4);
        if (!pin) {
            pin = L.marker(latlng, { icon: pinIcon, draggable: true }).addTo(map);
            pin.on('dragend', () => setPin(pin.getLatLng()));
        } else {
            pin.setLatLng(latlng);
        }
        $pinField.value = `${lat}, ${lng}`;
        $hint.textContent = `◎ pinned at ${lat}, ${lng} · drag it to adjust`;
        $hint.classList.add('is-set');
    }

    function clearPin() {
        if (pin) { pin.remove(); pin = null; }
        $pinField.value = '';
        $hint.textContent = defaultHint;
        $hint.classList.remove('is-set');
    }

    map.on('click', (e) => {
        if (location.hash === HASH && !$form.hidden) setPin(e.latlng);
    });

    // ── Sending ──
    function showStatus(message, isError) {
        $status.textContent = message;
        $status.classList.toggle('is-error', !!isError);
    }

    function validate() {
        const f = $form.elements;
        if (!f['Place name'].value.trim()) return ['Please give the place a name.', f['Place name']];
        if (!f['Location'].value.trim() && !$pinField.value) return ['Where is it? Type a town or drop a pin on the map.', f['Location']];
        if (!$form.querySelector('input[name="Been there?"]:checked')) return ['Have you been there?', $form.querySelector('input[name="Been there?"]')];
        if (!f['Your name'].value.trim()) return ['Tell me who you are, so I can credit you.', f['Your name']];
        if (f['Link'].value && !f['Link'].checkValidity()) return ['The link should start with http:// or https://', f['Link']];
        if (f['email'].value && !f['email'].checkValidity()) return ['That email doesn\'t look right.', f['email']];
        return null;
    }

    $form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const problem = validate();
        if (problem) {
            showStatus(problem[0], true);
            problem[1].focus();
            return;
        }
        if (!FORMSPREE_ID) {
            showStatus('Proposals aren\'t switched on yet. Check back soon!', true);
            return;
        }

        const data = new FormData($form);
        data.append('_subject', `Co-living proposal: ${data.get('Place name')}`);

        $submit.disabled = true;
        showStatus('sending…');
        try {
            const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
                method: 'POST',
                body: data,
                headers: { Accept: 'application/json' }
            });
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                const detail = (body.errors || []).map(x => x.message).join(' ');
                throw new Error(detail || `status ${res.status}`);
            }
            showStatus('');
            $form.reset();
            clearPin();
            $form.hidden = true;
            $done.hidden = false;
            $panel.scrollTop = 0;
        } catch (err) {
            showStatus(`Something went wrong (${err.message}). Please try again in a bit.`, true);
        } finally {
            $submit.disabled = false;
        }
    });

    render();
})();
