/* ═══════════════════════════════════════════════════════════════
   RCRD — Co-living map data
   Add, remove or reorder freely.
   ═══════════════════════════════════════════════════════════════ */

/**
 * CATEGORIES — the list is grouped and colored by these, in this order.
 * - id: referenced by each space's `category`
 * - name: group heading
 * - short: label on the filter chip
 * - color: dot / heading color
 * - description: shown under the heading (\n\n for a new paragraph)
 */
const colivingCategories = [
    {
        id: 'garden',
        name: 'The Garden & its cousins',
        short: 'garden-esque',
        color: '#ffb08a',
        description: 'Hippy + rationalist, TPOT-esque. The Garden and everything that feels connected to it.'
    },
    {
        id: 'between',
        name: 'Between the Garden and EA',
        short: 'in between',
        color: '#ffd89b',
        description: 'Where the Garden-esque and EA worlds overlap: EA-minded, with more room for wisdom, culture and inner work. Int/a-adjacent.'
    },
    {
        id: 'ea',
        name: 'EA / rationalist / AI safety',
        short: 'EA',
        color: '#b9a7ff',
        description: 'Cleanly EA, rationalist and AI safety.'
    },
    {
        id: 'selforg',
        name: 'Self-organized',
        short: 'self-organized',
        color: '#f48fb1',
        description: 'Collectively run, cheap and minimal. Expect to pitch in.'
    },
    {
        id: 'hacker',
        name: 'Hackerish',
        short: 'hacker',
        color: '#7ee0c3',
        description: 'Tech and AI, in a more experimental key.'
    },
    {
        id: 'coworking',
        name: '(Mostly) just coworking',
        short: 'coworking',
        color: '#a8d4ff',
        description: 'Decent picks if work is the focus, with less vibing and hippy stuff. These sit outside the community bonds of the Garden-esque places.'
    }
];

/**
 * SPACES — one entry per place.
 * - id: unique identifier (lowercase, dashes)
 * - name, place: shown in the card header
 * - category: one of the category ids above
 * - lat, lng: coordinates (right-click a spot in Google Maps to copy them)
 * - status: 'been' or 'notyet'
 * - verdict: optional one-liner, e.g. 'would go back in a heartbeat'
 * - when: optional, e.g. 'summer 2025, 3 months'
 * - why: the answer to "would you recommend it, and why?" (\n\n = new paragraph)
 * - practical: optional one line of price / stay / how to get in
 * - goodFor, notFor, tags: optional lists
 * - links: optional [{ text, url }]
 *
 * Practical details were checked in Oct 2026. Coordinates are mostly
 * town-level, since few places publish an exact address.
 */
