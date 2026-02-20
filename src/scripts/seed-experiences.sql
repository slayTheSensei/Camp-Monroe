-- Seed all 6 experiences into the experiences table
-- Generated from src/data/experiences.ts

INSERT INTO experiences (
  slug,
  type,
  title,
  subtitle,
  location,
  region,
  dates,
  duration,
  group_size,
  price,
  deposit_amount,
  status,
  difficulty,
  tag,
  tag_color,
  hero_images,
  pull_quote,
  pull_quote_image,
  short_description,
  long_description,
  itinerary,
  included,
  excluded,
  details,
  testimonials,
  faqs,
  sort_order
) VALUES

-- 1) Cambridge Grounds Retreat
(
  'cambridge-grounds-retreat',
  'Retreat',
  'Cambridge Grounds Retreat',
  'Three days on hallowed ground',
  'West Gardiner, Maine',
  'Western Maine',
  'September 19–21, 2025',
  '3 Days / 2 Nights',
  12,
  895,
  269,
  'available',
  'Beginner',
  'Flagship',
  'bg-forest text-cream border border-amber',
  ARRAY[
    'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=1400&q=85',
    'https://images.unsplash.com/photo-1510672981848-a1c4f1cb5ccf?w=1400&q=85',
    'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1400&q=85',
    'https://images.unsplash.com/photo-1571863533956-01c88e79957e?w=1400&q=85'
  ],
  'What makes a Camp Monroe experience unforgettable is the connection—with the people, the land, the food, and the energy.',
  'https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=1600&q=80',
  'Our signature retreat on the historic Cambridge Gun & Rod Club property in West Gardiner, Maine. Wellness, community, and outdoor skill-building on 130-year-old hallowed ground.',
  $$The Cambridge Gun & Rod Club has stood since 1893—founded by Black Bostonians who refused to be excluded from the wild. W.E.B. Du Bois walked these grounds. Now it's your turn. The Cambridge Grounds Retreat is a three-day immersive experience rooted in rest, reconnection, and reclamation. Small group, intentional programming, exceptional food. You just show up.$$,
  '[
    {
      "day": 1,
      "title": "Arrive & Settle In",
      "description": "Check in, take a breath, and let the woods do their thing. Evening welcome dinner around the fire.",
      "image": "https://images.unsplash.com/photo-1445308394109-4ec2920981b1?w=800&q=80",
      "activities": ["Arrival & check-in", "Property tour", "Welcome fire & dinner", "Introductions & intention-setting"]
    },
    {
      "day": 2,
      "title": "Into the Wild",
      "description": "A full day outside. Morning guided hike, afternoon free time on the water, evening storytelling.",
      "image": "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80",
      "activities": ["Guided morning hike", "Fly fishing or paddling session", "Chef-prepared lunch outdoors", "Storytelling & fireside gathering"]
    },
    {
      "day": 3,
      "title": "Root Down & Depart",
      "description": "Morning yoga, a final communal breakfast, and send-off with new community and full hearts.",
      "image": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      "activities": ["Sunrise yoga", "Journaling & reflection", "Final communal breakfast", "Departure by noon"]
    }
  ]'::jsonb,
  '[
    {"icon": "\ud83c\udfd5\ufe0f", "label": "Accommodations", "description": "Tent camping or cabin lodging on the Cambridge Gun & Rod Club property"},
    {"icon": "\ud83c\udf7d\ufe0f", "label": "All Meals", "description": "Chef-prepared farm-to-table meals and snacks throughout the retreat"},
    {"icon": "\ud83e\udde5", "label": "Guided Activities", "description": "Professionally led hike, outdoor skills workshop, and morning yoga"},
    {"icon": "\ud83c\udfa3", "label": "Equipment", "description": "All outdoor activity equipment provided\u2014no experience necessary"},
    {"icon": "\ud83d\udd25", "label": "Evening Programming", "description": "Fireside storytelling, community dinners, and curated evening experiences"},
    {"icon": "\ud83d\ude90", "label": "Local Transport", "description": "Shuttle service from a central Maine pickup point"}
  ]'::jsonb,
  ARRAY[
    'Travel to/from Maine',
    'Personal travel insurance',
    'Alcoholic beverages (BYOB welcome)',
    'Gratuity (optional but appreciated)'
  ],
  '[
    {
      "category": "Accommodations",
      "title": "Cambridge Gun & Rod Club Grounds",
      "description": "Sleep on the same land where Black Bostonians gathered for over a century. Options include tent camping and rustic cabin lodging. All linens and sleeping equipment provided.",
      "image": "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&q=80"
    },
    {
      "category": "Guide",
      "title": "Your Camp Monroe Host",
      "description": "Every retreat is led by an experienced Camp Monroe guide with deep roots in outdoor education, community facilitation, and Maine wilderness. They handle the logistics\u2014you focus on the experience.",
      "image": "https://images.unsplash.com/photo-1516939884455-1445c8652f83?w=800&q=80"
    },
    {
      "category": "Meals",
      "title": "Farm-to-Table, Every Meal",
      "description": "Our chef sources locally from Maine farms and purveyors. Expect hearty breakfasts, trailside lunches, and fire-cooked dinners. All dietary needs accommodated with advance notice.",
      "image": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80"
    }
  ]'::jsonb,
  $$[
    {
      "quote": "I didn't know I needed this until I was standing in the woods at sunset surrounded by people who looked like me. Camp Monroe gave me that.",
      "name": "Janelle T.",
      "location": "Boston, MA"
    },
    {
      "quote": "The food alone was worth it. But the community, the land, the history of where we were standing\u2014that's what I'll carry home.",
      "name": "Marcus D.",
      "location": "New York, NY"
    },
    {
      "quote": "I had never been camping. Now I can't stop thinking about going back. Perfect for beginners who want to be outside without the intimidation.",
      "name": "Alicia R.",
      "location": "Philadelphia, PA"
    }
  ]$$::jsonb,
  $$[
    {
      "question": "Who is this retreat for?",
      "answer": "Camp Monroe retreats are designed for Black and brown adults who want to experience the outdoors in a safe, welcoming, and culturally grounded environment. No outdoor experience required\u2014just bring your whole self."
    },
    {
      "question": "What is the group size?",
      "answer": "We cap every retreat at 12 participants to ensure an intimate, high-quality experience. Once spots are gone, they're gone."
    },
    {
      "question": "What should I bring?",
      "answer": "We'll send a full packing list after booking. In general: weather-appropriate clothing, broken-in walking shoes, personal toiletries, any medications, and an open mind. We handle the rest."
    },
    {
      "question": "Are activities mandatory?",
      "answer": "Never. Every activity on the itinerary is optional. You are welcome to rest, journal, explore on your own, or simply sit by the water. This is your retreat."
    },
    {
      "question": "What is your cancellation policy?",
      "answer": "90+ days before departure: full refund minus a $50 processing fee. 60\u201389 days: 75% refund. 31\u201359 days: 50% refund. Within 30 days: no refund, but your spot may be transferred to another person."
    },
    {
      "question": "Can dietary restrictions be accommodated?",
      "answer": "Yes. We accommodate vegetarian, vegan, gluten-free, and most common allergies. Please note your dietary needs at booking and we'll ensure every meal works for you."
    },
    {
      "question": "Is this physically demanding?",
      "answer": "This retreat is designed for all fitness levels. The guided hike is moderate and can be modified. All other activities are low-intensity. We meet you where you are."
    },
    {
      "question": "Is there cell service at the property?",
      "answer": "Limited. Western Maine is beautifully remote. Consider this part of the experience. We recommend notifying your contacts before arrival and embracing the disconnect."
    }
  ]$$::jsonb,
  0
),

