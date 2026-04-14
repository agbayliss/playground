/**
 * ============================================================================
 * ChronoVoyage — Time Travel Vacation Planner
 * DATA.JS — Shared Dataset
 * ============================================================================
 *
 * This file contains all the reference data used across every page of the
 * ChronoVoyage demo. It is loaded via a <script> tag and exposes everything
 * on `window.ChronoData`.
 *
 * Datasets:
 *   - eras            (14 entries)  – historical & speculative time periods
 *   - packageTemplates (5 entries)  – reusable trip configuration templates
 *   - addOns          (10 entries)  – optional extras for any trip
 *   - prerequisites    (7 entries)  – visa / insurance / vaccination requirements
 *   - durations        (4 entries)  – available trip lengths in days
 *
 * Design notes:
 *   - IDs use kebab-case (e.g. "ancient-rome", "language-implant")
 *   - Years are numbers; negative = BCE  (e.g. -509 = 509 BCE)
 *   - Every cross-reference is bidirectional and consistent
 *   - No build tools — plain JS, no imports
 * ============================================================================
 */

window.ChronoData = (function () {
  "use strict";

  // ==========================================================================
  // PREREQUISITES
  // ==========================================================================
  // Defined first so eras can reference them.

  const prerequisites = [
    {
      id: "temporal-visa-standard",
      name: "Standard Temporal Visa",
      type: "visa",
      description:
        "Basic authorization to travel to low-risk historical periods (Clearance Level 1).",
      requiredForEras: [
        "edo-japan",
        "jazz-age-nyc",
        "ancient-egypt",
        "renaissance-florence",
        "silk-road",
        "belle-epoque-paris",
        "mughal-india",
        "great-zimbabwe",
      ],
    },
    {
      id: "temporal-visa-advanced",
      name: "Advanced Temporal Visa",
      type: "visa",
      description:
        "Enhanced authorization required for medium-risk eras with significant cultural complexity (Clearance Level 2).",
      requiredForEras: [
        "ancient-rome",
        "neo-tokyo-2145",
        "mayan-classic",
        "wild-west",
      ],
    },
    {
      id: "temporal-visa-extreme",
      name: "Extreme Temporal Visa",
      type: "visa",
      description:
        "Maximum-clearance authorization for high-danger eras with active conflict or extreme conditions (Clearance Level 3).",
      requiredForEras: [
        "viking-scandinavia",
        "orbital-colonies-2300",
        "mongol-empire",
      ],
    },
    {
      id: "paradox-insurance-basic",
      name: "Basic Paradox Insurance",
      type: "insurance",
      description:
        "Covers minor timeline disruptions and accidental butterfly effects up to Severity Class 2.",
      requiredForEras: [
        "ancient-rome",
        "edo-japan",
        "jazz-age-nyc",
        "ancient-egypt",
        "renaissance-florence",
        "silk-road",
        "belle-epoque-paris",
        "mayan-classic",
        "wild-west",
        "mughal-india",
        "great-zimbabwe",
      ],
    },
    {
      id: "paradox-insurance-premium",
      name: "Premium Paradox Insurance",
      type: "insurance",
      description:
        "Full-spectrum paradox coverage including causal loop repair and timeline branch reconciliation.",
      requiredForEras: [
        "viking-scandinavia",
        "neo-tokyo-2145",
        "orbital-colonies-2300",
        "mongol-empire",
      ],
    },
    {
      id: "vaccination-historical",
      name: "Historical Pathogen Vaccination Suite",
      type: "vaccination",
      description:
        "Broad-spectrum immunization against diseases prevalent in pre-modern eras (plague, smallpox, cholera, etc.).",
      requiredForEras: [
        "ancient-rome",
        "viking-scandinavia",
        "ancient-egypt",
        "renaissance-florence",
        "silk-road",
        "mayan-classic",
        "wild-west",
        "mughal-india",
        "great-zimbabwe",
        "mongol-empire",
      ],
    },
    {
      id: "vaccination-future",
      name: "Future Biome Adaptation Shot",
      type: "vaccination",
      description:
        "Prepares your immune system for engineered pathogens and synthetic atmospheres found in speculative future eras.",
      requiredForEras: [
        "neo-tokyo-2145",
        "orbital-colonies-2300",
      ],
    },
  ];

  // ==========================================================================
  // ADD-ONS
  // ==========================================================================

  const addOns = [
    // --- Universal add-ons (available for every era) ---
    {
      id: "language-implant",
      name: "Neural Language Implant",
      description:
        "Temporary neural overlay that grants fluency in the dominant language(s) of your destination era.",
      price: 299,
      applicableEras: "all",
    },
    {
      id: "paradox-insurance-addon",
      name: "Paradox Insurance Upgrade",
      description:
        "Upgrades your insurance to cover Class 3+ timeline disruptions — recommended for the clumsy.",
      price: 449,
      applicableEras: "all",
    },
    {
      id: "period-wardrobe",
      name: "Authentic Period Wardrobe",
      description:
        "Hand-crafted clothing accurate to your destination era, fitted by our AI tailoring drones.",
      price: 199,
      applicableEras: "all",
    },
    {
      id: "temporal-photography",
      name: "Temporal Photography Kit",
      description:
        "Disguised camera tech that blends into any era — capture memories without altering the timeline.",
      price: 149,
      applicableEras: "all",
    },
    {
      id: "return-beacon",
      name: "Emergency Return Beacon",
      description:
        "One-press panic button that yanks you back to the present. Peace of mind for first-timers.",
      price: 99,
      applicableEras: "all",
    },
    // --- Era-specific add-ons ---
    {
      id: "gladiator-training",
      name: "Gladiator Training Experience",
      description:
        "Three-day crash course at an authentic ludus — wooden swords only, we promise.",
      price: 599,
      applicableEras: ["ancient-rome"],
    },
    {
      id: "samurai-etiquette",
      name: "Samurai Etiquette Course",
      description:
        "Learn the rituals, bowing protocols, and tea ceremony practices of Edo-period warrior culture.",
      price: 349,
      applicableEras: ["edo-japan"],
    },
    {
      id: "speakeasy-vip",
      name: "Speakeasy VIP Pass",
      description:
        "Guaranteed entry to Harlem's hottest underground jazz clubs — password included.",
      price: 249,
      applicableEras: ["jazz-age-nyc"],
    },
    {
      id: "viking-longship",
      name: "Viking Longship Crew Experience",
      description:
        "Join a real longship crew for a coastal raid — observation only, no pillaging required.",
      price: 799,
      applicableEras: ["viking-scandinavia"],
    },
    {
      id: "cybernetic-tour",
      name: "Cybernetic City Walking Tour",
      description:
        "Guided AR overlay tour of Neo-Tokyo's neon districts with a local android guide.",
      price: 399,
      applicableEras: ["neo-tokyo-2145"],
    },
  ];

  // ==========================================================================
  // PACKAGE TEMPLATES
  // ==========================================================================

  const packageTemplates = [
    {
      id: "budget-hopper",
      name: "Budget Time Hopper",
      baseDuration: 3,
      accommodationTier: "budget",
      includedAddOns: ["return-beacon"],
      basePrice: 1499,
    },
    {
      id: "standard-explorer",
      name: "Standard Temporal Explorer",
      baseDuration: 7,
      accommodationTier: "standard",
      includedAddOns: ["language-implant", "return-beacon"],
      basePrice: 3999,
    },
    {
      id: "premium-voyager",
      name: "Premium ChronoVoyager",
      baseDuration: 14,
      accommodationTier: "premium",
      includedAddOns: [
        "language-implant",
        "period-wardrobe",
        "temporal-photography",
        "return-beacon",
      ],
      basePrice: 8999,
    },
    {
      id: "luxury-resort",
      name: "Luxury Chrono-Resort Experience",
      baseDuration: 14,
      accommodationTier: "luxury",
      includedAddOns: [
        "language-implant",
        "period-wardrobe",
        "temporal-photography",
        "paradox-insurance-addon",
        "return-beacon",
      ],
      basePrice: 14999,
    },
    {
      id: "extended-immersion",
      name: "Extended Immersion Program",
      baseDuration: 30,
      accommodationTier: "standard",
      includedAddOns: [
        "language-implant",
        "period-wardrobe",
        "return-beacon",
      ],
      basePrice: 11999,
    },
  ];

  // ==========================================================================
  // ERAS
  // ==========================================================================

  const eras = [
    // --- From the concept doc sample table ---
    {
      id: "ancient-rome",
      name: "Ancient Rome: Republic Era",
      timePeriod: { startYear: -509, endYear: -27 },
      region: "Europe",
      dangerLevel: 3,
      requiredClearance: 2,
      highlights: [
        "Walk the Roman Forum at the height of its power",
        "Attend a gladiatorial exhibition at a pre-Colosseum arena",
        "Witness a Senate debate (toga required)",
        "Sample authentic Roman street food from Suburra vendors",
      ],
      risks: [
        "Political violence — assassinations are not uncommon",
        "Disease risk from overcrowded urban conditions",
        "Strict social hierarchy — missteps can attract unwanted attention",
      ],
      prerequisites: [
        "temporal-visa-advanced",
        "paradox-insurance-basic",
        "vaccination-historical",
      ],
      availablePackages: [
        "budget-hopper",
        "standard-explorer",
        "premium-voyager",
        "luxury-resort",
      ],
      culturalNotes:
        "Latin is the lingua franca, but Greek is widely spoken among the elite. Togas are formal wear — don't show up in a tunic to the Senate.",
      briefDescription:
        "Experience the grandeur of the Roman Republic — politics, gladiators, and endless marble.",
      priceMultiplier: 1.3,
    },
    {
      id: "edo-japan",
      name: "Edo Period Japan",
      timePeriod: { startYear: 1603, endYear: 1868 },
      region: "Asia",
      dangerLevel: 2,
      requiredClearance: 1,
      highlights: [
        "Stroll through Yoshiwara's lantern-lit entertainment district",
        "Attend a kabuki performance in its golden age",
        "Visit a master swordsmith's workshop",
        "Experience a traditional tea ceremony with a geisha host",
      ],
      risks: [
        "Rigid social caste system — foreigners attract suspicion",
        "Samurai carry live blades and have legal authority to use them",
      ],
      prerequisites: [
        "temporal-visa-standard",
        "paradox-insurance-basic",
      ],
      availablePackages: [
        "budget-hopper",
        "standard-explorer",
        "premium-voyager",
        "luxury-resort",
        "extended-immersion",
      ],
      culturalNotes:
        "Bowing depth matters enormously. Our etiquette briefing is mandatory — one wrong bow and you could insult a daimyō.",
      briefDescription:
        "Peaceful yet rigid — Japan's era of samurai, art, and elaborate social ritual.",
      priceMultiplier: 1.1,
    },
    {
      id: "jazz-age-nyc",
      name: "1920s Jazz Age New York",
      timePeriod: { startYear: 1920, endYear: 1929 },
      region: "Americas",
      dangerLevel: 2,
      requiredClearance: 1,
      highlights: [
        "Dance to live jazz at the Cotton Club in Harlem",
        "Sip bootleg cocktails in a hidden speakeasy",
        "Ride the newly opened subway system",
        "Catch a Broadway show during the Roaring Twenties boom",
      ],
      risks: [
        "Prohibition-era organized crime — stay out of mob territory",
        "Racial segregation is aggressively enforced in many venues",
      ],
      prerequisites: [
        "temporal-visa-standard",
        "paradox-insurance-basic",
      ],
      availablePackages: [
        "budget-hopper",
        "standard-explorer",
        "premium-voyager",
        "luxury-resort",
      ],
      culturalNotes:
        "Prohibition is in full swing — alcohol is illegal but available everywhere if you know the password. Dress sharp or you won't get past the door.",
      briefDescription:
        "Speakeasies, jazz, and the electric energy of Roaring Twenties Manhattan.",
      priceMultiplier: 1.0,
    },
    {
      id: "viking-scandinavia",
      name: "Viking Age Scandinavia",
      timePeriod: { startYear: 793, endYear: 1066 },
      region: "Europe",
      dangerLevel: 4,
      requiredClearance: 3,
      highlights: [
        "Sail aboard a genuine longship along the Norwegian coast",
        "Feast in a mead hall with Norse warriors",
        "Witness the intricate art of Viking runestone carving",
      ],
      risks: [
        "Active raiding culture — violence is a daily reality",
        "Extreme cold and harsh living conditions",
        "No modern medicine — infections can be fatal",
      ],
      prerequisites: [
        "temporal-visa-extreme",
        "paradox-insurance-premium",
        "vaccination-historical",
      ],
      availablePackages: [
        "standard-explorer",
        "premium-voyager",
        "extended-immersion",
      ],
      culturalNotes:
        "Strength and courage are the highest virtues. Showing fear is a social death sentence. Also, the food is mostly salted fish.",
      briefDescription:
        "For the bold — longships, mead halls, and the untamed Norse frontier.",
      priceMultiplier: 1.5,
    },
    {
      id: "neo-tokyo-2145",
      name: "Neo-Tokyo 2145",
      timePeriod: { startYear: 2145, endYear: 2145 },
      region: "Asia",
      dangerLevel: 3,
      requiredClearance: 2,
      highlights: [
        "Explore the neon-drenched Shibuya Megaplex (200 stories tall)",
        "Sample synthetic sushi crafted by robot chefs",
        "Visit the AI Art Museum curated entirely by neural networks",
        "Ride a mag-lev train through the Pacific Undersea Tunnel",
      ],
      risks: [
        "Cybercrime is rampant — guard your neural implant ports",
        "Corporate zones have private security with lethal authorization",
        "Speculative era — timeline accuracy not guaranteed",
      ],
      prerequisites: [
        "temporal-visa-advanced",
        "paradox-insurance-premium",
        "vaccination-future",
      ],
      availablePackages: [
        "budget-hopper",
        "standard-explorer",
        "premium-voyager",
        "luxury-resort",
      ],
      culturalNotes:
        "Cash is extinct — everything runs on biometric crypto. We'll set you up with a temporary identity chip upon arrival.",
      briefDescription:
        "A cyberpunk metropolis of neon, AI, and corporate intrigue — 119 years from now.",
      priceMultiplier: 1.4,
    },
    {
      id: "ancient-egypt",
      name: "Ancient Egypt: New Kingdom",
      timePeriod: { startYear: -1550, endYear: -1070 },
      region: "Africa",
      dangerLevel: 2,
      requiredClearance: 1,
      highlights: [
        "Watch the construction of temples at Karnak",
        "Cruise the Nile on a royal barge",
        "Explore the Valley of the Kings before the tombs were sealed",
        "Attend a festival of Opet in Thebes",
      ],
      risks: [
        "Extreme heat and desert conditions",
        "Theocratic society — blasphemy is punishable by death",
      ],
      prerequisites: [
        "temporal-visa-standard",
        "paradox-insurance-basic",
        "vaccination-historical",
      ],
      availablePackages: [
        "budget-hopper",
        "standard-explorer",
        "premium-voyager",
        "luxury-resort",
        "extended-immersion",
      ],
      culturalNotes:
        "The pharaoh is literally considered a living god. Eye contact with royalty is inadvisable. Linen is the only acceptable fabric.",
      briefDescription:
        "Pyramids, pharaohs, and the Nile — the golden age of Egyptian civilization.",
      priceMultiplier: 1.2,
    },

    // --- Additional eras to reach 14 total ---
    {
      id: "renaissance-florence",
      name: "Renaissance Florence",
      timePeriod: { startYear: 1400, endYear: 1500 },
      region: "Europe",
      dangerLevel: 2,
      requiredClearance: 1,
      highlights: [
        "Watch Botticelli paint in his workshop",
        "Attend a Medici-hosted banquet with live music and philosophy debates",
        "Tour the Duomo while Brunelleschi's dome is still under construction",
      ],
      risks: [
        "Plague outbreaks occur periodically",
        "Political intrigue between rival families can turn violent",
      ],
      prerequisites: [
        "temporal-visa-standard",
        "paradox-insurance-basic",
        "vaccination-historical",
      ],
      availablePackages: [
        "budget-hopper",
        "standard-explorer",
        "premium-voyager",
        "luxury-resort",
      ],
      culturalNotes:
        "Art patronage is the ultimate status symbol. Dropping a casual opinion about perspective painting will make you very popular at dinner parties.",
      briefDescription:
        "Art, science, and Medici intrigue in the birthplace of the Renaissance.",
      priceMultiplier: 1.1,
    },
    {
      id: "silk-road",
      name: "Silk Road: Tang Dynasty Era",
      timePeriod: { startYear: 618, endYear: 907 },
      region: "Asia",
      dangerLevel: 3,
      requiredClearance: 1,
      highlights: [
        "Travel with a merchant caravan from Chang'an to Samarkand",
        "Visit the Mogao Caves while they're still being painted",
        "Sample cuisine from a dozen cultures at a Silk Road caravanserai",
      ],
      risks: [
        "Bandit ambushes along remote stretches of the route",
        "Extreme desert crossings with limited water",
        "Diplomatic tensions between Tang China and neighboring empires",
      ],
      prerequisites: [
        "temporal-visa-standard",
        "paradox-insurance-basic",
        "vaccination-historical",
      ],
      availablePackages: [
        "standard-explorer",
        "premium-voyager",
        "extended-immersion",
      ],
      culturalNotes:
        "The Tang Dynasty is cosmopolitan — foreigners are welcome in Chang'an. Just don't insult the Emperor's poetry. He's sensitive about it.",
      briefDescription:
        "Join a merchant caravan across the world's greatest trade route during China's golden age.",
      priceMultiplier: 1.3,
    },
    {
      id: "belle-epoque-paris",
      name: "Belle Époque Paris",
      timePeriod: { startYear: 1871, endYear: 1914 },
      region: "Europe",
      dangerLevel: 1,
      requiredClearance: 1,
      highlights: [
        "Sip absinthe at a Montmartre café alongside impressionist painters",
        "Attend the grand opening of a World's Fair pavilion",
        "Ride the brand-new Paris Métro on opening day",
        "Watch the Eiffel Tower light up for the first time",
      ],
      risks: [
        "Pickpockets are highly skilled in tourist-heavy areas",
        "Social class distinctions are rigidly enforced",
      ],
      prerequisites: [
        "temporal-visa-standard",
        "paradox-insurance-basic",
      ],
      availablePackages: [
        "budget-hopper",
        "standard-explorer",
        "premium-voyager",
        "luxury-resort",
        "extended-immersion",
      ],
      culturalNotes:
        "Paris is the undisputed center of Western culture right now. Dress impeccably, carry a walking stick, and have opinions about Impressionism.",
      briefDescription:
        "The golden age of Paris — art, fashion, and the birth of modern nightlife.",
      priceMultiplier: 1.0,
    },
    {
      id: "mayan-classic",
      name: "Classic Maya Civilization",
      timePeriod: { startYear: 250, endYear: 900 },
      region: "Americas",
      dangerLevel: 3,
      requiredClearance: 2,
      highlights: [
        "Witness the astronomical precision of Maya calendar ceremonies",
        "Explore the towering pyramids of Tikal in their painted glory",
        "Attend a royal ball game (audience only — participants sometimes don't survive)",
      ],
      risks: [
        "Human sacrifice is a religious practice — stay clear of ceremonies",
        "Dense jungle environment with venomous wildlife",
        "Inter-city warfare between rival Maya kingdoms",
      ],
      prerequisites: [
        "temporal-visa-advanced",
        "paradox-insurance-basic",
        "vaccination-historical",
      ],
      availablePackages: [
        "standard-explorer",
        "premium-voyager",
        "extended-immersion",
      ],
      culturalNotes:
        "The Maya are brilliant mathematicians and astronomers. Show genuine interest in their calendar system and you'll earn deep respect.",
      briefDescription:
        "Towering jungle pyramids, advanced astronomy, and the mysteries of Maya civilization.",
      priceMultiplier: 1.4,
    },
    {
      id: "wild-west",
      name: "American Wild West",
      timePeriod: { startYear: 1865, endYear: 1895 },
      region: "Americas",
      dangerLevel: 3,
      requiredClearance: 2,
      highlights: [
        "Ride a steam locomotive across the freshly completed transcontinental railroad",
        "Visit a frontier boomtown during the gold rush",
        "Attend a cattle drive across the open plains",
      ],
      risks: [
        "Lawlessness — sheriffs are scarce and outlaws are plentiful",
        "Harsh frontier conditions with minimal medical care",
        "Firearms are everywhere and tempers are short",
      ],
      prerequisites: [
        "temporal-visa-advanced",
        "paradox-insurance-basic",
        "vaccination-historical",
      ],
      availablePackages: [
        "budget-hopper",
        "standard-explorer",
        "premium-voyager",
      ],
      culturalNotes:
        "Hospitality is sacred on the frontier — buy someone a drink and you've got a friend for life. Just don't cheat at cards.",
      briefDescription:
        "Cowboys, gold rushes, and lawless frontier towns — the mythic American West.",
      priceMultiplier: 1.1,
    },
    {
      id: "orbital-colonies-2300",
      name: "Orbital Colonies 2300",
      timePeriod: { startYear: 2300, endYear: 2300 },
      region: "Oceania",
      dangerLevel: 4,
      requiredClearance: 3,
      highlights: [
        "Float through a zero-gravity botanical garden in O'Neill Cylinder 7",
        "Dine at a rotating restaurant with a view of Earth's terminator line",
        "Tour the Lunar Embassy and its famous regolith sculpture garden",
      ],
      risks: [
        "Micro-meteor puncture events — rare but catastrophic",
        "Speculative era — timeline accuracy not guaranteed",
        "Political unrest between colony factions and Earth government",
      ],
      prerequisites: [
        "temporal-visa-extreme",
        "paradox-insurance-premium",
        "vaccination-future",
      ],
      availablePackages: [
        "standard-explorer",
        "premium-voyager",
        "luxury-resort",
      ],
      culturalNotes:
        "Personal space is a luxury — literally. Colony-born citizens consider open sky a terrifying concept. Don't mention 'outdoors.'",
      briefDescription:
        "Humanity's future among the stars — orbital habitats, zero-g parks, and lunar vistas.",
      priceMultiplier: 1.8,
    },
    {
      id: "mughal-india",
      name: "Mughal Empire: Shah Jahan Era",
      timePeriod: { startYear: 1628, endYear: 1658 },
      region: "Asia",
      dangerLevel: 2,
      requiredClearance: 1,
      highlights: [
        "Watch the Taj Mahal being built — a construction site like no other",
        "Feast at a Mughal royal banquet with hundreds of dishes",
        "Explore the Red Fort's private apartments and mirrored halls",
      ],
      risks: [
        "Court politics are deadly — succession disputes simmer constantly",
        "Tropical diseases and monsoon flooding",
      ],
      prerequisites: [
        "temporal-visa-standard",
        "paradox-insurance-basic",
        "vaccination-historical",
      ],
      availablePackages: [
        "budget-hopper",
        "standard-explorer",
        "premium-voyager",
        "luxury-resort",
        "extended-immersion",
      ],
      culturalNotes:
        "The Mughal court is a dazzling fusion of Persian, Indian, and Central Asian culture. Bring your appetite — the cuisine is extraordinary.",
      briefDescription:
        "Opulent palaces, the Taj Mahal under construction, and Mughal royal splendor.",
      priceMultiplier: 1.2,
    },
    {
      id: "great-zimbabwe",
      name: "Great Zimbabwe: Kingdom Era",
      timePeriod: { startYear: 1100, endYear: 1450 },
      region: "Africa",
      dangerLevel: 2,
      requiredClearance: 1,
      highlights: [
        "Walk through the Great Enclosure's towering stone walls",
        "Trade gold and ivory at the kingdom's bustling markets",
        "Witness traditional Shona ceremonies and music",
      ],
      risks: [
        "Regional trade disputes can escalate quickly",
        "Wildlife encounters in the surrounding savanna",
      ],
      prerequisites: [
        "temporal-visa-standard",
        "paradox-insurance-basic",
        "vaccination-historical",
      ],
      availablePackages: [
        "budget-hopper",
        "standard-explorer",
        "premium-voyager",
        "extended-immersion",
      ],
      culturalNotes:
        "Great Zimbabwe is a major trading hub — bring something interesting to barter and you'll fit right in. Gold is common here; novelty is the real currency.",
      briefDescription:
        "Africa's medieval marvel — monumental stone architecture and a thriving gold trade network.",
      priceMultiplier: 1.15,
    },
    {
      id: "mongol-empire",
      name: "Mongol Empire: Age of Conquest",
      timePeriod: { startYear: 1206, endYear: 1294 },
      region: "Asia",
      dangerLevel: 5,
      requiredClearance: 3,
      highlights: [
        "Witness the Great Kurultai where Genghis Khan was proclaimed universal ruler",
        "Ride with a Mongol cavalry unit across the vast Central Asian steppe",
        "Visit Karakorum, the empire's legendary capital at the crossroads of the world",
        "Attend a Naadam festival of wrestling, archery, and horse racing",
      ],
      risks: [
        "Active military campaigns — large-scale warfare is constant and indiscriminate",
        "Extreme continental climate with brutal winters and scarce shelter",
        "Foreigners may be mistaken for enemy scouts and executed on sight",
        "Plague and disease spread rapidly along military supply lines",
        "No fixed settlements for long stretches — survival skills are essential",
      ],
      prerequisites: [
        "temporal-visa-extreme",
        "paradox-insurance-premium",
        "vaccination-historical",
      ],
      availablePackages: [
        "standard-explorer",
        "premium-voyager",
      ],
      culturalNotes:
        "Hospitality inside a ger (yurt) is sacred — refuse an offered drink and you've made an enemy. Horsemanship is the measure of a person's worth. Learn to ride before you arrive.",
      briefDescription:
        "The most dangerous era on our roster — continent-spanning conquest, mounted warfare, and the unforgiving steppe.",
      priceMultiplier: 1.9,
    },
  ];

  // ==========================================================================
  // DURATIONS
  // ==========================================================================

  const durations = [3, 7, 14, 30];

  // ==========================================================================
  // PUBLIC API
  // ==========================================================================

  return {
    eras: eras,
    packageTemplates: packageTemplates,
    addOns: addOns,
    prerequisites: prerequisites,
    durations: durations,
  };
})();