const colivingSpaces = [
    // ── The Garden & its cousins ───────────────────────────────
    {
        id: 'the-garden',
        name: 'The Garden',
        place: 'Deocriste, northern Portugal',
        category: 'garden',
        lat: 41.6905,
        lng: -8.7044,
        status: 'been',
        verdict: '',
        when: 'probably back May–Aug',
        why: 'A magical forest you sometimes get lost in while walking around northern Portugal. Inhabited by fairies and forest elves who give you tea and tell you stories. You will miss them.\n\nRational hippies. Go there to downregulate, touch grass, rest and cuddle.',
        goodFor: ['resting and downregulating', 'community, cuddles, nature'],
        notFor: ['intense coworking (though coworking is definitely possible)'],
        practical: '€220/week sliding scale, 3 meals included · 1 week minimum · apply',
        links: [{ text: 'labs.thegarden.pt', url: 'https://labs.thegarden.pt/' }]
    },
    {
        id: 'owls-nest',
        name: 'Owl\'s Nest',
        place: 'northern Portugal',
        category: 'garden',
        lat: 41.45,  // placeholder: exact location unknown
        lng: -8.2,
        status: 'notyet',
        why: 'Part of the same northern Portugal scene. No website I know of.',
        links: []
    },
    {
        id: 'fools-valley',
        name: 'Fools\' Valley',
        place: 'Sobral de Monte Agraço, near Lisbon',
        category: 'garden',
        lat: 39.0190,
        lng: -9.1510,
        status: 'been',
        why: 'Similar to The Garden, but smaller.',
        practical: 'rooms €150–525/week, dorms from €70/week, plus a meal fee · 2 weeks recommended · apply with a reference',
        links: [{ text: 'foolsvalley.com', url: 'https://foolsvalley.com/' }]
    },
    {
        id: 'feytopia',
        name: 'Feÿtopia',
        place: 'Villecien, Burgundy, France',
        category: 'garden',
        lat: 48.0130,
        lng: 3.3310,
        status: 'notyet',
        why: "Similar to The Garden, probably pricier. Usually opens in December, I think. Haven't been.",
        practical: '€1,000–3,000/month, food extra · 2 weeks to 4 months · apply',
        links: [{ text: 'feytopia.com', url: 'https://feytopia.com/' }]
    },
    {
        id: 'casa-tilo',
        name: 'Casa Tilo',
        place: 'near Arenys de Munt, Catalonia',
        category: 'garden',
        lat: 41.6100,
        lng: 2.5400,
        status: 'notyet',
        why: "Similar to The Garden, but with even more workshops and events. Slightly more expensive. Run by a married couple, one of them Richard D. Bartlett. Haven't been.",
        practical: '1 week to 1 month stays',
        links: [{ text: 'eltilo.casa', url: 'https://www.eltilo.casa/' }]
    },
    {
        id: 'traditional-dream-factory',
        name: 'Traditional Dream Factory',
        place: 'Abela, Alentejo, Portugal',
        category: 'garden',
        lat: 38.0200,
        lng: -8.5800,
        status: 'notyet',
        why: 'Similar to The Garden, perhaps more ascetic and more farming-oriented. Haven\'t been.',
        practical: 'book through the site',
        links: [{ text: 'traditionaldreamfactory.com', url: 'https://www.traditionaldreamfactory.com/' }]
    },
    {
        id: 'udyana',
        name: 'Udyāna Sanctuary',
        place: 'Lago, northern Portugal',
        category: 'garden',
        lat: 41.6156,
        lng: -8.4253,
        status: 'been',
        when: 'for an event',
        why: 'Nice place. Kind of similar to The Garden, but more for events than residencies, I think.',
        links: [{ text: 'coliven.com', url: 'https://coliven.com/communities/udyana-sanctuary' }]
    },
    {
        id: 'life-itself',
        name: 'Life Itself',
        place: 'Bergerac, Dordogne, France',
        category: 'between',
        lat: 44.8510,
        lng: 0.4820,
        status: 'notyet',
        why: 'Nice house, though I\'ve heard it might not be the best organized.',
        practical: '€350–850/month plus food · 1 week to 3 months · apply',
        links: [{ text: 'lifeitself.org', url: 'https://lifeitself.org/residencies' }]
    },

    // ── EA / rationalist / AI safety ───────────────────────────
    {
        id: 'hostacov',
        name: 'Hostačov',
        place: 'Vysočina, Czechia',
        category: 'ea',
        lat: 49.8480,
        lng: 15.4928,
        status: 'been',
        why: 'A great EA / AI safety / rationalist place in Czechia. What makes it is the programme and the facilitation.',
        practical: '€10–70/day sliding scale, all-inclusive · autumn season · apply',
        links: [{ text: 'fall.hostacov.com', url: 'https://fall.hostacov.com/' }]
    },
    {
        id: 'ceealar',
        name: 'CEEALAR',
        place: 'Blackpool, England',
        category: 'ea',
        lat: 53.8100,
        lng: -3.0540,
        status: 'been',
        verdict: "yes, if you're working on something important",
        why: 'For people working on important global problems, especially AI safety, who want to live on a €0 budget.',
        goodFor: ['starting a startup, a charity or another project', 'AI safety work'],
        practical: 'free to £900/month for grantees, £30+/night self-funded · apply',
        links: [{ text: 'ceealar.org', url: 'https://www.ceealar.org/' }]
    },

    // ── Self-organized ────────────────────────────────────────
    {
        id: 'massia',
        name: 'MASSIA',
        place: 'Massiaru, Estonia',
        category: 'selforg',
        lat: 57.9986,
        lng: 24.5885,
        status: 'been',
        why: 'The vibe lends itself nicely to writing, painting and that kind of work.',
        goodFor: ['writing, painting, creative work'],
        practical: '€15–20/night, solidarity month on request · 1 hour/day of care work',
        links: [{ text: 'massia.ee', url: 'https://www.massia.ee/' }]
    },
    {
        id: 'kanthaus',
        name: 'Kanthaus',
        place: 'Wurzen, near Leipzig, Germany',
        category: 'selforg',
        lat: 51.3660,
        lng: 12.7390,
        status: 'notyet',
        why: 'Haven\'t been, but heard good things. Low cost, minimal living, basic facilities. Some volunteering needed, but not much.',
        practical: 'donation-based · invitation only',
        notFor: ['long-term coworking: perhaps too frugal and ascetic'],
        links: [{ text: 'kanthaus.online', url: 'https://kanthaus.online/de' }]
    },

    // ── Hackerish ──────────────────────────────────────────────
    {
        id: 'astralship',
        name: 'Astralship',
        place: 'Snowdonia, Wales',
        category: 'hacker',
        lat: 53.1460,
        lng: -4.1210,
        status: 'been',
        why: 'A collective based in a converted chapel in Snowdonia, mixing co-living, coworking and retreats. Residencies for artists and technologists, with a focus on AI and tech, creativity and regeneration. They also run "voyages": immersive retreats for teams on a mission.',
        practical: 'book a call to ask about prices and residencies',
        links: [{ text: 'astralship.org', url: 'https://astralship.org/' }]
    },

    // ── (Mostly) just coworking ────────────────────────────────
    {
        id: 'savi',
        name: 'SAVI Coliving',
        place: 'Sierra Calderona, near Valencia',
        category: 'coworking',
        lat: 39.6580,
        lng: -0.4250,
        status: 'notyet',
        why: 'Haven\'t been.',
        practical: '€1,200–2,100/month · 1 month minimum · alcohol-free',
        links: [{ text: 'savicoliving.com', url: 'https://savicoliving.com/' }]
    },
    {
        id: 'satvana',
        name: 'Satvana',
        place: 'São Martinho das Amoreiras, Alentejo',
        category: 'coworking',
        lat: 37.6300,
        lng: -8.4600,
        status: 'notyet',
        why: 'Haven\'t been.',
        practical: '~€700–1,350 for 28 nights · 2 weeks to 2 months · book online',
        links: [{ text: 'satvana.org', url: 'https://satvana.org/stay/' }]
    },
    {
        id: 'anceu',
        name: 'Anceu Coliving',
        place: 'Ponte Caldelas, Galicia',
        category: 'coworking',
        lat: 42.3515,
        lng: -8.4664,
        status: 'notyet',
        why: 'Haven\'t been.',
        practical: '€600–1,200/month by season · 15 to 60 days',
        links: [{ text: 'anceu.com', url: 'https://anceu.com/' }]
    },
    {
        id: 'picassa',
        name: 'Picassa Coliving',
        place: 'Purchena, Andalusia',
        category: 'coworking',
        lat: 37.3460,
        lng: -2.3600,
        status: 'notyet',
        why: 'Haven\'t been.',
        practical: '2 to 8 weeks',
        links: [{ text: 'picassacoliving.com', url: 'https://picassacoliving.com/' }]
    }
];