-- 2) Acadia Base Camp
(
  'acadia-base-camp',
  'Weekend Camping',
  'Acadia Base Camp',
  $$Maine's most iconic park, yours for the weekend$$,
  'Acadia National Park, ME',
  'Downeast Maine',
  'August 8–10, 2025',
  '3 Days / 2 Nights',
  12,
  750,
  225,
  'coming-soon',
  'Intermediate',
  'Coming 2025',
  'bg-amber text-forest',
  ARRAY[
    'https://images.unsplash.com/photo-1571863533956-01c88e79957e?w=1400&q=85',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=85',
    'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1400&q=85'
  ],
  $$Acadia at sunrise, surrounded by your people. That's not a trip. That's a memory.$$,
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1600&q=80',
  'Sleep under Maine skies with Acadia as your backyard. Morning hikes, evening fires, and food that hits different in the wild.',
  $$Acadia National Park is one of the most breathtaking places in the northeast—and one of the least diverse. We're changing that. The Acadia Base Camp weekend gets you on the trails, at the summit, and around the fire with a crew that looks like you.$$,
  '[
    {
      "day": 1,
      "title": "Roll Into Bar Harbor",
      "description": "Arrive, set up camp, take in the ocean air, and kick off the weekend with a seafood welcome dinner.",
      "image": "https://images.unsplash.com/photo-1445308394109-4ec2920981b1?w=800&q=80",
      "activities": ["Arrival & camp setup", "Bar Harbor orientation walk", "Fresh Maine seafood dinner"]
    },
    {
      "day": 2,
      "title": "Summit Day",
      "description": "Cadillac Mountain. All of us. Together. Then the afternoon is yours\u2014carriage roads, tidal pools, or a nap.",
      "image": "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80",
      "activities": ["Cadillac Mountain guided hike", "Summit lunch with a view", "Free afternoon exploration", "Campfire storytelling"]
    },
    {
      "day": 3,
      "title": "Morning Water, Safe Travels",
      "description": "Sunrise kayak on the lake, final breakfast, and we pack up and head home full.",
      "image": "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80",
      "activities": ["Sunrise kayak session", "Final communal breakfast", "Group debrief & departure"]
    }
  ]'::jsonb,
  '[
    {"icon": "\u26fa", "label": "Camping Gear", "description": "Tents, sleeping bags, and pads provided\u2014just bring yourself"},
    {"icon": "\ud83c\udf7d\ufe0f", "label": "All Meals", "description": "Friday dinner through Sunday breakfast, all chef-prepared"},
    {"icon": "\ud83e\udde5", "label": "Guided Hike", "description": "Guided Cadillac Mountain summit hike with a certified Maine guide"},
    {"icon": "\ud83d\udea3", "label": "Kayaking", "description": "Sunday morning sunrise kayak session, all equipment included"},
    {"icon": "\ud83d\udd25", "label": "Campfire Nights", "description": "Fireside programming both evenings"}
  ]'::jsonb,
  ARRAY[
    'Travel to Bar Harbor, Maine',
    'National Park entrance fee (~$35/vehicle)',
    'Personal travel insurance',
    'Alcoholic beverages'
  ],
  $$[
    {
      "category": "Accommodations",
      "title": "Acadia-Adjacent Campsite",
      "description": "We book a private group campsite near the park entrance, within a short drive of all major Acadia trailheads. Tent equipment provided for all participants.",
      "image": "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&q=80"
    },
    {
      "category": "Guide",
      "title": "Certified Maine Wilderness Guide",
      "description": "Your Camp Monroe host is a Maine-licensed wilderness guide with deep knowledge of Acadia's trails, ecology, and history. Safety-first, community-always approach.",
      "image": "https://images.unsplash.com/photo-1516939884455-1445c8652f83?w=800&q=80"
    },
    {
      "category": "Meals",
      "title": "Camp Cooking, Elevated",
      "description": "Expect more than hot dogs. Our camp chef brings farm stand ingredients and serious technique to every fire-cooked meal. Dietary restrictions happily accommodated.",
      "image": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80"
    }
  ]$$::jsonb,
  $$[
    {
      "quote": "I've lived in New England my whole life and never been to Acadia. Camp Monroe got me there and made it feel like home.",
      "name": "Darnell W.",
      "location": "Hartford, CT"
    },
    {
      "quote": "The guides knew the park inside and out. I felt completely safe and completely free at the same time.",
      "name": "Simone A.",
      "location": "Providence, RI"
    }
  ]$$::jsonb,
  $$[
    {
      "question": "How fit do I need to be for Cadillac Mountain?",
      "answer": "The Cadillac South Ridge Trail is moderate\u2014about 3.5 miles round trip with 1,000 ft elevation gain. We hike at a comfortable group pace and no one gets left behind. Alternatives are available if needed."
    },
    {
      "question": "Do I need camping experience?",
      "answer": "Not at all. We set up camp for you and walk you through everything. First-time campers are welcome and common on this trip."
    },
    {
      "question": "What is the cancellation policy?",
      "answer": "90+ days: full refund minus $50 fee. 60\u201389 days: 75% refund. 31\u201359 days: 50% refund. Within 30 days: no refund, but transferable to another guest."
    },
    {
      "question": "What if the weather is bad?",
      "answer": "Maine weather is variable\u2014we embrace it. We have rain gear and backup plans for all activities. The trip runs rain or shine."
    }
  ]$$::jsonb,
  1
),

