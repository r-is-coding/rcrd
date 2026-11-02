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
        name: 'Hippie-rationalist',
        short: 'hippie-rationalist',
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
        description: 'Best when work is the main focus: fewer workshops and ceremonies, more desk time. These sit outside the social circles of the hippie-rationalist places.'
    },
    {
        id: 'meditation',
        name: 'Meditation',
        short: 'meditation',
        color: '#f5e6c4',
        description: 'Retreat centres and monasteries, mostly in the Theravada and insight traditions. Not co-living in the usual sense, but places to stay a while and go inward.'
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
 *              'sort by price' and the budget filter (0 = free / donation
 *              / work exchange; leave out if unknown). For retreat centres
 *              it's the per-day cost scaled to a month.
 * - suggestedBy: name of whoever proposed it, if it came from the form
 * - goodFor, notFor, tags: optional lists
 * - links: optional [{ text, url }]
 *
 * Practical details were checked in Oct 2026. Coordinates are mostly
 * town-level, since few places publish an exact address.
 */
const colivingSpaces = [
    // ── Hippie-rationalist ─────────────────────────────────────
    {
        id: 'the-garden',
        name: 'The Garden',
        place: 'Deocriste, northern Portugal',
        category: 'garden',
        lat: 41.6780,  // south of the village, towards the Lima
        lng: -8.7050,
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
        id: 'karapanou',
        name: 'Oikia Karapanou',
        place: 'Perivola, Aegina, Greece',
        category: 'garden',
        lat: 37.7250,
        lng: 23.4650,
        status: 'been',
        when: 'for a Plum Village retreat',
        why: 'A retreat house on the island of Aegina with a year-round programme of workshops, retreats and residencies: movement, dance, yoga, voice, creative writing, Way of Council gatherings and Plum Village mindfulness retreats led by monastics.',
        practical: 'events from a weekend to two weeks, roughly late January to mid-November · book per event',
        links: [{ text: 'karapanou.com', url: 'https://www.karapanou.com/programme/' }]
    },
    {
        id: 'owls-nest',
        name: 'Owl\'s Nest',
        place: 'northern Portugal',
        category: 'garden',
        lat: 41.45,  // placeholder: exact location unknown
        lng: -8.2,
        status: 'notyet',
        why: 'A young community in northern Portugal, still being built, with a small core group and plenty of overlap in people with The Garden. It is not clear whether residents are being taken in yet, but more and more is happening there, so it is worth asking.',
        practical: 'no public website yet · ask through the Garden community',
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
        practical: '1 week to 1 month stays · no prices published, email to ask',
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
        priceFrom: 120,
        why: 'A regenerative village in the Alentejo, similar to The Garden but more ascetic and more focused on farming.',
        practical: 'volunteers: mornings 9–1 for a dorm bed or camping spot and meals, €4/day for utilities · rooms, cabins and camping bookable on the site, prices on request',
        links: [{ text: 'traditionaldreamfactory.com', url: 'https://www.traditionaldreamfactory.com/' }]
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
        why: 'A former hotel in Blackpool that houses and feeds people working on pressing global problems, especially AI safety, for free. Some grantees also get a stipend. Ideal for working on a minimal budget.',
        goodFor: ['founders of a new project, startup or charity', 'AI safety researchers'],
        practical: 'grantees: room and vegan food free (sliding scale up to £900/month), stipend possible, if your project is impactful enough · self-funded from £30/night · up to 12 months · apply',
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
        priceFrom: 1700,
        why: 'A collective in a converted chapel in Snowdonia that combines co-living, coworking and retreats. Hosts residencies for artists and technologists, with a focus on AI, creativity and regeneration, and runs immersive retreats for mission-driven teams.',
        practical: '£50/night when last checked · residencies for artists and technologists · book a call',
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
        status: 'been',
        priceFrom: 1200,
        why: 'A 16-room mountain villa outside Valencia built squarely around remote work: coworking desks with dual screens, a pool and a gym, plus shared dinners most nights. Alcohol-free on the property.',
        notFor: ['anyone after a sauna: there is none'],
        practical: 'rooms €1,200–2,100/month, food not included · 1 month minimum',
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
        practical: 'breakfast, workstations and excursions included · 2 to 8 weeks · prices on request',
        links: [{ text: 'picassacoliving.com', url: 'https://picassacoliving.com/' }]
    },

    // ── Contact improvisation / dance ──────────────────────────
    {
        id: 'servivo',
        name: 'SerVivo',
        place: 'Vale dos Barris, Palmela, near Lisbon',
        category: 'garden',
        lat: 38.5600,
        lng: -8.9300,
        status: 'notyet',
        priceFrom: 900,
        why: 'A cooperative-run venue in a valley of the Arrábida natural park, south of Lisbon, centred on contact improvisation: weekly classes, a regular jam and dance and meditation retreats. A core team of eight lives on site with a rotating group of volunteers.',
        practical: 'Community Experience: €25–40/night by accommodation (own tent to private room), sliding ±€5, plus €40/week for food · 4 nights minimum · also volunteering and European Solidarity Corps placements',
        links: [{ text: 'servivo.earth', url: 'https://www.servivo.earth/' }]
    },
    {
        id: 'cristaland-lagos',
        name: 'Cristaland Lagos',
        place: 'Lagos, Algarve, Portugal',
        category: 'garden',
        lat: 37.1200,
        lng: -8.6800,
        status: 'notyet',
        priceFrom: 0,
        why: 'An eco-community in the Algarve where residents share gardening, plant-based cooking and building, and the programme runs to ecstatic dance, contact dance, sound healing, yoga and singing circles.',
        practical: 'volunteers: 5 h/day, 5 days a week for a bed and all meals, 2 months minimum · guests: yurt, glamping tent or own van, prices on request',
        links: [{ text: 'cristalandlagos.com', url: 'https://www.cristalandlagos.com/' }]
    },

    // ── further afield (hippie-rationalist) ─────────────────────
    {
        id: 'pachamama',
        name: 'PachaMama',
        place: 'San Juanillo, Guanacaste, Costa Rica',
        category: 'garden',
        lat: 10.0300,
        lng: -85.7000,
        status: 'notyet',
        priceFrom: 60,
        why: 'A spiritual eco-village inspired by the teachings of Osho, centred on meditation, silent retreats and satsang. Strongly recommended by a friend.',
        practical: 'guests from US$48/night plus tax, meals paid by weight (~US$11–17 each), 7 nights minimum, 15% off from 20 nights · volunteers: ~25 h/week for lunch, dinner soup and camping at US$1–2/night or a casita at US$12–15, 6 weeks minimum',
        links: [{ text: 'pachamama.com', url: 'https://www.pachamama.com/' }]
    },
    {
        id: 'vitalia',
        name: 'Vitalia',
        place: 'Roatán, Honduras',
        category: 'hacker',
        lat: 16.3700,
        lng: -86.4400,
        status: 'notyet',
        priceFrom: 830,
        why: 'A pop-up city inside the Próspera special economic zone on Roatán, focused on longevity biotech, crypto cities and human enhancement. Draws founders, scientists and engineers working on frontier technology, and has a distinctive culture of its own.',
        practical: 'Citizen Pass US$1,000 plus housing from ~US$900/month · check the site for current dates',
        links: [{ text: 'vitalia.city', url: 'https://vitalia.city/' }]
    },

    // ── Meditation ─────────────────────────────────────────────
    {
        id: 'sangha-ee',
        name: 'Eesti Theeravaada Sangha',
        place: 'Aegna island, Tallinn, Estonia',
        category: 'meditation',
        lat: 59.5850,
        lng: 24.7600,
        status: 'been',
        why: 'A Theravada forest monastery on Aegna island, off Tallinn, with weekend meditation retreats, courses and study groups.',
        practical: 'weekend retreats by donation, ~€160 in a shared room or €250 single, meals included, plus €35 for the boat from October to May · register on the site',
        links: [{ text: 'sangha.ee', url: 'https://sangha.ee/' }]
    },
    {
        id: 'gaia-house',
        name: 'Gaia House',
        place: 'West Ogwell, Devon, England',
        category: 'meditation',
        lat: 50.5200,
        lng: -3.6600,
        status: 'notyet',
        why: 'A charity retreat centre in Devon offering silent insight meditation retreats in the Buddhist tradition: group retreats, personal retreats and service retreats.',
        practical: 'group retreats at a standard, basic or supported rate, 70% off for ages 18–25 · personal retreats from 2 nights to 3 months, priced on the site · Dharma Service retreats: 5 h/day of work for a low-cost stay of 2 weeks to 3 months',
        links: [{ text: 'gaiahouse.co.uk', url: 'https://gaiahouse.co.uk/' }]
    },
    {
        id: 'suan-mokkh',
        name: 'Suan Mokkh International Dharma Hermitage',
        place: 'Chaiya, Surat Thani, Thailand',
        category: 'meditation',
        lat: 9.3380,
        lng: 99.1680,
        status: 'notyet',
        why: 'The international hermitage of Suan Mokkh, founded by Buddhadāsa Bhikkhu, in a coconut grove in southern Thailand. Runs a 10-day silent retreat every month, teaching mindfulness of breathing and the core of the Buddha\'s teaching.',
        priceFrom: 160,
        practical: '2,000 baht (~€55) for the full 10 days, room and two vegetarian meals a day included · starts the 1st of each month · register in person the day before; no advance booking',
        links: [{ text: 'suanmokkh-idh.org', url: 'https://www.suanmokkh-idh.org/' }]
    },
    {
        id: 'indriya',
        name: 'Indriya Retreat',
        place: 'Koh Phangan, Thailand',
        category: 'meditation',
        lat: 9.7650,
        lng: 99.9650,
        status: 'notyet',
        why: 'A meditation retreat centre on Koh Phangan led by former monk Anthony Markwell, teaching Buddhist meditation from the Southeast Asian monastic tradition. Mostly Vipassana retreats of 7 to 21 days.',
        priceFrom: 1300,
        practical: 'roughly US$350 for 7 days to US$700 for 16, bungalow and two vegetarian meals a day included · 7–21 day retreats · book online',
        links: [{ text: 'indriyaretreat.com', url: 'https://indriyaretreat.com/' }]
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
