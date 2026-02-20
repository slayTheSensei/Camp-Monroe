import { Experience } from '@/types/experience'

export const experiences: Experience[] = [
  {
    slug: 'cambridge-grounds-retreat',
    type: 'Retreat',
    title: 'Cambridge Grounds Retreat',
    subtitle: 'Three days on hallowed ground',
    location: 'West Gardiner, Maine',
    region: 'Western Maine',
    dates: 'September 19–21, 2025',
    duration: '3 Days / 2 Nights',
    groupSize: 12,
    price: 895,
    depositAmount: 269,
    status: 'available',
    tag: 'Flagship',
    tagColor: 'bg-forest text-cream border border-amber',
    difficulty: 'Beginner',
    heroImages: [
      'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=1400&q=85',
      'https://images.unsplash.com/photo-1510672981848-a1c4f1cb5ccf?w=1400&q=85',
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1400&q=85',
      'https://images.unsplash.com/photo-1571863533956-01c88e79957e?w=1400&q=85',
    ],
    shortDescription:
      'Our signature retreat on the historic Cambridge Gun & Rod Club property in West Gardiner, Maine. Wellness, community, and outdoor skill-building on 130-year-old hallowed ground.',
    longDescription:
      "The Cambridge Gun & Rod Club has stood since 1893—founded by Black Bostonians who refused to be excluded from the wild. W.E.B. Du Bois walked these grounds. Now it's your turn. The Cambridge Grounds Retreat is a three-day immersive experience rooted in rest, reconnection, and reclamation. Small group, intentional programming, exceptional food. You just show up.",
    pullQuote:
      'What makes a Camp Monroe experience unforgettable is the connection—with the people, the land, the food, and the energy.',
    pullQuoteImage:
      'https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=1600&q=80',
    itinerary: [
      {
        day: 1,
        title: 'Arrive & Settle In',
        description:
          'Check in, take a breath, and let the woods do their thing. Evening welcome dinner around the fire.',
        image: 'https://images.unsplash.com/photo-1445308394109-4ec2920981b1?w=800&q=80',
        activities: ['Arrival & check-in', 'Property tour', 'Welcome fire & dinner', 'Introductions & intention-setting'],
      },
      {
        day: 2,
        title: 'Into the Wild',
        description:
          'A full day outside. Morning guided hike, afternoon free time on the water, evening storytelling.',
        image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80',
        activities: ['Guided morning hike', 'Fly fishing or paddling session', 'Chef-prepared lunch outdoors', 'Storytelling & fireside gathering'],
      },
      {
        day: 3,
        title: 'Root Down & Depart',
        description:
          'Morning yoga, a final communal breakfast, and send-off with new community and full hearts.',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
        activities: ['Sunrise yoga', 'Journaling & reflection', 'Final communal breakfast', 'Departure by noon'],
      },
    ],
    included: [
      { icon: '🏕️', label: 'Accommodations', description: 'Tent camping or cabin lodging on the Cambridge Gun & Rod Club property' },
      { icon: '🍽️', label: 'All Meals', description: 'Chef-prepared farm-to-table meals and snacks throughout the retreat' },
      { icon: '🥾', label: 'Guided Activities', description: 'Professionally led hike, outdoor skills workshop, and morning yoga' },
      { icon: '🎣', label: 'Equipment', description: 'All outdoor activity equipment provided—no experience necessary' },
      { icon: '🔥', label: 'Evening Programming', description: 'Fireside storytelling, community dinners, and curated evening experiences' },
      { icon: '🚐', label: 'Local Transport', description: 'Shuttle service from a central Maine pickup point' },
    ],
    excluded: [
      'Travel to/from Maine',
      'Personal travel insurance',
      'Alcoholic beverages (BYOB welcome)',
      'Gratuity (optional but appreciated)',
    ],
    details: [
      {
        category: 'Accommodations',
        title: 'Cambridge Gun & Rod Club Grounds',
        description:
          'Sleep on the same land where Black Bostonians gathered for over a century. Options include tent camping and rustic cabin lodging. All linens and sleeping equipment provided.',
        image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&q=80',
      },
      {
        category: 'Guide',
        title: 'Your Camp Monroe Host',
        description:
          'Every retreat is led by an experienced Camp Monroe guide with deep roots in outdoor education, community facilitation, and Maine wilderness. They handle the logistics—you focus on the experience.',
        image: 'https://images.unsplash.com/photo-1516939884455-1445c8652f83?w=800&q=80',
      },
      {
        category: 'Meals',
        title: 'Farm-to-Table, Every Meal',
        description:
          'Our chef sources locally from Maine farms and purveyors. Expect hearty breakfasts, trailside lunches, and fire-cooked dinners. All dietary needs accommodated with advance notice.',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
      },
    ],
    testimonials: [
      {
        quote: "I didn't know I needed this until I was standing in the woods at sunset surrounded by people who looked like me. Camp Monroe gave me that.",
        name: 'Janelle T.',
        location: 'Boston, MA',
      },
      {
        quote: "The food alone was worth it. But the community, the land, the history of where we were standing—that's what I'll carry home.",
        name: 'Marcus D.',
        location: 'New York, NY',
      },
      {
        quote: "I had never been camping. Now I can't stop thinking about going back. Perfect for beginners who want to be outside without the intimidation.",
        name: 'Alicia R.',
        location: 'Philadelphia, PA',
      },
    ],
    faqs: [
      {
        question: 'Who is this retreat for?',
        answer: 'Camp Monroe retreats are designed for Black and brown adults who want to experience the outdoors in a safe, welcoming, and culturally grounded environment. No outdoor experience required—just bring your whole self.',
      },
      {
        question: 'What is the group size?',
        answer: 'We cap every retreat at 12 participants to ensure an intimate, high-quality experience. Once spots are gone, they\'re gone.',
      },
      {
        question: 'What should I bring?',
        answer: 'We\'ll send a full packing list after booking. In general: weather-appropriate clothing, broken-in walking shoes, personal toiletries, any medications, and an open mind. We handle the rest.',
      },
      {
        question: 'Are activities mandatory?',
        answer: 'Never. Every activity on the itinerary is optional. You are welcome to rest, journal, explore on your own, or simply sit by the water. This is your retreat.',
      },
      {
        question: 'What is your cancellation policy?',
        answer: '90+ days before departure: full refund minus a $50 processing fee. 60–89 days: 75% refund. 31–59 days: 50% refund. Within 30 days: no refund, but your spot may be transferred to another person.',
      },
      {
        question: 'Can dietary restrictions be accommodated?',
        answer: 'Yes. We accommodate vegetarian, vegan, gluten-free, and most common allergies. Please note your dietary needs at booking and we\'ll ensure every meal works for you.',
      },
      {
        question: 'Is this physically demanding?',
        answer: 'This retreat is designed for all fitness levels. The guided hike is moderate and can be modified. All other activities are low-intensity. We meet you where you are.',
      },
      {
        question: 'Is there cell service at the property?',
        answer: 'Limited. Western Maine is beautifully remote. Consider this part of the experience. We recommend notifying your contacts before arrival and embracing the disconnect.',
      },
    ],
  },

  {
    slug: 'acadia-base-camp',
    type: 'Weekend Camping',
    title: 'Acadia Base Camp',
    subtitle: 'Maine\'s most iconic park, yours for the weekend',
    location: 'Acadia National Park, ME',
    region: 'Downeast Maine',
    dates: 'August 8–10, 2025',
    duration: '3 Days / 2 Nights',
    groupSize: 12,
    price: 750,
    depositAmount: 225,
    status: 'coming-soon',
    tag: 'Coming 2025',
    tagColor: 'bg-amber text-forest',
    difficulty: 'Intermediate',
    heroImages: [
      'https://images.unsplash.com/photo-1571863533956-01c88e79957e?w=1400&q=85',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=85',
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1400&q=85',
    ],
    shortDescription:
      'Sleep under Maine skies with Acadia as your backyard. Morning hikes, evening fires, and food that hits different in the wild.',
    longDescription:
      "Acadia National Park is one of the most breathtaking places in the northeast—and one of the least diverse. We're changing that. The Acadia Base Camp weekend gets you on the trails, at the summit, and around the fire with a crew that looks like you.",
    pullQuote:
      "Acadia at sunrise, surrounded by your people. That's not a trip. That's a memory.",
    pullQuoteImage:
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1600&q=80',
    itinerary: [
      {
        day: 1,
        title: 'Roll Into Bar Harbor',
        description: 'Arrive, set up camp, take in the ocean air, and kick off the weekend with a seafood welcome dinner.',
        image: 'https://images.unsplash.com/photo-1445308394109-4ec2920981b1?w=800&q=80',
        activities: ['Arrival & camp setup', 'Bar Harbor orientation walk', 'Fresh Maine seafood dinner'],
      },
      {
        day: 2,
        title: 'Summit Day',
        description: 'Cadillac Mountain. All of us. Together. Then the afternoon is yours—carriage roads, tidal pools, or a nap.',
        image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80',
        activities: ['Cadillac Mountain guided hike', 'Summit lunch with a view', 'Free afternoon exploration', 'Campfire storytelling'],
      },
      {
        day: 3,
        title: 'Morning Water, Safe Travels',
        description: 'Sunrise kayak on the lake, final breakfast, and we pack up and head home full.',
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
        activities: ['Sunrise kayak session', 'Final communal breakfast', 'Group debrief & departure'],
      },
    ],
    included: [
      { icon: '⛺', label: 'Camping Gear', description: 'Tents, sleeping bags, and pads provided—just bring yourself' },
      { icon: '🍽️', label: 'All Meals', description: 'Friday dinner through Sunday breakfast, all chef-prepared' },
      { icon: '🥾', label: 'Guided Hike', description: 'Guided Cadillac Mountain summit hike with a certified Maine guide' },
      { icon: '🚣', label: 'Kayaking', description: 'Sunday morning sunrise kayak session, all equipment included' },
      { icon: '🔥', label: 'Campfire Nights', description: 'Fireside programming both evenings' },
    ],
    excluded: [
      'Travel to Bar Harbor, Maine',
      'National Park entrance fee (~$35/vehicle)',
      'Personal travel insurance',
      'Alcoholic beverages',
    ],
    details: [
      {
        category: 'Accommodations',
        title: 'Acadia-Adjacent Campsite',
        description: 'We book a private group campsite near the park entrance, within a short drive of all major Acadia trailheads. Tent equipment provided for all participants.',
        image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&q=80',
      },
      {
        category: 'Guide',
        title: 'Certified Maine Wilderness Guide',
        description: 'Your Camp Monroe host is a Maine-licensed wilderness guide with deep knowledge of Acadia\'s trails, ecology, and history. Safety-first, community-always approach.',
        image: 'https://images.unsplash.com/photo-1516939884455-1445c8652f83?w=800&q=80',
      },
      {
        category: 'Meals',
        title: 'Camp Cooking, Elevated',
        description: 'Expect more than hot dogs. Our camp chef brings farm stand ingredients and serious technique to every fire-cooked meal. Dietary restrictions happily accommodated.',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
      },
    ],
    testimonials: [
      {
        quote: 'I\'ve lived in New England my whole life and never been to Acadia. Camp Monroe got me there and made it feel like home.',
        name: 'Darnell W.',
        location: 'Hartford, CT',
      },
      {
        quote: 'The guides knew the park inside and out. I felt completely safe and completely free at the same time.',
        name: 'Simone A.',
        location: 'Providence, RI',
      },
    ],
    faqs: [
      {
        question: 'How fit do I need to be for Cadillac Mountain?',
        answer: 'The Cadillac South Ridge Trail is moderate—about 3.5 miles round trip with 1,000 ft elevation gain. We hike at a comfortable group pace and no one gets left behind. Alternatives are available if needed.',
      },
      {
        question: 'Do I need camping experience?',
        answer: 'Not at all. We set up camp for you and walk you through everything. First-time campers are welcome and common on this trip.',
      },
      {
        question: 'What is the cancellation policy?',
        answer: '90+ days: full refund minus $50 fee. 60–89 days: 75% refund. 31–59 days: 50% refund. Within 30 days: no refund, but transferable to another guest.',
      },
      {
        question: 'What if the weather is bad?',
        answer: 'Maine weather is variable—we embrace it. We have rain gear and backup plans for all activities. The trip runs rain or shine.',
      },
    ],
  },

  {
    slug: 'baxter-peak-day-hike',
    type: 'Day Trip',
    title: 'Baxter Peak Day Hike',
    subtitle: 'The highest point in Maine, with your people',
    location: 'Baxter State Park, ME',
    region: 'Northern Maine',
    dates: 'October 4, 2025',
    duration: '1 Day',
    groupSize: 10,
    price: 195,
    status: 'coming-soon',
    tag: 'Coming 2025',
    tagColor: 'bg-amber text-forest',
    difficulty: 'Intermediate',
    heroImages: [
      'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1400&q=85',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=85',
    ],
    shortDescription:
      'Guided summit hike of Katahdin with a crew that looks like you. Gear provided. No experience needed. Just show up ready.',
    longDescription:
      "Katahdin is the northern terminus of the Appalachian Trail and the highest peak in Maine at 5,268 feet. It's one of the most rewarding day hikes in the northeast—and one of the least diverse. Camp Monroe is changing that one summit at a time.",
    pullQuote:
      'Standing on top of Katahdin, you understand why people call Maine wild. We go there together.',
    pullQuoteImage:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=80',
    itinerary: [
      {
        day: 1,
        title: 'Summit Day',
        description: 'Early start, trailhead briefing, guided ascent of Katahdin via the Hunt Trail, summit celebration, descent, and group debrief.',
        image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80',
        activities: ['5:30am group meetup at trailhead', 'Guided Hunt Trail ascent (~5 miles)', 'Summit lunch & celebration at Baxter Peak', 'Guided descent', 'Post-hike group debrief & dinner'],
      },
    ],
    included: [
      { icon: '🥾', label: 'Guided Hike', description: 'Expert-led ascent and descent of Katahdin\'s Hunt Trail' },
      { icon: '🎒', label: 'Day Pack & Gear', description: 'Trekking poles, rain shell, and pack provided if needed' },
      { icon: '🥗', label: 'Trail Lunch & Snacks', description: 'Summit lunch and energy snacks throughout the day' },
      { icon: '🚐', label: 'Park Shuttle', description: 'Shuttle from park entrance to trailhead' },
    ],
    excluded: [
      'Travel to Baxter State Park',
      'Park entrance fee (~$15/person)',
      'Hiking boots (must provide your own)',
      'Personal travel insurance',
    ],
    details: [
      {
        category: 'Guide',
        title: 'Maine-Licensed Wilderness Guide',
        description: 'Your Camp Monroe guide is fully licensed by the state of Maine and has led dozens of Katahdin summits. Safety briefing, pacing, and encouragement included.',
        image: 'https://images.unsplash.com/photo-1516939884455-1445c8652f83?w=800&q=80',
      },
      {
        category: 'Meals',
        title: 'Summit Fuel',
        description: 'We pack hearty trail lunches, energy bars, and hydration for the full day. A post-hike group dinner at a local restaurant caps the day.',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
      },
    ],
    testimonials: [
      {
        quote: 'I said I\'d never hike a mountain. I summited Katahdin with Camp Monroe. The guide made everything feel possible.',
        name: 'Tanya M.',
        location: 'Boston, MA',
      },
    ],
    faqs: [
      {
        question: 'How hard is the Katahdin hike?',
        answer: 'The Hunt Trail is strenuous—about 10 miles round trip with 4,000 ft of elevation gain. This is a serious hike. We require participants to be in reasonable physical condition and prepared for a full day of exertion. When in doubt, reach out before booking.',
      },
      {
        question: 'What shoes do I need?',
        answer: 'Sturdy, broken-in hiking boots with ankle support are required. Trail runners are acceptable for experienced hikers. No sneakers or casual footwear.',
      },
      {
        question: 'What if the park is at capacity?',
        answer: 'Baxter State Park uses a reservation system and caps daily hikers. We secure our group permit well in advance. Your spot is guaranteed once you book.',
      },
    ],
  },

  {
    slug: 'tour-du-bois',
    type: 'Bike Ride',
    title: 'Tour Du Bois',
    subtitle: 'Two days. Open roads. Your people at the finish line.',
    location: 'Brunswick → Camp Monroe, West Gardiner ME',
    region: 'Central Maine',
    dates: '2026 — Date TBD',
    duration: '2 Days / 1 Night',
    groupSize: 0,
    price: 0,
    status: 'coming-soon',
    tag: 'Coming 2026',
    tagColor: 'bg-amber text-forest',
    difficulty: 'Intermediate',
    heroImages: [
      'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=1400&q=85',
      'https://images.unsplash.com/photo-1534787238916-9ba6764efd4f?w=1400&q=85',
      'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1400&q=85',
    ],
    shortDescription:
      'Two days of riding, community, and Maine at its best. Tour Du Bois follows the East Coast Greenway from Brunswick to Camp Monroe — a celebration of cycling and culture produced in partnership with the Maine Black Chamber of Commerce and the Black Cycling Coalition.',
    longDescription:
      "This is what Camp Monroe was built for. Tour Du Bois is two days of riding through some of Maine's most beautiful corridors, arriving at a finish line that feels like a homecoming — campfire smoke, great food, live music, and a crew of people who came here for the same reason you did.\n\nThe route follows the East Coast Greenway from Brunswick through the Kennebec River valley to Camp Monroe in West Gardiner. Thirty-five miles of open road, rolling river terrain, and zero pressure. If you want the full experience, start in Portland and ride all 60. Either way, everyone finishes in the same place.\n\nThe land you're riding to has a story. Camp Monroe sits on the grounds of the Cambridge Gun & Rod Club — founded in 1893, and the only property in Maine with a documented connection to W.E.B. Du Bois. The ride is named in his honor, and in honor of Major Taylor — the pioneering Black cyclist who proved what was possible before most of the world was ready to see it. That legacy is the backdrop. The ride, the people, and the joy are the main event.",
    pullQuote:
      'Thirty-five miles of open road. A finish line worth riding for.',
    pullQuoteImage:
      'https://images.unsplash.com/photo-1534787238916-9ba6764efd4f?w=1600&q=80',
    itinerary: [
      {
        day: 1,
        title: 'Arrive — Meet Your Crew',
        description:
          'Get in, get settled, and get into it. Day 1 is about community before the miles. Check in, meet your fellow riders, and spend the evening at a mixer spotlighting Maine\'s minority-owned businesses — real food, real makers, real culture. The ride starts tomorrow. Tonight is all vibe.',
        image: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=800&q=80',
        activities: [
          'Rider registration & gear check',
          'Evening mixer — Maine minority-owned food, makers & culture',
          'Meet your crew',
          'Route briefing & morning send-off plan',
        ],
      },
      {
        day: 2,
        title: 'Ride Day — Roll Into Camp Monroe',
        description:
          'This is it. Rolling start from Brunswick along the East Coast Greenway — 30–35 miles of river corridor, tree canopy, and open road all the way to Camp Monroe. Experienced riders can kick off in Portland for the full 60-mile route. The SAG vehicle has your back the whole way. Cross the finish line, drop your bike, and let the cookout take it from there.',
        image: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=800&q=80',
        activities: [
          'Rolling start from Brunswick (Portland start available — ~60 mi)',
          'East Coast Greenway through the Kennebec River corridor',
          'SAG vehicle support all day',
          'Finish line at Camp Monroe, 98 Farm Cottage Road',
          'Cookout, live music & community gathering',
          'Heritage programming — the story of this land',
        ],
      },
    ],
    included: [
      { icon: '🚴', label: 'Ride Your Route', description: '30–35 miles from Brunswick or the full ~60 from Portland. You pick. Everyone finishes at Camp Monroe.' },
      { icon: '🚐', label: 'SAG All Day', description: 'Support vehicle on the road with you — gear, snacks, mechanical help, and a pickup if you need one. No judgment, ever.' },
      { icon: '🎉', label: 'Night 1 Mixer', description: 'An evening with Maine\'s minority-owned businesses — food, makers, music. The best way to meet your people before the miles.' },
      { icon: '🍖', label: 'Finish Line Cookout', description: 'You earned it. A full cookout at Camp Monroe with local Maine food and vendors who make it worth the ride.' },
      { icon: '🎵', label: 'Live Music', description: 'Good music, good company, historic grounds. That\'s the finish line.' },
      { icon: '📖', label: 'The Story of This Land', description: 'Heritage programming about Camp Monroe, W.E.B. Du Bois, and what it means that you\'re here.' },
    ],
    excluded: [
      'Your own bicycle (reach out and we\'ll connect you with rentals)',
      'Helmet (required — must bring your own)',
      'Travel to Brunswick or overnight accommodations',
      'Personal travel insurance',
    ],
    details: [
      {
        category: 'Transportation',
        title: 'The Route — East Coast Greenway',
        description:
          'Brunswick to Camp Monroe: approximately 30–35 miles along the East Coast Greenway, hugging the Kennebec River through Topsham, Richmond, and Gardiner before arriving in West Gardiner. Rolling terrain with no major climbs — built for recreational and intermediate riders. Want more? The Portland start adds another 25–30 miles for a full ~60-mile day on the Greenway.',
        image: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=800&q=80',
      },
      {
        category: 'Guide',
        title: 'Ride Leaders & Sweep',
        description:
          'Experienced ride leaders run the route from the front. A sweep rider closes it out. The SAG vehicle is always nearby with supplies, mechanical support, and a no-questions-asked ride if you need one. This is not a race. We all get to the finish line.',
        image: 'https://images.unsplash.com/photo-1516939884455-1445c8652f83?w=800&q=80',
      },
      {
        category: 'Meals',
        title: 'The Cookout',
        description:
          'The finish line at Camp Monroe means one thing: a proper cookout. Local Maine ingredients, minority-owned vendors, and food that hits different after a day in the saddle. Come hungry.',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
      },
    ],
    testimonials: [],
    faqs: [
      {
        question: 'Who is this for?',
        answer: 'Anyone who wants to ride, eat well, and be around good people. You don\'t have to be a serious cyclist. You just have to show up. Tour Du Bois is for recreational riders, cultural travelers, and anyone who\'s been curious about what Maine looks like when it\'s made for you.',
      },
      {
        question: 'What are the route options?',
        answer: 'The signature route is Brunswick to Camp Monroe — approximately 30–35 miles along the East Coast Greenway. If you want more, start in Portland and ride the full ~60-mile corridor. Both routes finish at Camp Monroe. The Brunswick start is the accessible entry point — it\'s designed to be doable, not daunting.',
      },
      {
        question: 'What happens on Day 1?',
        answer: 'Arrive, check in, and get into the community. The evening is a mixer with Maine minority-owned food vendors, makers, and local culture — a chance to meet your crew and get a taste of the Maine we\'re building toward before you ride through it.',
      },
      {
        question: 'What\'s the finish line like?',
        answer: 'It\'s the best part. Drop your bike at Camp Monroe, grab a plate, and take it all in — campfire, live music, great food, and a crew of people who just rode the same roads you did. Heritage programming tells the story of the land you\'re standing on. It\'s built to make you want to come back.',
      },
      {
        question: 'Do I need my own bike?',
        answer: 'You\'ll need a road, hybrid, or gravel bike suited for paved mixed surfaces. Don\'t have one? Reach out after you sign up and we\'ll connect you with local rental options.',
      },
      {
        question: 'Is a helmet required?',
        answer: 'Yes. A properly fitted helmet is required for all riders. No exceptions.',
      },
      {
        question: 'Why does this ride exist?',
        answer: 'Because Maine is incredible — and not enough people who look like us have experienced it. Tour Du Bois is about changing that. We believe tourism is a first step to residency, and that bringing people through this landscape, around these fires, and onto this land starts a longer conversation about who gets to call Maine home.',
      },
      {
        question: 'What\'s the story behind the name?',
        answer: 'Tour Du Bois honors two giants. W.E.B. Du Bois — civil rights leader, scholar, co-founder of the NAACP — was a member of the Cambridge Gun & Rod Club, which has stood on this land since 1893. Camp Monroe sits on the same grounds. The ride also honors Major Taylor, the pioneering Black cyclist who dominated professional racing at the turn of the century and proved what was possible long before the world was ready to accept it.',
      },
      {
        question: 'Who are the partners?',
        answer: 'Tour Du Bois is produced by the Cambridge Gun & Rod Club at Camp Monroe, in active partnership with the Maine Black Chamber of Commerce and the Black Cycling Coalition (BCC). We are actively pursuing additional support from Maine tourism organizations to establish this ride as a signature annual event on the Greenway\'s Maine corridor.',
      },
    ],
  },

  {
    slug: 'custom-group-experience',
    type: 'Private / Group',
    title: 'Custom Group Experience',
    subtitle: 'Your group. Your schedule. Maine as the backdrop.',
    location: 'Statewide, Maine',
    region: 'Maine',
    dates: 'By Request',
    duration: 'Your Schedule',
    groupSize: 25,
    price: 0,
    status: 'available',
    tag: 'Inquire',
    tagColor: 'bg-amber text-forest',
    difficulty: 'Beginner',
    heroImages: [
      'https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=1400&q=85',
      'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=1400&q=85',
    ],
    shortDescription:
      'Companies, friend groups, sororities, fraternities—we build tailored outdoor experiences for your people. All skill levels welcome.',
    longDescription:
      'Whether you\'re planning a company retreat, a sorority/fraternity outing, a family reunion, or a milestone celebration—Camp Monroe builds fully custom outdoor experiences for groups of any size. We handle every detail. You show up and enjoy.',
    pullQuote:
      'The best group trip is one where nobody has to plan anything. That\'s exactly what we offer.',
    pullQuoteImage:
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&q=80',
    itinerary: [],
    included: [
      { icon: '🎯', label: 'Custom Itinerary', description: 'Fully bespoke programming built around your group\'s interests and goals' },
      { icon: '🏕️', label: 'Venue & Lodging', description: 'We source and book the right property for your group size and vibe' },
      { icon: '🍽️', label: 'Catering Options', description: 'From casual cookouts to elevated multi-course meals—your call' },
      { icon: '🥾', label: 'Activity Curation', description: 'Hiking, paddling, fishing, yoga, storytelling—we build your menu' },
      { icon: '📋', label: 'Full Logistics', description: 'Transportation, permits, equipment, coordination—all handled' },
    ],
    excluded: [],
    details: [
      {
        category: 'Accommodations',
        title: 'Your Venue, Our Expertise',
        description: 'We work with a network of Maine properties—from rustic wilderness camps to upscale lakeside lodges. We\'ll match the right venue to your group\'s size, budget, and vibe.',
        image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&q=80',
      },
      {
        category: 'Guide',
        title: 'Dedicated Group Host',
        description: 'Every custom experience includes a dedicated Camp Monroe host who manages the experience end-to-end, so group organizers can actually enjoy the trip.',
        image: 'https://images.unsplash.com/photo-1516939884455-1445c8652f83?w=800&q=80',
      },
    ],
    testimonials: [
      {
        quote: 'We brought 20 people from our company and every single person said it was the best offsite they\'d ever been to. Maine is incredible.',
        name: 'Kezia L.',
        location: 'New York, NY',
      },
    ],
    faqs: [
      {
        question: 'What is the minimum group size?',
        answer: 'Custom experiences are available for groups of 8 or more. For smaller groups, check our scheduled public retreats and trips.',
      },
      {
        question: 'How far in advance should I book?',
        answer: 'We recommend reaching out at least 90 days before your desired dates. Peak summer and fall dates fill quickly, especially for larger groups.',
      },
      {
        question: 'How is pricing determined?',
        answer: 'Custom pricing is based on group size, duration, activity selection, accommodation level, and meal plan. We\'ll provide a detailed proposal within 72 hours of your inquiry.',
      },
    ],
  },
]

export function getExperienceBySlug(slug: string): Experience | undefined {
  return experiences.find((e) => e.slug === slug)
}