-- 3) Baxter Peak Day Hike
(
  'baxter-peak-day-hike',
  'Day Trip',
  'Baxter Peak Day Hike',
  'The highest point in Maine, with your people',
  'Baxter State Park, ME',
  'Northern Maine',
  'October 4, 2025',
  '1 Day',
  10,
  195,
  NULL,
  'coming-soon',
  'Intermediate',
  'Coming 2025',
  'bg-amber text-forest',
  ARRAY[
    'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1400&q=85',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=85'
  ],
  'Standing on top of Katahdin, you understand why people call Maine wild. We go there together.',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=80',
  'Guided summit hike of Katahdin with a crew that looks like you. Gear provided. No experience needed. Just show up ready.',
  $$Katahdin is the northern terminus of the Appalachian Trail and the highest peak in Maine at 5,268 feet. It's one of the most rewarding day hikes in the northeast—and one of the least diverse. Camp Monroe is changing that one summit at a time.$$,
  '[
    {
      "day": 1,
      "title": "Summit Day",
      "description": "Early start, trailhead briefing, guided ascent of Katahdin via the Hunt Trail, summit celebration, descent, and group debrief.",
      "image": "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80",
      "activities": ["5:30am group meetup at trailhead", "Guided Hunt Trail ascent (~5 miles)", "Summit lunch & celebration at Baxter Peak", "Guided descent", "Post-hike group debrief & dinner"]
    }
  ]'::jsonb,
  $$[
    {"icon": "\ud83e\udde5", "label": "Guided Hike", "description": "Expert-led ascent and descent of Katahdin's Hunt Trail"},
    {"icon": "\ud83c\udf92", "label": "Day Pack & Gear", "description": "Trekking poles, rain shell, and pack provided if needed"},
    {"icon": "\ud83e\udd57", "label": "Trail Lunch & Snacks", "description": "Summit lunch and energy snacks throughout the day"},
    {"icon": "\ud83d\ude90", "label": "Park Shuttle", "description": "Shuttle from park entrance to trailhead"}
  ]$$::jsonb,
  ARRAY[
    'Travel to Baxter State Park',
    'Park entrance fee (~$15/person)',
    'Hiking boots (must provide your own)',
    'Personal travel insurance'
  ],
  '[
    {
      "category": "Guide",
      "title": "Maine-Licensed Wilderness Guide",
      "description": "Your Camp Monroe guide is fully licensed by the state of Maine and has led dozens of Katahdin summits. Safety briefing, pacing, and encouragement included.",
      "image": "https://images.unsplash.com/photo-1516939884455-1445c8652f83?w=800&q=80"
    },
    {
      "category": "Meals",
      "title": "Summit Fuel",
      "description": "We pack hearty trail lunches, energy bars, and hydration for the full day. A post-hike group dinner at a local restaurant caps the day.",
      "image": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80"
    }
  ]'::jsonb,
  $$[
    {
      "quote": "I said I'd never hike a mountain. I summited Katahdin with Camp Monroe. The guide made everything feel possible.",
      "name": "Tanya M.",
      "location": "Boston, MA"
    }
  ]$$::jsonb,
  $$[
    {
      "question": "How hard is the Katahdin hike?",
      "answer": "The Hunt Trail is strenuous\u2014about 10 miles round trip with 4,000 ft of elevation gain. This is a serious hike. We require participants to be in reasonable physical condition and prepared for a full day of exertion. When in doubt, reach out before booking."
    },
    {
      "question": "What shoes do I need?",
      "answer": "Sturdy, broken-in hiking boots with ankle support are required. Trail runners are acceptable for experienced hikers. No sneakers or casual footwear."
    },
    {
      "question": "What if the park is at capacity?",
      "answer": "Baxter State Park uses a reservation system and caps daily hikers. We secure our group permit well in advance. Your spot is guaranteed once you book."
    }
  ]$$::jsonb,
  2
),

