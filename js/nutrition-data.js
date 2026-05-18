var ND = (function () {
  'use strict';

  // ── Daily Targets (Section 1) ────────────────────────────────
  var GOALS = {
    calories: { min: 1800, max: 2000, unit: 'kcal/day' },
    protein:  { min: 95,   max: 110,  unit: 'g/day' },
    carbs:    { min: 220,  max: 260,  unit: 'g/day' },
    fats:     { min: 45,   max: 60,   unit: 'g/day' },
  };

  // ── Quick Reference Card (Section 18) ───────────────────────
  var QUICK_REF = {
    keyNumbers: [
      { label: 'Daily protein',  value: '95–110g',        unit: 'per day' },
      { label: 'Daily calories', value: '1,800–2,000',    unit: 'kcal' },
      { label: 'Whey',           value: '1 scoop',        unit: 'per day max' },
      { label: 'Post-gym milk',  value: '400ml',          unit: 'before shower' },
    ],
    office: [
      { anchor: 'Wake up',                    what: 'Start pohe prep immediately',                        critical: false },
      { anchor: 'Morning',                    what: 'Pohe + 8 soaked almonds + 5 cashews',               critical: false },
      { anchor: 'Leaving',                    what: '1 banana in bag',                                    critical: false },
      { anchor: '10:30am',                    what: 'Banana + 5 cashews together — never banana alone',   critical: false },
      { anchor: 'Lunch',                      what: 'Office lunch rotation (see Lunch page)',             critical: false },
      { anchor: 'Pre-gym Mon/Wed (6pm)',       what: '250ml milk + cashews',                              critical: false },
      { anchor: 'Pre-cardio Tue (5pm)',        what: '250ml milk + 1 scoop whey',                        critical: false },
      { anchor: 'Post-gym Mon/Wed (~8:30pm)', what: '400ml milk + 1 scoop whey — before shower',         critical: true  },
      { anchor: 'Dinner',                     what: 'Dinner rotation (see Dinner page)',                  critical: false },
      { anchor: 'Before bed',                 what: 'Soak 8 almonds for tomorrow',                        critical: false },
    ],
    wfh: [
      { anchor: 'Breakfast',                  what: 'Upma / eggs (Sat+Sun) / cornflakes',                critical: false },
      { anchor: 'Lunch',                      what: 'Previous night\'s dinner reheated',                 critical: false },
      { anchor: 'Evening Thu/Sun (5pm)',       what: '250ml milk + 1 scoop whey + cashews',              critical: false },
      { anchor: 'Pre-gym Fri (5:30pm)',        what: '250ml milk + cashews',                             critical: false },
      { anchor: 'Post-gym Fri (~7:30pm)',      what: '400ml milk + 1 scoop whey',                        critical: true  },
      { anchor: 'Dinner',                     what: 'Dinner rotation — cook double for next day',         critical: false },
      { anchor: 'Before bed',                 what: 'Soak 8 almonds for tomorrow',                        critical: false },
    ],
  };

  // ── Office Lunch Rotation (Section 6) ───────────────────────
  var LUNCH_OPTIONS = [
    {
      name: 'Indian Paneer',
      freq: '1× per week',
      protein: '22–27g',
      order: 'Paneer tikka masala, makhani, or kadai paneer. Order with sabzi + rice only — no roti, no dahi.',
      note: 'Highest protein lunch. Best on gym days.',
      bestDays: 'Monday (Gym)',
      type: 'gym',
    },
    {
      name: 'Indian Non-Paneer',
      freq: '1× per week',
      protein: '18–21g',
      order: 'Chole + rice (~18–20g) OR dal makhani + rice + dahi (~21g).',
      note: 'Dal makhani option is more protein-dense.',
      bestDays: 'Wednesday (Gym)',
      type: 'gym',
    },
    {
      name: 'Cava Bowl',
      freq: '1× per week',
      protein: '~24g',
      order: 'Saffron rice + double falafel + hummus + feta + tomatoes + cucumber + corn + tahini.',
      note: 'No substitutions needed — this order hits 24g.',
      bestDays: 'Tuesday (Cardio)',
      type: 'cardio',
    },
    {
      name: 'Sweetgreen Bowl',
      freq: '1× per week',
      protein: '19–20g',
      order: 'Wild rice + double tofu + hummus + tomatoes + cilantro + cabbage + sauce. Skip crispy rice, breadcrumbs, bread.',
      note: 'Best on non-gym days — lower calorie option.',
      bestDays: 'Thursday (if in office)',
      type: 'rest',
    },
    {
      name: 'Cacio e Pepe / Pasta',
      freq: '1× per week',
      protein: '15–18g',
      order: 'Standard order.',
      note: 'Rest days only. Do NOT order on gym days (Mon, Fri).',
      bestDays: 'Thursday (Rest day only)',
      type: 'rest',
    },
  ];

  var LUNCH_ROTATION = [
    { day: 'Monday',    type: 'Gym',    option: 'Indian paneer' },
    { day: 'Tuesday',   type: 'Cardio', option: 'Cava bowl' },
    { day: 'Wednesday', type: 'Gym',    option: 'Indian chole or dal makhani' },
    { day: 'Thursday',  type: 'Rest',   option: 'Sweetgreen or Cacio e Pepe (if in office)' },
  ];

  // ── 7-Day Dinner Rotation (Sections 7 & 8) ──────────────────
  var DINNER_ROTATION = [
    {
      day: 'Mon', dayFull: 'Monday', type: 'Gym',
      name: 'Dry aloo sabzi + 2 parathas',
      cookTime: '20 min',
      leftover: null,
      protein: '~85g (with whey)',
      notes: 'Quick parallel cooking. No leftover — office Tuesday.',
    },
    {
      day: 'Tue', dayFull: 'Tuesday', type: 'Cardio',
      name: 'Mix veg sabzi + crumbled paneer (100g) + 2 roti',
      cookTime: '25 min',
      leftover: 'Wed lunch',
      protein: '~107g (with whey)',
      notes: 'One dish. Paneer absorbs spices. Cook double.',
    },
    {
      day: 'Wed', dayFull: 'Wednesday', type: 'Gym',
      name: 'Dal tadka + rice',
      cookTime: '20–25 min',
      leftover: 'Thu lunch',
      protein: '~91g (with whey)',
      notes: 'Fast Indian meal. Cook double.',
    },
    {
      day: 'Thu', dayFull: 'Thursday', type: 'Rest',
      name: 'Chole + 2 roti',
      cookTime: '45+ min',
      leftover: 'Fri lunch',
      protein: '~93–97g (with whey)',
      notes: 'Rest day — no rush. Start early. Best for blood sugar.',
    },
    {
      day: 'Fri', dayFull: 'Friday', type: 'Gym',
      name: 'Fun night — pav bhaji, pasta, noodles, or sandwich',
      cookTime: 'Varies',
      leftover: 'Sat lunch',
      protein: '~86–98g',
      notes: 'Post-gym shake moderates blood sugar before dinner arrives.',
    },
    {
      day: 'Sat', dayFull: 'Saturday', type: 'Cardio',
      name: 'Paneer sabzi (tomato gravy) or paneer bhurji + 2 roti',
      cookTime: '25–40 min',
      leftover: 'Sun lunch',
      protein: '~88–100g',
      notes: 'Cook double.',
    },
    {
      day: 'Sun', dayFull: 'Sunday', type: 'Rest',
      name: 'Dalia (clean) OR Maggi + 2 eggs',
      cookTime: '10–15 min',
      leftover: null,
      protein: '~82–90g',
      notes: 'Lowest calorie day. No leftover — Monday is office.',
    },
  ];

  var WFH_REHEATING = [
    { dish: 'Dal tadka',            method: 'Stovetop + splash of water, 3–4 min' },
    { dish: 'Chole',                method: 'Stovetop + splash of water, 5 min (tastes better next day)' },
    { dish: 'Mix veg + paneer',     method: 'Microwave 2 min or stovetop 3 min' },
    { dish: 'Paneer sabzi',         method: 'Stovetop + tiny splash of water, 4–5 min' },
    { dish: 'Fun dinner leftovers', method: 'Microwave 2 min or room temperature' },
  ];

  var WFH_FALLBACKS = [
    { name: 'Paneer bhurji',          time: '15 min', note: 'If paneer stocked' },
    { name: 'Pohe',                   time: 'Same as breakfast', note: '' },
    { name: 'Scrambled eggs on toast', time: '5 min',  note: '' },
  ];

  // ── Paneer Bhurji Recipe (Section 9) ────────────────────────
  var BHURJI_RECIPE = {
    name: 'Paneer Bhurji',
    time: '15 min',
    protein: '22–27g',
    serves: '1',
    alwaysStock: [
      '1 × 200g paneer block (Indian grocery — lasts 5–6 days)',
      '2–3 onions',
      '2–3 tomatoes',
      'Jeera (cumin seeds)',
      'Haldi (turmeric)',
      'Red chilli powder',
      'Salt',
      'Oil or ghee',
      'Roti or bread',
    ],
    steps: [
      'Heat 1 tsp oil on medium.',
      'Add ½ tsp jeera — let splutter 30 secs.',
      'Add 1 chopped onion — cook until translucent (3–4 min).',
      'Add 1 chopped tomato + salt + ¼ tsp haldi + ½ tsp chilli powder.',
      'Cook until tomato softens (~3 min).',
      'Crumble 100–150g paneer directly in.',
      'Mix well, cook 2–3 min.',
      'Serve with 2 rotis or 2 slices bread.',
    ],
  };

  // ── Supplements — Whey Protein (Section 11) ─────────────────
  var SUPPLEMENTS = {
    product: {
      name: 'Optimum Nutrition Gold Standard 100% Whey',
      flavor: 'Double Rich Chocolate',
      size: '2 lb (start here — upgrade to 5 lb after)',
      perServing: '24g protein · 5.5g BCAAs · ~120 kcal',
      certifications: 'Gluten-free · Banned-substance tested',
      cost: '~$1 per serving',
      mixMethod: '1 scoop in cold milk + shaker bottle. No blender needed.',
    },
    whereToBuy: {
      store: 'GNC Newport Centre Mall',
      address: '30-219 Mall Drive West, Jersey City, NJ 07310',
      ask: '"Optimum Nutrition Gold Standard Whey, Double Rich Chocolate, 2 pound"',
    },
    timing: [
      { when: 'Post-gym Mon/Wed/Fri',                    how: '1 scoop in 400ml cold milk', protein: '~37g total' },
      { when: 'Post-cardio Tue OR pre-cardio Tue (5pm)', how: '1 scoop in 250ml milk',     protein: '~32g total' },
      { when: 'Rest days Thu/Sun (5pm)',                  how: '1 scoop in 250ml milk',     protein: '~32g total' },
    ],
    rule: '1 scoop per day. Never 2 scoops to compensate for a missed day.',
    introTimeline: [
      { week: 'Weeks 1–2', action: 'No whey. Establish post-gym milk habit first.' },
      { week: 'Week 3+',   action: 'Add 1 scoop to existing milk drink.' },
    ],
    doNotBuy: [
      { item: 'Pre-workout',  reason: 'Unnecessary stimulant load at this stage' },
      { item: 'BCAAs',        reason: 'Redundant — whey already contains all BCAAs' },
      { item: 'Mass gainers', reason: 'Too many empty calories — causes fat gain, not muscle' },
      { item: 'Fat burners',  reason: 'Counterproductive during a calorie surplus' },
      { item: 'Creatine',     reason: 'Wait 4–6 weeks for diet consistency first' },
    ],
  };

  // ── Breakfast Options (Section 12) ──────────────────────────
  var BREAKFAST_OPTIONS = [
    {
      name: 'Pohe + soaked almonds + cashews',
      type: 'keep',
      when: 'Office days (Mon–Wed)',
      note: 'Add 8 soaked almonds + 5 cashews. Nuts slow glucose absorption. Primary office breakfast.',
    },
    {
      name: 'Upma with peanut chutney',
      type: 'keep',
      when: 'WFH days',
      note: 'Semolina + peanut protein + fat = slow digestion. Best home breakfast.',
    },
    {
      name: 'Scrambled eggs on toast',
      type: 'keep',
      when: 'Sat–Sun (Week 1–2: Saturday only, 2 eggs)',
      note: 'Start with 2 eggs Saturday only. Observe 1–2 hours. If fine: add Sunday in Week 3, move to 3 eggs.',
    },
    {
      name: 'Onion bagel + jalapeño cream cheese',
      type: 'limit',
      when: 'Max 1× per week (office days)',
      note: 'High glycemic, low protein (~8–10g). A1C risk if eaten daily.',
    },
    {
      name: 'Warm milk + cornflakes',
      type: 'limit',
      when: 'Replace with oats in Month 2',
      note: 'Very high glycemic index. Fine short-term; swap to oats when ready.',
    },
  ];

  // ── Fruit Habits (Section 13) ────────────────────────────────
  var FRUIT_HABITS = {
    banana: {
      title: 'The Banana System — Office Days',
      rules: [
        'Every morning: 1 banana goes in the bag. Non-negotiable.',
        'Eat at 10:30am at desk.',
        'Always with 5 cashews — never banana alone (A1C rule).',
        'Setup: bananas in bowl on counter. One goes in bag each night.',
      ],
    },
    grapes: {
      title: 'The Grapes System — Home Days',
      rules: [
        'Saturday post-cardio: wash 100–120g grapes, put in a bowl on the counter.',
        'Sunday: same — grapes or banana, whichever is available.',
        'Eat while doing something else.',
      ],
    },
  };

  // ── Health Panel (Sections 2, 3, 10, 16) ────────────────────
  var HEALTH = {
    a1c: {
      current: '5.6–5.9',
      target: 'Below 5.5',
      status: 'Prediabetes zone',
      rules: [
        {
          title: 'Banana always with cashews — never alone',
          detail: 'Fruit sugar mid-morning causes a blood sugar spike. 5 cashews alongside slows absorption.',
        },
        {
          title: 'Protein shake daily — not just gym days',
          detail: 'On non-gym days the shake happens at the 5pm milk moment. Keeps daily protein consistent and prevents high-carb evenings.',
        },
        {
          title: 'More paneer, fewer rotis on gym nights',
          detail: 'Late gym-night dinner (9–9:30pm): 150g paneer + 1–2 rotis rather than 100g paneer + 3 rotis. Slower overnight glucose curve.',
        },
        {
          title: 'Friday fun dinners are safe on gym nights specifically',
          detail: 'Pav bhaji, pasta, noodles are higher-glycemic. The post-gym protein shake already moderates blood sugar. Do not move these to rest days.',
        },
      ],
      alreadyGood: [
        'Paneer paired with roti — protein slows carb absorption',
        'Milk pre and post gym — protein + natural sugars, not a spike risk',
        'Dal + rice — dal\'s fibre and protein moderates the rice',
        'Nuts alongside breakfast — fat slows pohe absorption',
        'Regular meal timing: 3 meals + structured snacks',
        'Chole in dinner rotation — one of the lowest glycemic foods',
        'Basmati rice — lower glycemic impact than short grain white rice',
      ],
    },

    proteinSources: [
      { food: 'Eggs (1 whole)',          serving: '1 egg',   protein: '6g',     calories: '70',   notes: 'Best complete protein' },
      { food: 'Paneer (moderate)',        serving: '100g',    protein: '18g',    calories: '265',  notes: 'Most calorie-dense' },
      { food: 'Paneer (dinner target)',   serving: '150g',    protein: '27g',    calories: '400',  notes: 'Target dinner portion' },
      { food: 'Whole milk (small)',       serving: '250ml',   protein: '8g',     calories: '150',  notes: 'Pre-gym / rest day' },
      { food: 'Whole milk (post-gym)',    serving: '400ml',   protein: '13g',    calories: '240',  notes: 'Post-gym recovery' },
      { food: 'Dahi / curd',             serving: '150g',    protein: '7g',     calories: '90',   notes: 'Low calorie option' },
      { food: 'Dal (cooked)',             serving: '200g',    protein: '12–14g', calories: '180',  notes: 'Varies by type' },
      { food: 'Whey protein (1 scoop)',   serving: '1 scoop', protein: '24g',    calories: '120',  notes: 'ON Gold Standard' },
      { food: 'Pohe (cooked)',            serving: '1 plate', protein: '4–5g',   calories: '280',  notes: 'Low protein — always pair with nuts' },
      { food: 'Roti (1 medium)',          serving: '1 roti',  protein: '3g',     calories: '80',   notes: 'Carb source' },
      { food: 'Rice (cooked)',            serving: '150g',    protein: '3g',     calories: '195',  notes: 'Carb source' },
    ],

    prePostWorkout: {
      gym: {
        label: 'Gym Days',
        days: 'Mon, Wed, Fri',
        items: [
          { timing: 'Pre-gym (6:00–6:30pm)',  what: '250ml milk + 5–8 cashews',                 critical: false },
          { timing: 'Post-gym (~8:30pm)',      what: '400ml milk + 1 scoop whey (Week 3+)',       critical: true  },
          { timing: 'Dinner (9:00–9:30pm)',    what: 'Carbs replenish glycogen. More paneer, fewer rotis for slower overnight glucose.', critical: false },
        ],
      },
      cardio: {
        label: 'Cardio Days',
        days: 'Tue, Sat',
        items: [
          { timing: 'Tue pre-cardio (5:00–5:30pm)', what: '250ml milk + 1 scoop whey',           critical: false },
          { timing: 'Sat pre-cardio (7:30am)',       what: '250ml milk + 1 banana + 5 cashews',   critical: false },
          { timing: 'Sat post-cardio (~9am)',         what: '2–3 scrambled eggs + toast',          critical: false },
        ],
      },
      rest: {
        label: 'Rest Days',
        days: 'Thu, Sun',
        items: [
          { timing: 'Evening (5:00–5:30pm)', what: '250ml milk + 1 scoop whey + cashews',         critical: false },
          { timing: 'Calories',              what: '~1,700–1,800 kcal (slightly lower is fine)',   critical: false },
        ],
      },
    },

    proteinSnapshot: [
      { day: 'Monday',    type: 'Gym + Office',    dinner: 'Dry aloo + paratha',     noWhey: '~61g',    withWhey: '~85g',    onTarget: false },
      { day: 'Tuesday',   type: 'Cardio + Office', dinner: 'Mix veg + paneer',        noWhey: '~83g',    withWhey: '~107g',   onTarget: true  },
      { day: 'Wednesday', type: 'Gym + Office',    dinner: 'Dal tadka + rice',        noWhey: '~67g',    withWhey: '~91g',    onTarget: false },
      { day: 'Thursday',  type: 'Rest + WFH',      dinner: 'Chole + roti',            noWhey: '~69–73g', withWhey: '~93–97g', onTarget: false },
      { day: 'Friday',    type: 'Gym + WFH',       dinner: 'Fun night',               noWhey: '—',       withWhey: '~86–98g', onTarget: true  },
      { day: 'Saturday',  type: 'Cardio + Home',   dinner: 'Paneer sabzi / bhurji',   noWhey: '—',       withWhey: '~88–100g', onTarget: true },
      { day: 'Sunday',    type: 'Rest + Home',      dinner: 'Dalia',                   noWhey: '—',       withWhey: '~82–90g', onTarget: true  },
    ],
  };

  // ── Fixed Daily Schedules (Section 14) ──────────────────────
  var SCHEDULE = {
    office: [
      { time: '6:30am',       action: 'Start pohe prep — add water, let soak 20 min',              notes: 'Soaks while getting ready',              critical: false },
      { time: '6:30am',       action: 'Soak 8 almonds (if not done the night before)',              notes: '10 seconds',                             critical: false },
      { time: '7:00–7:10am',  action: 'Eat pohe + soaked almonds + 5 cashews',                      notes: 'Breakfast',                              critical: false },
      { time: '7:15am',       action: 'Put 1 banana in bag',                                        notes: 'Non-negotiable',                         critical: false },
      { time: '10:30am',      action: 'Eat banana + 5 cashews at desk',                             notes: 'Never banana alone',                     critical: false },
      { time: '1:00–1:30pm',  action: 'Lunch via meal pass — office rotation',                      notes: 'Main protein meal',                      critical: false },
      { time: '5:00–5:30pm',  action: '250ml milk + 1 scoop whey',                                  notes: 'Tuesday pre-cardio only',                critical: false },
      { time: '6:00–6:30pm',  action: '250ml milk + cashews',                                       notes: 'Mon, Wed pre-gym',                       critical: false },
      { time: '~8:30pm',      action: '400ml milk + 1 scoop whey — on reaching home',               notes: 'Mon, Wed. Before shower. Before sitting.', critical: true },
      { time: '9:00–9:30pm',  action: 'Dinner — rotation',                                          notes: 'Recovery meal',                          critical: false },
      { time: 'Before bed',   action: 'Soak 8 almonds for tomorrow',                                notes: '10 seconds',                             critical: false },
    ],
    wfh: [
      { time: '8:00–8:30am',  action: 'Breakfast — upma / cornflakes / scrambled eggs (Sat+Sun)',   notes: 'No rush',                                critical: false },
      { time: '12:30–1:30pm', action: 'Lunch — previous night\'s dinner reheated',                  notes: 'Add 2 rotis, small bowl rice, or bread',  critical: false },
      { time: '5:00–5:30pm',  action: '250ml milk + 1 scoop whey + cashews',                        notes: 'Thu, Sun (rest days)',                   critical: false },
      { time: '5:30–6:00pm',  action: '250ml milk + cashews pre-gym',                               notes: 'Friday only',                            critical: false },
      { time: '~7:30pm',      action: '400ml milk + 1 scoop whey post-gym',                         notes: 'Friday. Before shower.',                 critical: true  },
      { time: 'Dinner',       action: 'Dinner rotation — cook double for next day\'s lunch',         notes: '',                                       critical: false },
      { time: 'Before bed',   action: 'Soak 8 almonds for tomorrow',                                notes: '10 seconds',                             critical: false },
    ],
  };

  // ── 7-Day Meal Plan (Section 4) ─────────────────────────────
  var MEAL_PLAN = {
    mon: {
      label: 'Mon', fullLabel: 'Monday', type: 'Gym + Office',
      totalProtein: '~85g (with whey)',
      meals: [
        { time: '7:00am',      label: 'Breakfast',   food: 'Pohe + 8 soaked almonds + 5 cashews', protein: '~7g'     },
        { time: '10:30am',     label: 'Mid-morning', food: 'Banana + 5 cashews',                  protein: '~2g'     },
        { time: '1:00–1:30pm', label: 'Lunch',       food: 'Indian paneer (meal pass)',            protein: '~22–27g' },
        { time: '6:00–6:30pm', label: 'Pre-gym',     food: '250ml milk + cashews',                protein: '~8g'     },
        { time: '~8:30pm',     label: 'Post-gym',    food: '400ml milk + 1 scoop whey',           protein: '~37g',   critical: true },
        { time: '9:00–9:30pm', label: 'Dinner',      food: 'Dry aloo sabzi + 2 parathas',         protein: '~8g'     },
      ],
    },
    tue: {
      label: 'Tue', fullLabel: 'Tuesday', type: 'Cardio + Office',
      totalProtein: '~107g (with whey)',
      meals: [
        { time: '7:00am',      label: 'Breakfast',   food: 'Pohe + 8 soaked almonds + 5 cashews', protein: '~7g'  },
        { time: '10:30am',     label: 'Mid-morning', food: 'Banana + 5 cashews',                  protein: '~2g'  },
        { time: '1:00–1:30pm', label: 'Lunch',       food: 'Cava bowl (meal pass)',                protein: '~24g' },
        { time: '5:00–5:30pm', label: 'Pre-cardio',  food: '250ml milk + 1 scoop whey',           protein: '~32g', critical: true },
        { time: '9:00–9:30pm', label: 'Dinner',      food: 'Mix veg sabzi + paneer (100g) + 2 roti', protein: '~27g' },
      ],
    },
    wed: {
      label: 'Wed', fullLabel: 'Wednesday', type: 'Gym + Office',
      totalProtein: '~91g (with whey)',
      meals: [
        { time: '7:00am',      label: 'Breakfast',   food: 'Pohe + 8 soaked almonds + 5 cashews',       protein: '~7g'     },
        { time: '10:30am',     label: 'Mid-morning', food: 'Banana + 5 cashews',                        protein: '~2g'     },
        { time: '1:00–1:30pm', label: 'Lunch',       food: 'Indian non-paneer (chole or dal makhani)',   protein: '~18–21g' },
        { time: '6:00–6:30pm', label: 'Pre-gym',     food: '250ml milk + cashews',                      protein: '~8g'     },
        { time: '~8:30pm',     label: 'Post-gym',    food: '400ml milk + 1 scoop whey',                 protein: '~37g',   critical: true },
        { time: '9:00–9:30pm', label: 'Dinner',      food: 'Dal tadka + rice',                          protein: '~15g'    },
      ],
    },
    thu: {
      label: 'Thu', fullLabel: 'Thursday', type: 'Rest + WFH',
      totalProtein: '~93–97g (with whey)',
      meals: [
        { time: '8:00–8:30am',  label: 'Breakfast', food: 'Upma / cornflakes',                            protein: '~6–8g'  },
        { time: '12:30–1:30pm', label: 'Lunch',     food: 'Wednesday leftovers (dal tadka + rice)',        protein: '~15g'   },
        { time: '5:00–5:30pm',  label: 'Evening',   food: '250ml milk + 1 scoop whey + cashews',          protein: '~32g'   },
        { time: 'Dinner',       label: 'Dinner',    food: 'Chole + 2 roti',                                protein: '~18–20g' },
      ],
    },
    fri: {
      label: 'Fri', fullLabel: 'Friday', type: 'Gym + WFH',
      totalProtein: '~86–98g (with whey)',
      meals: [
        { time: '8:00–8:30am',  label: 'Breakfast', food: 'Upma / cornflakes',                              protein: '~6–8g'  },
        { time: '12:30–1:30pm', label: 'Lunch',     food: 'Thursday leftovers (chole + roti)',               protein: '~18–20g' },
        { time: '5:30–6:00pm',  label: 'Pre-gym',   food: '250ml milk + cashews',                           protein: '~8g'    },
        { time: '~7:30pm',      label: 'Post-gym',  food: '400ml milk + 1 scoop whey',                      protein: '~37g',   critical: true },
        { time: 'Dinner',       label: 'Dinner',    food: 'Fun night — pav bhaji / pasta / noodles / sandwich', protein: 'Varies' },
      ],
    },
    sat: {
      label: 'Sat', fullLabel: 'Saturday', type: 'Cardio + Home',
      totalProtein: '~88–100g (with whey)',
      meals: [
        { time: '7:30am',       label: 'Pre-cardio',  food: '250ml milk + 1 banana + 5 cashews',  protein: '~10g'    },
        { time: '~9:00am',      label: 'Post-cardio', food: '2–3 scrambled eggs + toast',          protein: '~14–18g' },
        { time: '12:30–1:30pm', label: 'Lunch',       food: 'Friday dinner leftovers',             protein: 'Varies'  },
        { time: 'Dinner',       label: 'Dinner',      food: 'Paneer sabzi or paneer bhurji + 2 roti', protein: '~27g' },
      ],
    },
    sun: {
      label: 'Sun', fullLabel: 'Sunday', type: 'Rest + Home',
      totalProtein: '~82–90g (with whey)',
      meals: [
        { time: '8:00–8:30am',  label: 'Breakfast', food: 'Scrambled eggs + toast or upma',                protein: '~12–14g' },
        { time: '12:30–1:30pm', label: 'Lunch',     food: 'Saturday leftovers (paneer)',                    protein: '~27g'    },
        { time: '5:00–5:30pm',  label: 'Evening',   food: '250ml milk + 1 scoop whey + cashews',           protein: '~32g'    },
        { time: 'Dinner',       label: 'Dinner',    food: 'Dalia (clean) or Maggi + 2 eggs',                protein: '~12–18g' },
      ],
    },
  };

  var MILK_SOLUTION = [
    {
      moment: 1, title: 'Pre-Gym / Pre-Cardio',
      timing: 'Mon/Wed/Fri: 6:00–6:30pm · Sat: 7:30am',
      amount: '250ml whole milk',
      purpose: 'Protein + carbs 60–90 min before training.',
      critical: false,
    },
    {
      moment: 2, title: 'Post-Gym / Post-Cardio',
      timing: 'Mon/Wed/Fri: ~8:30pm · Tue: after cardio',
      amount: '400ml (gym days) · 250ml (cardio days)',
      purpose: 'Most critical. On reaching home — before shower, before sitting down. Week 3+: add 1 scoop whey.',
      critical: true,
    },
    {
      moment: 3, title: 'Rest Day Evening',
      timing: 'Thu + Sun: 5:00–5:30pm',
      amount: '250ml whole milk',
      purpose: 'Replaces random snacking. Keeps daily protein consistent.',
      critical: false,
    },
  ];

  // ── Internal page nav links ──────────────────────────────────
  var NAV_LINKS = [
    { href: '/pages/nutrition/schedule.html',    label: 'Daily Schedule',  icon: '🗓️' },
    { href: '/pages/nutrition/meal-plan.html',   label: '7-Day Meal Plan', icon: '🍽️' },
    { href: '/pages/nutrition/lunch.html',       label: 'Office Lunch',    icon: '🥗' },
    { href: '/pages/nutrition/dinner.html',      label: 'Dinner Rotation', icon: '🍲' },
    { href: '/pages/nutrition/supplements.html', label: 'Supplements',     icon: '💪' },
    { href: '/pages/nutrition/health.html',      label: 'Health Tracking', icon: '❤️' },
  ];

  return {
    GOALS,
    QUICK_REF,
    LUNCH_OPTIONS,
    LUNCH_ROTATION,
    DINNER_ROTATION,
    WFH_REHEATING,
    WFH_FALLBACKS,
    BHURJI_RECIPE,
    SUPPLEMENTS,
    BREAKFAST_OPTIONS,
    FRUIT_HABITS,
    HEALTH,
    SCHEDULE,
    MEAL_PLAN,
    MILK_SOLUTION,
    NAV_LINKS,
  };
}());
