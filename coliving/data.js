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
        description: 'A blend of hippie and rationalist culture, close to the TPOT scene. The Garden and the places with ties to it.'
    },
    {
        id: 'ea',
        name: 'EA / rationalist / AI safety',
        short: 'EA',
        color: '#b9a7ff',
        description: 'Spaces built around effective altruism, rationality and AI safety.'
    },
    {
        id: 'selforg',
        name: 'Self-organized',
        short: 'self-organized',
        color: '#f48fb1',
        description: 'Collectively run, low-cost and minimal. Residents share the work of running the place.'
    },
    {
        id: 'hacker',
        name: 'Hackerish',
        short: 'hacker',
        color: '#7ee0c3',
        description: 'Technology and AI, approached experimentally.'
    },
    {
        id: 'coworking',
        name: '(Mostly) just coworking',
        short: 'coworking',
        color: '#a8d4ff',
        description: 'Best when work is the main focus: fewer workshops and ceremonies, more desk time. These sit outside the social circles of the Garden-esque places.'
    }
];

/**
 * SPACES — one entry per place.
 * - id: unique identifier (lowercase, dashes)
 * - name, place: shown in the card header
 * - category: one of the category ids above
 * - lat, lng: coordinates (right-click a spot in Google Maps to copy them)
 * - status: 'been' or 'notyet'
 * - verdict: optional one-liner
 * - when: optional, e.g. 'summer 2025, 3 months'
 * - why: what it is and who it suits (\n\n = new paragraph)
 * - practical: optional one line of price / stay / how to get in
 * - priceFrom: rough € per month for the cheapest option, used for
 *              'sort by price' (0 = free / donation, leave out if unknown)
 * - suggestedBy: name of whoever proposed it, if it came from the form
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
        priceFrom: 950,
        when: 'back again May–Aug',
        why: 'A forest estate in northern Portugal whose community mixes rationalist and hippie culture. Best for slowing down: rest, nature and a warm, affectionate community.',
        goodFor: ['recovering from a busy or burnt-out stretch', 'community, nature and connection'],
        notFor: ['intense, heads-down work (though coworking is possible)'],
        practical: '€220/week sliding scale, 3 meals included · 1 week minimum · apply',
        links: [{ text: 'labs.thegarden.pt', url: 'https://labs.thegarden.pt/' }]
    },
    {
        id: 'fools-valley',
        name: 'Fools\' Valley',
        place: 'Sobral de Monte Agraço, near Lisbon',
        category: 'garden',
        lat: 39.0190,
        lng: -9.1510,
        status: 'been',
        priceFrom: 300,
        why: 'A smaller counterpart to The Garden, 30 minutes north of Lisbon, centred on movement, dialogue and meditation.',
        practical: 'rooms €150–525/week, dorms from €70/week, plus a meal fee · 2 weeks recommended · apply with a reference',
        links: [{ text: 'foolsvalley.com', url: 'https://foolsvalley.com/' }]
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
        why: 'An eco-living sanctuary in northern Portugal, similar in feel to The Garden. Seems geared more towards events than long residencies.',
        links: [{ text: 'coliven.com', url: 'https://coliven.com/communities/udyana-sanctuary' }]
    },
    {
        id: 'owls-nest',
        name: 'Owl\'s Nest',
        place: 'northern Portugal',
        category: 'garden',
        lat: 41.45,  // placeholder: exact location unknown
        lng: -8.2,
        status: 'notyet',
        why: 'A place in northern Portugal with some overlap in people with The Garden. No public website.',
        links: []
    },
    {
        id: 'feytopia',
        name: 'Feÿtopia',
        place: 'Villecien, Burgundy, France',
        category: 'garden',
        lat: 48.0130,
        lng: 3.3310,
        status: 'notyet',
        priceFrom: 1600,
        why: 'A community in a 17th-century château in Burgundy, similar in spirit to The Garden but more expensive. The season usually opens in December.',
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
        why: 'A restored forest villa near Barcelona, similar to The Garden but with a fuller programme of workshops and events, at a somewhat higher price. Run by a married couple, including Richard D. Bartlett.',
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
        why: 'A regenerative village in the Alentejo, similar to The Garden but more ascetic and more focused on farming.',
        practical: 'book through the site',
        links: [{ text: 'traditionaldreamfactory.com', url: 'https://www.traditionaldreamfactory.com/' }]
    },

    {
        id: 'life-itself',
        name: 'Life Itself',
        place: 'Bergerac, Dordogne, France',
        category: 'garden',
        lat: 44.8510,
        lng: 0.4820,
        status: 'notyet',
        priceFrom: 350,
        why: 'A residential hub in a riverside manor in Bergerac, where Garden-esque culture overlaps with EA: impact-minded, with room for wisdom and inner work. A lovely house, though reportedly not the most smoothly organised.',
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
        priceFrom: 300,
        why: 'A Renaissance château in Czechia that hosts an autumn season for the EA, AI safety and rationalist communities. Its strengths are a well-designed programme and skilled facilitation.',
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
        priceFrom: 0,
        verdict: 'highly recommended for the right person',
        why: 'A former hotel in Blackpool offering free or subsidised housing to people working on pressing global problems, especially AI safety. Ideal for working on a minimal budget.',
        goodFor: ['founders of a new project, startup or charity', 'AI safety researchers'],
        practical: 'free to £900/month for grantees, £30+/night self-funded · apply',
        links: [{ text: 'ceealar.org', url: 'https://www.ceealar.org/' }]
    },

    // ── Self-organized ─────────────────────────────────────────
    {
        id: 'massia',
        name: 'MASSIA',
        place: 'Massiaru, Estonia',
        category: 'selforg',
        lat: 57.9986,
        lng: 24.5885,
        status: 'been',
        priceFrom: 420,
        why: 'A collectively run residency in a former village school in rural Estonia. The quiet, unhurried atmosphere suits writing, painting and other creative work.',
        goodFor: ['writers, artists and creative projects'],
        practical: '€15–20/night, solidarity month on request · 1 hour/day of shared work',
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
        priceFrom: 0,
        why: 'A house for sustainable projects near Leipzig. Low-cost and minimal, with basic facilities and a modest amount of shared work. Comes well recommended.',
        notFor: ['long-term coworking: possibly too frugal'],
        practical: 'donation-based · invitation only',
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
        why: 'A collective in a converted chapel in Snowdonia that combines co-living, coworking and retreats. Hosts residencies for artists and technologists, with a focus on AI, creativity and regeneration, and runs immersive retreats for mission-driven teams.',
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
        priceFrom: 1200,
        why: 'A 14-room mountain villa outside Valencia built around remote work, with a coworking space, pool and shared dinners. Alcohol-free.',
        practical: '€1,200–2,100/month · 1 month minimum',
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
        priceFrom: 765,
        why: 'An off-grid valley sanctuary in the Alentejo offering co-living, self-retreats and residencies.',
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
        priceFrom: 600,
        why: 'Rural coliving in a small Galician village, set up for remote workers: fibre internet, shared dinners and a group of 10–15.',
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
        why: 'Coliving in an 18th-century family house in an Andalusian mountain village, with home-cooked meals, workshops and excursions.',
        practical: '2 to 8 weeks',
        links: [{ text: 'picassacoliving.com', url: 'https://picassacoliving.com/' }]
    },

    // ── further afield (garden-esque) ───────────────────────────
    {
        id: 'pachamama',
        name: 'PachaMama',
        place: 'San Juanillo, Guanacaste, Costa Rica',
        category: 'garden',
        lat: 10.0300,
        lng: -85.7000,
        status: 'notyet',
        why: 'A spiritual eco-village inspired by the teachings of Osho, centred on meditation, silent retreats and satsang. Strongly recommended by a friend.',
        practical: 'retreats from ~US$1,000/week incl. lodging · volunteer exchange: ~25 h/week for meals and a bed',
        links: [{ text: 'pachamama.com', url: 'https://www.pachamama.com/' }]
    },
    {
        id: 'vitalia',
        name: 'Vitalia',
        place: 'Roatán, Honduras',
        category: 'garden',
        lat: 16.3700,
        lng: -86.4400,
        status: 'notyet',
        priceFrom: 830,
        why: 'A pop-up city inside the Próspera special economic zone on Roatán, focused on longevity biotech, crypto cities and human enhancement. Draws founders, scientists and engineers working on frontier technology, and has a distinctive culture of its own.',
        practical: 'Citizen Pass US$1,000 plus housing from ~US$900/month · check the site for current dates',
        links: [{ text: 'vitalia.city', url: 'https://vitalia.city/' }]
    }
];

/**
 * DIRECTORIES — lists of lists, shown at the bottom of the page.
 */
const colivingDirectories = [
    {
        name: 'Coliven',
        url: 'https://coliven.com/communities',
        description: 'A searchable directory of co-living communities worldwide.'
    },
    {
        name: 'ALIKE?',
        url: 'https://pad.totalism.org/p/alike',
        description: 'An open, community-edited list of hackbases, nomad bases, free-living spots and residencies.'
    },
    {
        name: 'Freeing Space',
        url: 'https://freeingspace.com/',
        description: 'A map documenting communes, cooperatives and other spaces organised outside the market economy.'
    },
    {
        name: 'WWOOF',
        url: 'https://wwoof.net/',
        description: 'A worldwide network of organic farms that host volunteers in exchange for food and lodging.'
    }
];