-- 4) Tour Du Bois
(
  'tour-du-bois',
  'Bike Ride',
  'Tour Du Bois',
  'Two days. Open roads. Your people at the finish line.',
  $$Brunswick → Camp Monroe, West Gardiner ME$$,
  'Central Maine',
  '2026 — Date TBD',
  '2 Days / 1 Night',
  0,
  0,
  NULL,
  'coming-soon',
  'Intermediate',
  'Coming 2026',
  'bg-amber text-forest',
  ARRAY[
    'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=1400&q=85',
    'https://images.unsplash.com/photo-1534787238916-9ba6764efd4f?w=1400&q=85',
    'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1400&q=85'
  ],
  'Thirty-five miles of open road. A finish line worth riding for.',
  'https://images.unsplash.com/photo-1534787238916-9ba6764efd4f?w=1600&q=80',
  $$Two days of riding, community, and Maine at its best. Tour Du Bois follows the East Coast Greenway from Brunswick to Camp Monroe — a celebration of cycling and culture produced in partnership with the Maine Black Chamber of Commerce and the Black Cycling Coalition.$$,
  $$This is what Camp Monroe was built for. Tour Du Bois is two days of riding through some of Maine's most beautiful corridors, arriving at a finish line that feels like a homecoming — campfire smoke, great food, live music, and a crew of people who came here for the same reason you did.

The route follows the East Coast Greenway from Brunswick through the Kennebec River valley to Camp Monroe in West Gardiner. Thirty-five miles of open road, rolling river terrain, and zero pressure. If you want the full experience, start in Portland and ride all 60. Either way, everyone finishes in the same place.

The land you're riding to has a story. Camp Monroe sits on the grounds of the Cambridge Gun & Rod Club — founded in 1893, and the only property in Maine with a documented connection to W.E.B. Du Bois. The ride is named in his honor, and in honor of Major Taylor — the pioneering Black cyclist who proved what was possible before most of the world was ready to see it. That legacy is the backdrop. The ride, the people, and the joy are the main event.$$,
  $$[
    {
      "day": 1,
      "title": "Arrive — Meet Your Crew",
      "description": "Get in, get settled, and get into it. Day 1 is about community before the miles. Check in, meet your fellow riders, and spend the evening at a mixer spotlighting Maine's minority-owned businesses — real food, real makers, real culture. The ride starts tomorrow. Tonight is all vibe.",
      "image": "https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=800&q=80",
      "activities": [
        "Rider registration & gear check",
        "Evening mixer — Maine minority-owned food, makers & culture",
        "Meet your crew",
        "Route briefing & morning send-off plan"
      ]
    },
    {
      "day": 2,
      "title": "Ride Day — Roll Into Camp Monroe",
      "description": "This is it. Rolling start from Brunswick along the East Coast Greenway — 30–35 miles of river corridor, tree canopy, and open road all the way to Camp Monroe. Experienced riders can kick off in Portland for the full 60-mile route. The SAG vehicle has your back the whole way. Cross the finish line, drop your bike, and let the cookout take it from there.",
      "image": "https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=800&q=80",
      "activities": [
        "Rolling start from Brunswick (Portland start available — ~60 mi)",
        "East Coast Greenway through the Kennebec River corridor",
        "SAG vehicle support all day",
        "Finish line at Camp Monroe, 98 Farm Cottage Road",
        "Cookout, live music & community gathering",
        "Heritage programming — the story of this land"
      ]
    }
  ]$$::jsonb,
  $$[
    {"icon": "\ud83d\udeb4", "label": "Ride Your Route", "description": "30–35 miles from Brunswick or the full ~60 from Portland. You pick. Everyone finishes at Camp Monroe."},
    {"icon": "\ud83d\ude90", "label": "SAG All Day", "description": "Support vehicle on the road with you — gear, snacks, mechanical help, and a pickup if you need one. No judgment, ever."},
    {"icon": "\ud83c\udf89", "label": "Night 1 Mixer", "description": "An evening with Maine's minority-owned businesses — food, makers, music. The best way to meet your people before the miles."},
    {"icon": "\ud83c\udf56", "label": "Finish Line Cookout", "description": "You earned it. A full cookout at Camp Monroe with local Maine food and vendors who make it worth the ride."},
    {"icon": "\ud83c\udfb5", "label": "Live Music", "description": "Good music, good company, historic grounds. That's the finish line."},
    {"icon": "\ud83d\udcd6", "label": "The Story of This Land", "description": "Heritage programming about Camp Monroe, W.E.B. Du Bois, and what it means that you're here."}
  ]$$::jsonb,
  ARRAY[
    'Your own bicycle (reach out and we''ll connect you with rentals)',
    'Helmet (required — must bring your own)',
    'Travel to Brunswick or overnight accommodations',
    'Personal travel insurance'
  ],
  $$[
    {
      "category": "Transportation",
      "title": "The Route — East Coast Greenway",
      "description": "Brunswick to Camp Monroe: approximately 30–35 miles along the East Coast Greenway, hugging the Kennebec River through Topsham, Richmond, and Gardiner before arriving in West Gardiner. Rolling terrain with no major climbs — built for recreational and intermediate riders. Want more? The Portland start adds another 25–30 miles for a full ~60-mile day on the Greenway.",
      "image": "https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=800&q=80"
    },
    {
      "category": "Guide",
      "title": "Ride Leaders & Sweep",
      "description": "Experienced ride leaders run the route from the front. A sweep rider closes it out. The SAG vehicle is always nearby with supplies, mechanical support, and a no-questions-asked ride if you need one. This is not a race. We all get to the finish line.",
      "image": "https://images.unsplash.com/photo-1516939884455-1445c8652f83?w=800&q=80"
    },
    {
      "category": "Meals",
      "title": "The Cookout",
      "description": "The finish line at Camp Monroe means one thing: a proper cookout. Local Maine ingredients, minority-owned vendors, and food that hits different after a day in the saddle. Come hungry.",
      "image": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80"
    }
  ]$$::jsonb,
  '[]'::jsonb,
  $$[
    {
      "question": "Who is this for?",
      "answer": "Anyone who wants to ride, eat well, and be around good people. You don't have to be a serious cyclist. You just have to show up. Tour Du Bois is for recreational riders, cultural travelers, and anyone who's been curious about what Maine looks like when it's made for you."
    },
    {
      "question": "What are the route options?",
      "answer": "The signature route is Brunswick to Camp Monroe — approximately 30–35 miles along the East Coast Greenway. If you want more, start in Portland and ride the full ~60-mile corridor. Both routes finish at Camp Monroe. The Brunswick start is the accessible entry point — it's designed to be doable, not daunting."
    },
    {
      "question": "What happens on Day 1?",
      "answer": "Arrive, check in, and get into the community. The evening is a mixer with Maine minority-owned food vendors, makers, and local culture — a chance to meet your crew and get a taste of the Maine we're building toward before you ride through it."
    },
    {
      "question": "What's the finish line like?",
      "answer": "It's the best part. Drop your bike at Camp Monroe, grab a plate, and take it all in — campfire, live music, great food, and a crew of people who just rode the same roads you did. Heritage programming tells the story of the land you're standing on. It's built to make you want to come back."
    },
    {
      "question": "Do I need my own bike?",
      "answer": "You'll need a road, hybrid, or gravel bike suited for paved mixed surfaces. Don't have one? Reach out after you sign up and we'll connect you with local rental options."
    },
    {
      "question": "Is a helmet required?",
      "answer": "Yes. A properly fitted helmet is required for all riders. No exceptions."
    },
    {
      "question": "Why does this ride exist?",
      "answer": "Because Maine is incredible — and not enough people who look like us have experienced it. Tour Du Bois is about changing that. We believe tourism is a first step to residency, and that bringing people through this landscape, around these fires, and onto this land starts a longer conversation about who gets to call Maine home."
    },
    {
      "question": "What's the story behind the name?",
      "answer": "Tour Du Bois honors two giants. W.E.B. Du Bois — civil rights leader, scholar, co-founder of the NAACP — was a member of the Cambridge Gun & Rod Club, which has stood on this land since 1893. Camp Monroe sits on the same grounds. The ride also honors Major Taylor, the pioneering Black cyclist who dominated professional racing at the turn of the century and proved what was possible long before the world was ready to accept it."
    },
    {
      "question": "Who are the partners?",
      "answer": "Tour Du Bois is produced by the Cambridge Gun & Rod Club at Camp Monroe, in active partnership with the Maine Black Chamber of Commerce and the Black Cycling Coalition (BCC). We are actively pursuing additional support from Maine tourism organizations to establish this ride as a signature annual event on the Greenway's Maine corridor."
    }
  ]$$::jsonb,
  3
),

