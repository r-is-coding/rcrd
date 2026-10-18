/* ═══════════════════════════════════════════════════════════════
   RCRD — Co-living map data
   One entry per place. Add, remove or reorder freely.
   ═══════════════════════════════════════════════════════════════ */

/**
 * Properties:
 * - id: unique identifier (lowercase, dashes)
 * - name: the space's name
 * - place: town / region, country (shown under the name)
 * - lat, lng: coordinates (right-click a spot in Google Maps to copy them)
 * - status: 'been'        → I've stayed there
 *           'considering' → on my list, haven't been yet
 * - verdict: short recommendation, e.g. 'would go back in a heartbeat'
 *            (leave '' for places you haven't been)
 * - when: optional, e.g. 'summer 2025, 3 months'
 * - why: the main answer to "would you recommend it, and why?"
 *        Use \n\n for a new paragraph.
 * - goodFor: optional list of who will love it
 * - notFor: optional list of who might not
 * - tags: optional short labels, e.g. ['nature', 'volunteering']
 * - links: optional [{ text, url }]
 */
const colivingSpaces = [
    {
        id: 'the-garden',
        name: 'The Garden',
        place: 'northern Portugal',
        lat: 41.3,  // approximate, adjust to the exact spot
        lng: -7.9,
        status: 'been',
        verdict: '',
        when: 'probably back May–Aug',
        why: 'A magical forest you sometimes get lost in while walking around northern Portugal. Inhabited by fairies and forest elves who give you tea and tell you stories. You will miss them.',
        goodFor: [],
        notFor: [],
        tags: [],
        links: [
            { text: 'thegarden.pt', url: 'https://thegarden.pt/' }
        ]
    }
];