-- 5) Partner-Hosted Retreat
(
  'partner-hosted-retreat',
  'Partner-Hosted Retreat',
  'Host Your Retreat at Camp Monroe',
  'The venue is yours. The land is historic. The logistics are on us.',
  'West Gardiner, Maine',
  'Central Maine',
  'By Request',
  'Weekend or Multi-Day',
  40,
  0,
  NULL,
  'available',
  'Beginner',
  'Inquire',
  'bg-amber text-forest',
  ARRAY[
    'https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=1400&q=85',
    'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=1400&q=85',
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1400&q=85'
  ],
  $$You bring the vision. We bring 130 years of hallowed ground and everything you need to make it unforgettable.$$,
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&q=80',
  $$You have a community. We have the land. Camp Monroe is available for partner-hosted retreats — wellness weekends, culinary gatherings, creative residencies, corporate offsites, and more. You bring the vision. We handle everything else.$$,
  $$The land has been doing this for 130 years. Camp Monroe sits on the historic grounds of the Cambridge Gun & Rod Club — founded in 1893 by Black Bostonians who built something better than what was being offered. Now that land is available to you.

Partner-hosted retreats are the heart of what Camp Monroe does. We open the grounds to organizations, collectives, and facilitators who want to bring their community somewhere that actually means something. A flat buyout gets you the whole property for a weekend — 20+ acres, proper lodging, a full kitchen, and outdoor space that earns its keep. You bring your host or facilitator. We handle space, lodging, food, and logistics.

The retreats that thrive here: Rewilding and outdoor skills weekends. Foodways & Fire — culinary and cultural gatherings rooted in diaspora food traditions. Creative in Nature — artist and writer residencies. Corporate offsites built around leadership and real culture. Wellness weekends that actually restore. And Coalition Outdoors — cross-community solidarity retreats for the people doing the work.

Whatever you're building, this land holds it. Let's talk.$$,
  '[]'::jsonb,
  $$[
    {"icon": "\ud83c\udfd5\ufe0f", "label": "Full Venue Buyout", "description": "Exclusive access to Camp Monroe grounds — 20+ acres, indoor + outdoor space, fire pits, waterfront access"},
    {"icon": "\ud83d\udecf\ufe0f", "label": "Lodging for Your Group", "description": "Cabin and tent accommodations for up to 40 guests. Options for every style and budget"},
    {"icon": "\ud83c\udf7d\ufe0f", "label": "Catering & Kitchen Access", "description": "From fire-cooked dinners to elevated multi-course meals. Our kitchen crew works around your program"},
    {"icon": "\ud83d\udccb", "label": "Full Logistics Support", "description": "Transportation, permits, equipment, vendor coordination — handled. You focus on your people"},
    {"icon": "\ud83e\udded", "label": "Dedicated Monroe Host", "description": "One point of contact, on-site the whole time. So your organizers can actually enjoy the retreat"},
    {"icon": "\ud83e\udde5", "label": "Optional Programming", "description": "Add guided hikes, outdoor skills workshops, storytelling sessions, or heritage programming — or bring your own"}
  ]$$::jsonb,
  ARRAY[]::text[],
  $$[
    {
      "category": "Accommodations",
      "title": "Historic Grounds, Full Access",
      "description": "Camp Monroe gives your group exclusive use of the Cambridge Gun & Rod Club property — the same land W.E.B. Du Bois walked. Cabin lodging, tent platforms, fire pits, and waterfront space. Up to 40 guests, all under one buyout.",
      "image": "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&q=80"
    },
    {
      "category": "Guide",
      "title": "Your Dedicated Monroe Host",
      "description": "Every partner retreat includes a dedicated Camp Monroe host who manages the property end-to-end — check-in, catering coordination, activity logistics. Your team leads the programming. We run the operation.",
      "image": "https://images.unsplash.com/photo-1516939884455-1445c8652f83?w=800&q=80"
    },
    {
      "category": "Meals",
      "title": "From Cookouts to Culinary Retreats",
      "description": "Whether you want casual campfire meals or a fully programmed Foodways & Fire culinary weekend, our kitchen crew works around your vision. Local Maine ingredients, diaspora food traditions, and the kind of food that people talk about after.",
      "image": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80"
    }
  ]$$::jsonb,
  $$[
    {
      "quote": "We brought 20 people from our company and every single person said it was the best offsite they'd ever been to. Maine is incredible.",
      "name": "Kezia L.",
      "location": "New York, NY"
    }
  ]$$::jsonb,
  $$[
    {
      "question": "Who is this for?",
      "answer": "Organizations, collectives, facilitators, and companies who want to bring their community somewhere that means something. We've hosted wellness weekends, culinary retreats, creative residencies, corporate leadership offsites, and solidarity retreats. If you're building something real, this land is built for it."
    },
    {
      "question": "What types of retreats work best here?",
      "answer": "Rewilding and outdoor skills weekends. Foodways & Fire culinary gatherings rooted in diaspora food traditions. Creative in Nature residencies for artists and writers. Corporate offsites that go beyond trust falls. Wellness weekends with intention. Coalition Outdoors retreats for cross-community solidarity work. If your retreat has a purpose, it fits here."
    },
    {
      "question": "How does pricing work?",
      "answer": "We offer two models: a flat weekend buyout ($7,000–$12,000 depending on season and group size) or per-person pricing ($150–$300/night). Both include lodging, meals, and full logistics support. We'll send a detailed proposal within 48 hours of your inquiry."
    },
    {
      "question": "What does the buyout include?",
      "answer": "Full exclusive access to Camp Monroe grounds, lodging for your group, all meals, a dedicated Monroe host, kitchen crew, and basic equipment. You bring your host or facilitator and your program. We handle everything else."
    },
    {
      "question": "Can we bring our own facilitator or host?",
      "answer": "Absolutely — that's the model. You lead your programming. We run the property. Your facilitator focuses on your community; our host focuses on the experience running smoothly."
    },
    {
      "question": "How far in advance should I reach out?",
      "answer": "Summer and fall weekends fill fast — 90 days minimum for peak dates. Spring and winter have more flexibility. The sooner you reach out, the more options we have for you."
    },
    {
      "question": "What is the maximum group size?",
      "answer": "We comfortably host up to 40 guests for an overnight retreat. For day events or multi-day programs with off-site lodging, we can accommodate larger groups. Let's talk."
    }
  ]$$::jsonb,
  4
),

-- 6) Dawnland
(
  'dawnland',
  'Weekend Camping',
  'Dawnland',
  'The land has always known how to take care of you.',
  'Katahdin Region, Maine',
  'Northern Maine',
  'Summer 2026 — Interest List Open',
  $$2–3 Days / 2 Nights$$,
  15,
  0,
  NULL,
  'coming-soon',
  'Beginner',
  'Coming 2026',
  'bg-amber text-forest',
  ARRAY[
    'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1400&q=85',
    'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=1400&q=85',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1400&q=85'
  ],
  $$The Wabanaki have been tending this land for thousands of years. We're just here to listen.$$,
  'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1600&q=80',
  'A small-group camping experience on ancestral Wabanaki land near Katahdin, guided by Indigenous educators who have been tending this territory for thousands of years. Coming Summer 2026.',
  $$There is no landscape in the northeast quite like the Katahdin region. Ancient forest. Cold rivers. A sky that opens up in a way you don't expect until you're standing in it. The Wabanaki people have known this for thousands of years — they've been reading this land, tending it, and living in relationship with it longer than anyone.

Dawnland is Camp Monroe's most intentional experience. A small group — never more than 15 — spending two or three days on Penobscot ancestral land near Katahdin, guided by Indigenous educators and storytellers. No rush. No agenda beyond being present. You'll learn how to read the land the way it wants to be read: through traditional ecological knowledge, shared meals, campfire circles, and the kind of quiet that changes you.

This is cultural tourism done right. You leave knowing more than when you arrived — about this place, about its people, and about what it means to be a guest on land that has always belonged to someone else. And if that curiosity leads somewhere deeper, that's the point.

We're building this carefully and in true partnership. Details will open when everything is ready. Get on the interest list now.$$,
  $$[
    {
      "day": 1,
      "title": "Arrive. Settle. Listen.",
      "description": "Arrive at base camp in the Katahdin region and meet your Wabanaki guide. A land orientation walk — learning how to see what's around you before anything else. Evening welcome fire with a collaborative dinner blending Indigenous and diasporic food traditions.",
      "image": "https://images.unsplash.com/photo-1445308394109-4ec2920981b1?w=800&q=80",
      "activities": [
        "Arrival & camp setup",
        "Land orientation with Wabanaki guide",
        "Introduction to Penobscot territory and ecology",
        "Collaborative welcome dinner over the fire",
        "Evening storytelling circle"
      ]
    },
    {
      "day": 2,
      "title": "Into the Land",
      "description": "A full day of guided cultural immersion. Morning ecological walk through the forest — traditional plant knowledge, watershed reading, and the Wabanaki relationship to land and water through the seasons. Afternoon optional service project: native planting, trail clearing, or waterway care. Evening reflection circle.",
      "image": "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80",
      "activities": [
        "Guided ecological walk — traditional ecological knowledge (TEK)",
        "Wabanaki history, ecology, and seasonal relationships",
        "Optional service project: native planting or trail stewardship",
        "Camp Monroe–led campfire reflection circle",
        "Collaborative dinner featuring Indigenous food traditions"
      ]
    },
    {
      "day": 3,
      "title": "Slow Morning. Carry It With You.",
      "description": "A deliberate, unhurried morning. Final breakfast together, a closing conversation about what you're taking home — practically and otherwise. Depart with more than you arrived with.",
      "image": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      "activities": [
        "Sunrise on ancestral land",
        "Final communal breakfast",
        "Closing circle and debrief",
        "Departure"
      ]
    }
  ]$$::jsonb,
  $$[
    {"icon": "\ud83c\udf32", "label": "Guided Cultural Immersion", "description": "Led by Wabanaki educators, storytellers, and guides — not a performance, a relationship"},
    {"icon": "\ud83c\udf7d\ufe0f", "label": "All Meals", "description": "Collaborative dinners blending Indigenous and diasporic food traditions. Real food around a real fire"},
    {"icon": "\u26fa", "label": "Camping Gear", "description": "Tents, sleeping bags, pads — all provided. Low-impact camping designed to leave the land better than we found it"},
    {"icon": "\ud83d\udd25", "label": "Campfire Circles", "description": "Every evening ends around the fire with reflection, storytelling, and community"},
    {"icon": "\ud83c\udf3f", "label": "Ecological Learning", "description": "Traditional ecological knowledge, plant medicine, watershed reading — how to see land the way it wants to be seen"}
  ]$$::jsonb,
  ARRAY[
    'Travel to the Katahdin region',
    'Personal travel insurance',
    'Hiking boots (required — must provide your own)'
  ],
  $$[
    {
      "category": "Guide",
      "title": "Wabanaki Educators & Storytellers",
      "description": "Dawnland is guided by Indigenous educators from the Penobscot Nation — people who have a living relationship with this land and its knowledge systems. This is not interpretation. It's direct transmission from people who belong to this place.",
      "image": "https://images.unsplash.com/photo-1516939884455-1445c8652f83?w=800&q=80"
    },
    {
      "category": "Accommodations",
      "title": "Low-Impact Camping on Ancestral Land",
      "description": "Small group camping on Penobscot Nation–associated land in the Katahdin region. Campsites are designed to minimize footprint and model regenerative practice. All gear provided. The wilderness is the accommodation.",
      "image": "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&q=80"
    },
    {
      "category": "Meals",
      "title": "Indigenous & Diasporic Food Traditions",
      "description": "Every meal is a collaboration — Wabanaki food traditions alongside diaspora cooking from Camp Monroe's kitchen. Think wild-harvested ingredients, fire-cooked proteins, and recipes that connect you to place and people at the same time.",
      "image": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80"
    }
  ]$$::jsonb,
  '[]'::jsonb,
  $$[
    {
      "question": "What is Dawnland?",
      "answer": "Dawnland is a small-group camping experience on Wabanaki ancestral land near Katahdin, guided by Indigenous educators from the Penobscot Nation. It's built around traditional ecological knowledge, cultural storytelling, shared meals, and low-impact land stewardship. It's the most intentional thing we offer."
    },
    {
      "question": "Is there an official partnership with the Penobscot Nation?",
      "answer": "We are actively building this program in alignment with Wabanaki cultural tourism priorities for 2026. We will open registration only when the partnership is formalized and the program is ready to deliver with integrity. The vision is shared; the details are being built with care. Get on the interest list and we'll keep you informed."
    },
    {
      "question": "How is this different from regular camping?",
      "answer": "You're not just sleeping outside. You're on land that has been tended by the same people for thousands of years, guided by educators who have a living relationship with that land and its knowledge systems. Every element — the walks, the meals, the circles — is designed to teach you something real about place, ecology, and belonging."
    },
    {
      "question": "Who is this experience for?",
      "answer": "Anyone who wants to go deeper than the average outdoor trip. You don't need camping experience or outdoor expertise. You need curiosity, openness, and a willingness to listen. This is for identity-centered travelers, cultural learners, and people who believe tourism can be something more than consumption."
    },
    {
      "question": "What does \"land stewardship\" mean in practice?",
      "answer": "It means showing up to the land as a guest who wants to leave it better. On Day 2, there's an optional service project — native plant restoration, trail clearing, or waterway care — guided by Wabanaki educators. Low-impact camping practices are built into every part of the program. You learn by doing."
    },
    {
      "question": "How do I get notified when registration opens?",
      "answer": "Join the interest list here. You'll be the first to know when dates are confirmed, and the first to access registration when it opens. No commitment required."
    }
  ]$$::jsonb,
  5
);
