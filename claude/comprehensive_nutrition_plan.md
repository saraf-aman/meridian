# Complete Nutrition Plan — Section 3
### Personal Nutrition Guide | 28M | 50–53kg | 5'6" | Vegetarian (Eggetarian) | Jersey City, NJ

> **How to use this file:** This is the master nutrition reference and planning document. It serves two purposes: (1) personal health planning reference with full context, rationale, and future planning guidance, and (2) source material for the Meridian website. Claude Code should read the WEBSITE IMPLEMENTATION NOTES section first before building anything.

---

## TABLE OF CONTENTS

> Sections marked 🔒 belong behind Google auth on the Meridian website. Sections marked 📋 are internal planning only — never on the website.

**Website Implementation**
- [Website Implementation Notes](#website-implementation-notes) — Claude Code reads this first

**Nutrition Plan**
1. [Your Daily Targets](#1-your-daily-targets) 🔒
2. [A1C & Blood Sugar Management](#2-a1c--blood-sugar-management) 🔒
3. [Your Protein Sources — What They Actually Deliver](#3-your-protein-sources--what-they-actually-deliver) 🔒
4. [The Full 7-Day Meal Plan](#4-the-full-7-day-meal-plan) 🔒
5. [The Milk Solution](#5-the-milk-solution) 🔒
6. [Office Lunch Rotation](#6-office-lunch-rotation) 🔒
7. [The 7-Day Dinner Rotation](#7-the-7-day-dinner-rotation) 🔒
8. [WFH Lunch — The Leftover System](#8-wfh-lunch--the-leftover-system) 🔒
9. [The Fallback Dinner — Paneer Bhurji Recipe](#9-the-fallback-dinner--paneer-bhurji-recipe) 🔒
10. [Pre and Post Workout Nutrition](#10-pre-and-post-workout-nutrition) 🔒
11. [Whey Protein — Exactly What to Buy and How](#11-whey-protein--exactly-what-to-buy-and-how) 🔒
12. [The Breakfast Reinstatement Plan](#12-the-breakfast-reinstatement-plan) 🔒
13. [The Fruit Habit System](#13-the-fruit-habit-system) 🔒
14. [Fixed Daily Schedule](#14-fixed-daily-schedule) 🔒
15. [Missed Meal Recovery Protocol](#15-missed-meal-recovery-protocol) 🔒
16. [Weekly Protein Snapshot](#16-weekly-protein-snapshot) 🔒
17. [What Not to Stress About Yet](#17-what-not-to-stress-about-yet) 📋
18. [Quick Reference Card](#18-quick-reference-card) 🔒

**Future Planning — Internal Only**
19. [4-Week Check-In Checklist](#19-4-week-check-in-checklist) 📋
20. [12-Week Reassessment Framework](#20-12-week-reassessment-framework) 📋
21. [Next Chat Handoff](#21-next-chat-handoff) 📋

---

## WEBSITE IMPLEMENTATION NOTES
### For Claude Code — Read This Before Building Anything

---

### Authentication Architecture

The **entire nutrition section sits behind Google OAuth**, restricted to a single authorised account. This is a private personal health dashboard, not a public page.

**Public (no login required):**
The nutrition module card on the homepage only — section name, one-line description ("Personalised nutrition plan — meals, timing, and protein targets"), lock icon, and a "Sign in to view" prompt. Nothing else is visible without login. Style this card the same as other module cards but with a lock indicator to make the gate feel intentional rather than incomplete.

**Behind Google auth (everything else):**
All nutrition content including the A1C health panel. Once signed in, the user sees a full-featured private nutrition dashboard.

---

### What Goes on the Website (Behind Auth)

Strip all first-person planning language ("you said", "as we discussed", "based on your history") from every section before rendering. Rewrite as clean instructional copy.

| Section | Website Element | Notes |
|---|---|---|
| Section 1 — Daily Targets | 4 stat cards at top of nutrition landing | Calories, protein, carbs, fats — numbers only, no explanatory paragraphs |
| Section 2 — A1C & Blood Sugar | Personal health panel, clearly labelled private | Show: current baseline (5.6–5.9), target (<5.5), the 3 dietary rules, "Next blood test due" editable field. Strip family history — show actionable rules only |
| Section 3 — Protein Sources table | Expandable reference table or accordion | Full table — useful daily lookup |
| Section 4 — 7-Day Meal Plan | Day-tab layout matching workout phase pages | One tab per day. Meals as cards: time, food, protein, calories |
| Section 5 — Milk Solution (rules only) | Callout panel | The 3 milk moments as a simple rule list. Strip "why this works" rationale |
| Section 6 — Office Lunch Rotation | 5 option cards + weekly rotation table | Each card: name, specific order, protein, key notes |
| Section 7 — Dinner Rotation | 7 day cards with badges | Each: dinner name, cooking time badge, leftover coverage tag, protein |
| Section 8 — WFH Lunch System | Inline with dinner or separate panel | Reheating table + no-leftover fallback options |
| Section 9 — Paneer Bhurji Recipe | Recipe card | Ingredients table + numbered steps |
| Section 10 — Pre/Post Workout Nutrition | 3-column timing table | Gym days / Cardio days / Rest days |
| Section 11 — Whey Protein | Product callout card | Name, GNC Newport Centre address, size (2lb), dose (1 scoop), timing. Strip isolate vs concentrate discussion |
| Section 12 — Breakfast Options | 4 option cards with assessment badges | ✅ Keep / ⚠️ Limit badges. No personal history text |
| Section 13 — Fruit Habit | Simple rules panel | Banana system and grapes system as two short rule blocks |
| Section 14 — Fixed Daily Schedule | Two schedule tables (office + WFH) | Most important page — consider making it the default landing after login |
| Section 15 — Missed Meal Recovery | Recovery table | Clean table format |
| Section 16 — Weekly Protein Snapshot | Colour-coded table or bar chart | Green = on target, amber = lower day |
| Section 18 — Quick Reference Card | Prominent sticky widget | Split into Office Days and WFH Days panels. First thing visible after login. |

**Do NOT put on website even behind auth:**
- Section 17 (What Not to Stress About Yet) — planning meta, not a reference tool
- Sections 19–21 (Reassessment, Handoff) — for Claude, not for the website
- "Realistic Daily Protein Without Whey" table in Section 3 — planning math only
- "Why a Calorie Surplus" and "Why Protein Is Non-Negotiable" paragraphs in Section 1

---

### Suggested File Architecture

```
pages/nutrition/
├── index.html          # Landing after login — quick reference + daily targets
├── schedule.html       # Fixed daily schedule (office + WFH) — most-used page
├── meal-plan.html      # 7-day meal plan with day tabs
├── lunch.html          # Office lunch rotation
├── dinner.html         # 7-day dinner rotation + WFH leftover system + bhurji recipe
├── supplements.html    # Whey protein card + what not to buy
└── health.html         # A1C panel + protein snapshot + pre/post workout nutrition
```

---

### Design Notes

- Match the workout section visual language throughout — same dark premium aesthetic, cards, tabs, accordions
- Day tabs on meal-plan.html: same component as workout phase day tabs
- Cooking time on dinner cards: badge/chip styled same as sets/reps chips on exercise cards
- Leftover coverage on dinner cards: small green tag "→ covers [day] lunch"
- Quick Reference Card: two collapsible panels — consider auto-expanding the correct one based on day of week
- Protein numbers: colour-coded — green when on target, amber on lower days
- A1C panel: subtle red-dim background to distinguish as health data. Include "Last tested:" editable date field.
- Whey product card: name, store, size, dose, timing in a clean list
- Auth wall: nutrition homepage card shows lock icon + "Sign in to view" — same card style as other modules, visually distinguished

---

## 1. YOUR DAILY TARGETS

### The Numbers

| Metric | Target | Why |
|---|---|---|
| Calories | 1,800–2,000 kcal/day | Slight surplus to support muscle gain at current weight |
| Protein | 95–110g/day | ~1.8–2g per kg of body weight — minimum for muscle growth |
| Carbohydrates | 220–260g/day | Primary energy source, especially around workouts |
| Fats | 45–60g/day | Hormones, joint health, fat-soluble vitamin absorption |

### Why a Calorie Surplus at Your Weight

At 50–53kg starting a structured strength program, the body needs slightly more fuel than it burns at rest. A surplus of roughly 200–300 kcal above maintenance (approximately 1,600–1,700 kcal for these stats and current activity level) gives muscles the raw material to grow.

This is NOT a bulk — 1,800–2,000 kcal is a modest, controlled surplus. Without it, training hard but recovering slowly, feeling low on energy, and seeing minimal strength gains is the result.

### Why Protein Is Non-Negotiable

Protein is the only macronutrient that directly builds and repairs muscle tissue. Carbs and fats fuel the work. Protein does the actual construction. At the start of this plan, protein intake was likely 40–55g on an average day — roughly half of what is needed. Every week of training without adequate protein means doing the work and leaving the results on the table.

The entire plan is designed to hit 95–110g every single day — even on bad days, even when the kitchen is empty.

---

## 2. A1C & BLOOD SUGAR MANAGEMENT

> 📋 **Note:** This section contains personal medical data. It is included on the website behind Google auth only. The website display should show actionable rules — strip family history details from the rendered page.

### What Your Numbers Mean

HbA1c has been consistently in the 5.6–5.9 range for 2+ years. The clinical prediabetes threshold is 5.7, which means sitting firmly in the prediabetes zone. Combined with family history of prediabetes, this is a real risk factor that needs active management through diet and exercise.

Starting at age 28 with a structured workout program and a proper nutrition system, lifestyle intervention at this stage is the most powerful tool available — more effective than medication. Consistent exercise, better diet, and modest weight gain as muscle can bring A1C back into the normal range and prevent progression entirely.

### What Prediabetes Actually Requires From Your Diet

The core issue is blood sugar spikes. The body is slightly less efficient at processing glucose, so meals that dump large amounts of fast-digesting carbs into the system at once cause bigger, longer spikes. Repeated spikes over time drive progression toward Type 2 diabetes.

The fix is **not** eliminating carbs. It is three things:

1. **Always pair carbs with protein, fat, or fibre** — slows how fast glucose hits the bloodstream
2. **Avoid large carb-only meals** — plain rice with nothing else is the problem, not rice itself
3. **Eat at regular intervals** — skipping meals then eating a large carb-heavy meal causes bigger spikes than eating the same food spread across structured meals

### How This Plan Is Already Good for Your A1C

- Paneer at lunch paired with roti — protein slows carb absorption ✅
- Milk pre and post gym — protein + natural sugars, not a spike risk ✅
- Dal + rice — dal's fibre and protein moderates the rice ✅
- Nuts alongside breakfast — fat slows pohe absorption ✅
- Regular meal timing with 3 meals + snacks ✅
- Chole in the dinner rotation — chickpeas have one of the lowest glycemic indexes of any food ✅
- Long grain basmati rice — lower glycemic impact than short grain white rice ✅

### The Four Specific A1C Adjustments in This Plan

**1. Banana always eaten with cashews — never alone**
Fruit sugar on an empty mid-morning stomach causes a moderate blood sugar spike. 5 cashews alongside the banana adds fat that slows absorption.

**2. Protein shake is daily, not just gym days**
On non-gym days the shake happens at the evening milk moment (5–5:30pm). Keeps daily protein consistent and prevents lower-protein days from becoming high-carb days.

**3. Dinner balance on gym nights**
On gym nights with a late dinner (9–9:30pm), lean toward more paneer and fewer rotis — 150g paneer with 1–2 rotis rather than 100g paneer with 3 rotis. Slower overnight glucose curve.

**4. Friday fun dinners are safe on gym nights specifically**
Pav bhaji, pasta, and noodles are higher glycemic dinners. Designated for Friday because the post-gym protein shake already moderates the blood sugar curve before dinner arrives. Do not move these to rest days.

### What to Watch For

A blood test in 3–6 months showing A1C dropped to 5.5 or below is a direct result of the exercise program and dietary changes in this plan. That is the goal.

---

## 3. YOUR PROTEIN SOURCES — WHAT THEY ACTUALLY DELIVER

This table is the permanent reference for where protein comes from.

| Food | Serving | Protein | Calories | Notes |
|---|---|---|---|---|
| Eggs (whole) | 1 egg | 6g | 70 kcal | Best complete protein in the toolkit |
| Paneer | 100g | 18g | 265 kcal | Most calorie-dense protein source |
| Paneer | 150g | 27g | 400 kcal | Target dinner portion |
| Whole milk | 250ml (1 glass) | 8g | 150 kcal | Easy protein + calories in one drink |
| Whole milk | 400ml (large post-gym glass) | 13g | 240 kcal | Post-workout recovery drink |
| Dahi (curd) | 150g (1 small bowl) | 7g | 90 kcal | Good protein, low calorie |
| Dal (cooked) | 1 medium bowl (~200g) | 12–14g | 180 kcal | Varies slightly by type, all roughly similar |
| Soaked almonds | 8–10 almonds | 3g | 70 kcal | Small contribution — mainly healthy fats |
| Cashews | 8–10 cashews | 3g | 90 kcal | Same — fats more than protein |
| Whey protein (ON Gold Standard) | 1 scoop (30g) | 24g | 120 kcal | The gap-closer — see Section 11 |
| Pohe (plain, cooked) | 1 plate (~80g dry) | 4–5g | 280 kcal | Low protein, mainly carbs — must be paired |
| Roti (wheat) | 1 medium roti | 3g | 80 kcal | Carb source primarily |
| Rice (cooked) | 1 medium bowl (~150g) | 3g | 195 kcal | Carb source primarily |

> 📋 **Planning note — do not display on website:** Without whey, a well-structured day delivers ~67–86g protein. The gap to 95–110g is 15–40g depending on the day. Whey closes it. With 1 scoop daily, the weekly average hits 93–102g consistently.

---

## 4. THE FULL 7-DAY MEAL PLAN

### How the Week Is Structured

**Office Days (Mon, Tue, Wed):**
- Breakfast: 10-minute window — zero cooking, pre-prepped
- Lunch: $25 meal pass, delivery — see Section 6 for the full rotation
- Mon and Wed: gym nights — home by ~8pm, shake first, dinner at 9–9:30pm
- Tue: cardio night — home by ~8pm, shake at 5–5:30pm before cardio

**WFH / Home Days (Thu, Fri, Sat, Sun):**
- Thu and Fri: WFH — lunch is previous night's dinner leftovers
- Sat: cardio morning, home by 7pm, scrambled eggs post-cardio
- Sun: full rest day, highest flexibility

**Weekly Gym Schedule:**

| Day | Activity | Notes |
|---|---|---|
| Monday | Gym | Office day — home by 8pm |
| Tuesday | Cardio | Office day — home by 8pm |
| Wednesday | Gym | Office day — home by 8pm |
| Thursday | Rest | WFH |
| Friday | Gym | WFH — done by 7pm |
| Saturday | Cardio | Home — done by 7pm |
| Sunday | Rest | Home |

---

### DAY 1 — MONDAY (Gym Day, Office Day)

| Meal | Time | What | Protein | Calories |
|---|---|---|---|---|
| Breakfast | 7:00–7:10am | Pohe (1 plate, 80g dry) + 8 soaked almonds + 5 cashews | 7g | 360 kcal |
| Mid-morning | 10:30am | 1 banana + 5 cashews | 2g | 180 kcal |
| Lunch | 1:00–1:30pm | Section 6 — Office Lunch Rotation | ~20–27g | ~580–620 kcal |
| Pre-gym | 6:00–6:30pm | 250ml whole milk + 5 cashews | 11g | 240 kcal |
| **Post-gym** | **~8:30pm** | **400ml whole milk + 1 scoop whey (from Week 3)** | **13g (37g with whey)** | **240 kcal** |
| Dinner | 9:00–9:30pm | Dry aloo sabzi + 2 parathas | ~8g | 480 kcal |
| **Daily Total** | | | **~61g (85g with whey)** | **~2,080 kcal** |

**Notes:** Pohe prep starts at wake-up. Post-gym milk is poured before shower, before sitting — the moment you walk in. Monday dinner is light on protein by design: post-gym shake already delivered 37g, making total evening protein ~45g.

---

### DAY 2 — TUESDAY (Cardio Day, Office Day)

| Meal | Time | What | Protein | Calories |
|---|---|---|---|---|
| Breakfast | 7:00–7:10am | Pohe + 8 soaked almonds + 5 cashews | 7g | 360 kcal |
| Mid-morning | 10:30am | 1 banana + 5 cashews | 2g | 180 kcal |
| Lunch | 1:00–1:30pm | Section 6 — Office Lunch Rotation | ~20–27g | ~580–620 kcal |
| Pre-cardio | 5:00–5:30pm | 250ml whole milk + 1 scoop whey | 32g | 270 kcal |
| Dinner | 9:00–9:30pm | Mix veg sabzi + crumbled paneer (100g) + 2 roti | ~22g | 520 kcal |
| **Daily Total** | | | **~83g** | **~1,930 kcal** |

**Notes:** Whey shake is pre-cardio on Tuesday (5pm), not post. Mix veg with crumbled paneer is one dish — not two. Make double portion: covers Wednesday WFH lunch.

---

### DAY 3 — WEDNESDAY (Gym Day, Office Day)

| Meal | Time | What | Protein | Calories |
|---|---|---|---|---|
| Breakfast | 7:00–7:10am | Pohe + 8 soaked almonds + 5 cashews | 7g | 360 kcal |
| Mid-morning | 10:30am | 1 banana + 5 cashews | 2g | 180 kcal |
| Lunch | 1:00–1:30pm | Section 6 — Office Lunch Rotation | ~20–27g | ~580–620 kcal |
| Pre-gym | 6:00–6:30pm | 250ml whole milk + 5 cashews | 11g | 240 kcal |
| **Post-gym** | **~8:30pm** | **400ml whole milk + 1 scoop whey** | **37g** | **240 kcal** |
| Dinner | 9:00–9:30pm | Dal tadka + rice | ~14g | 375 kcal |
| **Daily Total** | | | **~91g** | **~1,975 kcal** |

**Notes:** Dal tadka is quick (20–25 mins) — right for a long office + gym day. Make double: covers Thursday WFH lunch.

---

### DAY 4 — THURSDAY (Rest Day, WFH)

| Meal | Time | What | Protein | Calories |
|---|---|---|---|---|
| Breakfast | 8:00–8:30am | Warm milk + cornflakes OR upma with peanut chutney | 8–12g | 320–380 kcal |
| Lunch | 12:30–1:30pm | Wednesday's leftover dal tadka + rice (reheated) | ~14g | 375 kcal |
| Evening | 5:00–5:30pm | 250ml whole milk + 1 scoop whey + cashews | 27g | 330 kcal |
| Dinner | 7:30–8:00pm | Chole + 2 roti | ~20g | 520 kcal |
| **Daily Total** | | | **~69–73g** | **~1,545–1,605 kcal** |

**Notes:** Rest day — lower calories appropriate. No time pressure on breakfast. Start chole early — make a big batch, covers Friday WFH lunch. Chole is the best dinner in the rotation for blood sugar: chickpeas have one of the lowest glycemic indexes of any food.

---

### DAY 5 — FRIDAY (Gym Day, WFH)

| Meal | Time | What | Protein | Calories |
|---|---|---|---|---|
| Breakfast | 8:00–8:30am | Warm milk + cornflakes OR upma with peanut chutney | 8–12g | 320–380 kcal |
| Lunch | 12:30–1:30pm | Thursday's leftover chole + roti (reheated) | ~20g | 480 kcal |
| Pre-gym | 5:30–6:00pm | 250ml whole milk + 5 cashews | 11g | 240 kcal |
| **Post-gym** | **~7:30pm** | **400ml whole milk + 1 scoop whey** | **37g** | **240 kcal** |
| Dinner | 8:30–9:00pm | Fun Night — Pav Bhaji / Sandwich / Pasta / Noodles | ~10–18g | 450–600 kcal |
| **Daily Total** | | | **~86–98g** | **~1,730–1,940 kcal** |

**Notes:** WFH + gym done by 7pm = best schedule of the week. Friday is fun dinner night — pick one on the day. Pav Bhaji: use whole wheat pav, not regular maida pav. Fun dinners are safe on Friday specifically because the post-gym shake has already moderated the blood sugar curve. Make extra: covers Saturday post-cardio lunch.

---

### DAY 6 — SATURDAY (Cardio Day, Home Day)

| Meal | Time | What | Protein | Calories |
|---|---|---|---|---|
| Pre-cardio | 7:30–7:45am | 250ml whole milk + 1 banana + 5 cashews | 10g | 330 kcal |
| Post-cardio breakfast | 9:00–9:30am | 2–3 scrambled eggs + 2 toast or roti | 16–18g | 380 kcal |
| Lunch | 12:30–1:00pm | Friday's leftover fun dinner (reheated) | ~10–18g | 400–500 kcal |
| Evening | 5:00pm | 250ml whole milk + 1 scoop whey + cashews | 27g | 330 kcal |
| Dinner | 7:30–8:00pm | Paneer sabzi (tomato gravy) or paneer bhurji + 2 roti | ~25–27g | 560 kcal |
| **Daily Total** | | | **~88–100g** | **~2,000–2,100 kcal** |

**Notes:** Saturday is the egg testing and practice day. Banana always with cashews. Proper paneer sabzi belongs here — most time available of the week. Make double: covers Sunday lunch.

---

### DAY 7 — SUNDAY (Full Rest, Home Day)

| Meal | Time | What | Protein | Calories |
|---|---|---|---|---|
| Breakfast | 8:30–9:00am | 2–3 scrambled eggs + 2 toast + 250ml milk | 22–24g | 530 kcal |
| Lunch | 1:00–1:30pm | Saturday's leftover paneer (reheated) | ~25–27g | 520 kcal |
| Evening | 5:00pm | 250ml whole milk + 1 scoop whey + cashews + soaked almonds | 27g | 330 kcal |
| Dinner | 7:30–8:00pm | Dalia (plain) OR Maggi | ~8–12g | 300 kcal |
| **Daily Total** | | | **~82–90g** | **~1,680–1,700 kcal** |

**Notes:** Full rest — lowest calorie needs of the week. Sunday is the second egg day. Dalia is the clean default; Maggi is the designated comfort option. If Maggi: crack 2 eggs in while cooking (protein goes ~7g → ~19g). Sunday needs no leftover — Monday is office with meal pass.

---

## 5. THE MILK SOLUTION

Milk was being consumed once a week despite being enjoyed — because there was no trigger. These three moments fix that by tying milk to exercise, which is already a fixed daily anchor.

### The Three Milk Moments

**Moment 1 — Pre-gym / Pre-cardio**
- Gym days (Mon, Wed, Fri): 250ml at 6:00–6:30pm before leaving
- Saturday cardio: 250ml at 7:30am before heading out
- Workout fuel — protein + carbs 60–90 minutes before training

**Moment 2 — Post-gym / Post-cardio (most important)**
- Gym days: 400ml the moment you walk through the door at ~8:30pm
- Before shower. Before sitting. Pour it first.
- Tuesday post-cardio: 250ml (same trigger, smaller volume)
- The most important nutritional moment of the day on training days

**Moment 3 — Rest day evenings**
- Thursday and Sunday: 250ml at 5:00–5:30pm
- Late afternoon anchor — replaces random snacking

### Milk + Whey (Week 3 Onwards)

Post-gym 400ml milk + 1 scoop whey = **37g protein in one drink.** This is the single highest-impact nutritional upgrade in the plan.

---

## 6. OFFICE LUNCH ROTATION

Office days: Monday, Tuesday, Wednesday (occasionally Thursday). Lunch ordered via $25 meal pass — delivery to office. Goal: variety, minimum ~20–27g protein per meal.

### The 5 Options

**Option 1 — Indian Paneer (1x per week)**
Paneer tikka masala / makhani / kadai paneer. Highest protein lunch at ~22–27g. Order comes with sabzi + rice only — no roti, no dahi. If paneer portion looks small, compensate with a larger evening snack.

**Option 2 — Indian Non-Paneer (1x per week)**
- Chole + rice — ~18–20g protein
- Dal makhani + rice — ~14–16g protein, add dahi side if available to push to ~21g

**Option 3 — Cava Bowl (1x per week)**
Build: saffron basmati rice + double falafel + hummus + Crazy Feta + tomatoes + cucumber + fire-roasted corn + lemon herb tahini. ~24g protein.

**Option 4 — Sweetgreen Bowl (1x per week)**
Build: wild rice + double roasted tofu + hummus + tomatoes + cilantro + shredded cabbage + Sweetgreen hot sauce. Skip: crispy rice, garlic breadcrumbs, bread, hot honey mustard sauce. ~19–20g protein. Best on non-gym days.

**Option 5 — Cacio e Pepe or Pasta (1x per week, rest days only)**
~15–18g protein. Do not order on gym days (Mon, Fri).

### Suggested Weekly Rotation

| Day | Lunch |
|---|---|
| Monday (Gym) | Indian — paneer dish |
| Tuesday (Cardio) | Cava bowl |
| Wednesday (Gym) | Indian — chole or dal makhani |
| Thursday (if in office — rare) | Sweetgreen or Cacio e Pepe |

---

## 7. THE 7-DAY DINNER ROTATION

Dinners feed tonight and automatically provide tomorrow's WFH lunch. The rotation accounts for cooking time constraints each day.

### Cooking Constraints by Day

| Day | Situation | Budget |
|---|---|---|
| Monday | Office + gym, home by 8pm, shake first | 30 mins max |
| Tuesday | Office + cardio, home by 8pm | 30 mins |
| Wednesday | Office + gym, home by 8pm, shake first | 30 mins max |
| Thursday | WFH, rest day | All the time needed |
| Friday | WFH, gym done by 7pm | Good cook night |
| Saturday | Home, cardio done by 7pm | Good cook night |
| Sunday | Home, full rest | Most flexible |

---

### MONDAY — Dry Aloo Sabzi + 2 Parathas
**Cooking time:** 20 mins | **Leftover:** Not needed (Tue = office)

Dry aloo (boiled potato, oil, spices) while Haldiram's parathas cook alongside. Parallel cooking keeps it under 20 minutes. Protein is low (~8g) but post-gym shake delivered 37g — total evening protein ~45g.

---

### TUESDAY — Mix Veg Sabzi + Crumbled Paneer + 2 Roti
**Cooking time:** 25 mins | **Leftover:** Yes → Wednesday WFH lunch ✅

Dry mix veg (carrots, capsicum, beans, onion, tomato). Crumble 100g paneer in the last 3 minutes. One dish — paneer absorbs the spices and blends in. Bumps protein from ~10g to ~28g. Make double.

---

### WEDNESDAY — Dal Tadka + Rice
**Cooking time:** 20–25 mins | **Leftover:** Yes → Thursday WFH lunch ✅

One of the fastest Indian meals. If roommates made dal already — zero-effort night. Make enough for two servings.

---

### THURSDAY — Chole + 2 Roti
**Cooking time:** 45+ mins | **Leftover:** Yes → Friday WFH lunch ✅

Rest day — no time pressure. Start early. Make a big batch: chole improves overnight and reheats beautifully. Best dinner in the rotation for blood sugar — chickpeas have one of the lowest glycemic indexes of any food.

---

### FRIDAY — Fun Night
**Cooking time:** Varies | **Leftover:** Yes → Saturday post-cardio lunch ✅

Pick one on the day. Make extra.

| Option | Notes |
|---|---|
| Pav Bhaji | Use whole wheat pav — not regular maida pav |
| Grilled sandwich | Cheese + veg on whole wheat bread. Paneer tikka style for more protein. |
| Pasta | Cacio e Pepe or white sauce |
| Noodles | Hakka style or similar |

Fun dinners are safe on Friday — post-gym shake has already moderated the blood sugar curve before dinner.

---

### SATURDAY — Paneer Sabzi or Paneer Bhurji + 2 Roti
**Cooking time:** 25–40 mins | **Leftover:** Yes → Sunday lunch ✅

Best cook night for paneer. If energy: proper tomato gravy sabzi. If tired: paneer bhurji in 15 minutes. Make enough for Sunday.

---

### SUNDAY — Dalia OR Maggi
**Cooking time:** 10–15 mins | **Leftover:** Not needed (Mon = office, meal pass)

Dalia is the clean default. Maggi is the designated comfort option — one night a week. If Maggi: crack 2 eggs in while cooking (protein: ~7g → ~19g).

---

### Leftover Coverage Map

| Dinner | Covers |
|---|---|
| Tuesday mix veg + paneer (double) | Wednesday WFH lunch ✅ |
| Wednesday dal tadka (double) | Thursday WFH lunch ✅ |
| Thursday chole (double) | Friday WFH lunch ✅ |
| Friday fun dinner (double) | Saturday post-cardio lunch ✅ |
| Saturday paneer (double) | Sunday lunch ✅ |

---

## 8. WFH LUNCH — THE LEFTOVER SYSTEM

On WFH days (Thu, Fri, Sat, Sun), lunch is always the previous night's dinner reheated. Zero cooking, zero decisions.

### How to Reheat

| Dish | Method |
|---|---|
| Dal tadka | Stovetop + splash of water, 3–4 mins |
| Chole | Stovetop + splash of water, 5 mins — tastes better the next day |
| Mix veg + paneer | Microwave 2 mins or stovetop 3 mins |
| Paneer sabzi | Stovetop + tiny splash of water, 4–5 mins |
| Fun dinner leftovers | Microwave 2 mins or room temperature |

### What to Eat Alongside

- 2 rotis, OR
- Small bowl of rice if it pairs better (dal, chole), OR
- Bread as a backup

### When There Are No Leftovers

- Paneer bhurji — 15 minutes if paneer is stocked
- Pohe — same prep as breakfast, works fine for lunch
- Scrambled eggs on toast — 5 minutes

---

## 9. THE FALLBACK DINNER — PANEER BHURJI RECIPE

When nobody has cooked, when exhausted, when there are no leftovers. 15 minutes, zero decisions.

### Always Keep These Stocked

| Item | Quantity | Where |
|---|---|---|
| Paneer | 1 x 200g block minimum | Indian grocery store |
| Onions | 2–3 | Any grocery store |
| Tomatoes | 2–3 | Any grocery store |
| Jeera (cumin seeds) | Small packet | Indian grocery store |
| Haldi (turmeric) | Small packet | Indian grocery store |
| Red chilli powder | Small packet | Indian grocery store |
| Salt | Always | Any store |
| Oil or ghee | Small bottle | Indian grocery store or Whole Foods |
| Roti or bread | Always | Any store |

Paneer lasts 5–6 days refrigerated. Restock every week — running out is the only thing that breaks this system.

### Method (15 minutes)

1. Heat 1 tsp oil or ghee on medium heat
2. Add ½ tsp jeera — let it splutter 30 seconds
3. Add 1 finely chopped onion — cook until translucent, 3–4 minutes
4. Add 1 chopped tomato + pinch of salt + ¼ tsp haldi + ½ tsp red chilli powder
5. Cook until tomato softens, ~3 minutes
6. Crumble 100–150g paneer directly into the pan with your hands
7. Mix well, cook 2–3 minutes
8. Eat with 2 rotis or 2 slices of bread

**Protein: ~22–27g | Time: 15 minutes**

---

## 10. PRE AND POST WORKOUT NUTRITION

### Gym Days (Mon, Wed, Fri)

| Timing | What | Why |
|---|---|---|
| 6:00–6:30pm | 250ml milk + 5–8 cashews | Sustained energy — protein + carbs + small fat buffer |
| ~8:30pm (immediately home) | 400ml milk + 1 scoop whey | Recovery window — do not skip or delay |
| 9:00–9:30pm | Dinner from rotation | Carbs replenish glycogen. Paneer provides overnight protein. |

### Cardio Days (Tue, Sat)

| Day | Timing | What |
|---|---|---|
| Tuesday | 5:00–5:30pm | 250ml milk + 1 scoop whey (pre-cardio) |
| Saturday | 7:30am | 250ml milk + 1 banana + 5 cashews (pre-cardio) |
| Saturday | ~9am | Scrambled eggs + toast (post-cardio) |

### Rest Days (Thu, Sun)

No special pre/post requirements. Slightly lower calories (~1,700–1,800 kcal) is appropriate.

---

## 11. WHEY PROTEIN — EXACTLY WHAT TO BUY AND HOW

### What to Buy

**Optimum Nutrition Gold Standard 100% Whey — Double Rich Chocolate, 2 lb tub**

- 24g protein per serving, 5.5g BCAAs
- Whey isolate as primary source — fast-digesting, high quality
- Mixes smoothly in cold milk with a shaker bottle — no blender needed
- Gluten-free, banned-substance tested
- Mixed into cold whole milk it tastes like a chocolate milkshake — the habit sticks when the drink is enjoyable
- ~$1 per serving

**Buy the 2 lb tub first.** Confirm taste and stomach comfort before committing to the 5 lb. Switch to 5 lb on the second purchase for better value.

### Where to Buy

**GNC — Newport Centre Mall, 30-219 Mall Drive West, Jersey City, NJ 07310**

Ask for: *"Optimum Nutrition Gold Standard Whey, Double Rich Chocolate, 2 pound."*

Or order directly from **optimumnutrition.com**.

### How to Take It

| When | How | Protein |
|---|---|---|
| Post-gym Mon/Wed/Fri | 1 scoop in 400ml cold whole milk, shaken in shaker bottle | ~37g |
| Post-cardio Tue or pre-cardio Tue (5pm) | 1 scoop in 250ml cold whole milk | ~32g |
| Rest days Thu/Sun evening | 1 scoop in 250ml milk at 5pm | ~32g |

**1 scoop per day. Never 2 scoops to compensate for a missed day.**

### When to Introduce

- **Weeks 1–2:** No whey. Establish the post-gym milk habit first.
- **Week 3:** Add 1 scoop to the milk drink that already exists. The habit is the foundation — whey rides on top.

### What NOT to Buy (for now)

| Supplement | Why to avoid |
|---|---|
| Pre-workout | Unnecessary stimulant load at this stage |
| BCAAs | Already in whey and whole foods — redundant |
| Mass gainers | Will cause fat gain, not muscle gain |
| Fat burners | Counterproductive when a calorie surplus is needed |
| Creatine | Beneficial — but only after 4–6 weeks of consistent diet and training |

---

## 12. THE BREAKFAST REINSTATEMENT PLAN

### Breakfast Rotation and Assessment

| Breakfast | Assessment | Action |
|---|---|---|
| Pohe + soaked almonds + cashews | Good. Consistent, nuts slow absorption. | ✅ Primary office breakfast |
| Onion bagel + jalapeño cream cheese | High glycemic, low protein (~8–10g). A1C risk if daily. | ⚠️ Max once a week |
| Warm milk + cornflakes | Cornflakes = very high glycemic index. | ⚠️ Swap to oats in Month 2 |
| Upma with peanut chutney | Best home breakfast — semolina + peanut protein + fat = slow digestion. | ✅ Lean on this more on home days |

**Cornflakes → oats swap:** Same effort — pour hot milk over oats. Taste is not the issue. Just buy oats on the next grocery order. Target: Month 2, once core habits are solid.

### Office Day Breakfast — The Pohe Upgrade

Pohe prep stays exactly the same. Two additions only:
- 8 soaked almonds alongside (soaked the night before — 10 seconds)
- 5 cashews alongside (no prep)

### The Almond Soaking Micro-Habit

Every night before sleep: put 8 almonds in a small cup of water. 10 seconds. Same as brushing teeth — every night without thinking.

### Home Day Breakfast — Scrambled Eggs (Sat + Sun)

**Week 1–2 (Saturday only): Start with 2 eggs**

1. Crack 2 eggs into a bowl, whisk with a fork, add a pinch of salt
2. Heat 1 tsp butter in a non-stick pan on **low heat**
3. Pour in eggs. Wait 10 seconds before stirring.
4. Gently push eggs from edges to centre with a spatula
5. Take off heat when 80% done — residual heat finishes them
6. Eat with 2 slices of toast or 2 rotis

Observe for 1–2 hours: any digestive discomfort?

**If fine:** Add Sunday in Week 3. Move from 2 eggs to 3.

**If discomfort:** Shift eggs to lunch or dinner. Replace Saturday breakfast with milk + nuts + banana.

---

## 13. THE FRUIT HABIT SYSTEM

Previous attempts failed because fruit was never attached to anything. These systems fix that by anchoring fruit to existing daily triggers.

### The Banana System (Office Days)

- Every morning before leaving: 1 banana goes in the bag. Every morning, not when you feel like it.
- Eat it at 10:30am at the desk — not because hungry, because it's 10:30 and the banana is there.
- **Always eat with 5 cashews** — A1C rule, never banana alone.
- Bananas in a bowl on the counter. One goes in the bag each night. That is the entire system.

### The Grapes System (Home Days)

- Saturday post-cardio: wash 100–120g grapes, put in a bowl on the counter. Eat while doing something else.
- Sunday: same — grapes or banana, whichever is available.

### What Success Looks Like

| Week | Target |
|---|---|
| Week 1 | Banana in bag 3–4 out of 5 office days |
| Week 2 | 4–5 days |
| Week 4 | Just something the bag always has |

### Recovery When the Habit Slips

Forget for 3 days in a row. Do not compensate. Put one banana in the bag the next morning. The streak does not matter. The pattern does.

---

## 14. FIXED DAILY SCHEDULE

### Office Day Schedule (Mon, Tue, Wed)

| Time | Action | Notes |
|---|---|---|
| 6:30am | Wake up. Start pohe prep immediately (add water, let sit 20 mins). | Soaks while getting ready |
| 6:30am | Soak 8 almonds if not done last night | 10 seconds |
| 7:00–7:10am | Eat pohe + soaked almonds + 5 cashews | Breakfast |
| 7:15am | Put 1 banana in bag | Non-negotiable |
| 10:30am | Eat banana + 5 cashews at desk | Never banana alone |
| 1:00–1:30pm | Lunch via meal pass — Section 6 rotation | Main protein meal |
| 5:00–5:30pm | 250ml milk + 1 scoop whey (Tuesday pre-cardio only) | Tue shake happens here |
| 6:00–6:30pm | 250ml milk + cashews (Mon, Wed pre-gym) | Pre-workout fuel |
| ~8:30pm | 400ml milk + 1 scoop whey on reaching home (Mon, Wed) | Most critical — before shower, before sitting |
| 9:00–9:30pm | Dinner — Section 7 rotation | Recovery meal |
| Before bed | Soak 8 almonds for tomorrow | 10 seconds |

### WFH / Home Day Schedule (Thu, Fri, Sat, Sun)

| Time | Action | Notes |
|---|---|---|
| 8:00–8:30am | Breakfast — upma / cornflakes / scrambled eggs (Sat+Sun) | No rush |
| 12:30–1:30pm | Lunch — previous night's dinner reheated | Section 8 |
| 5:00–5:30pm | 250ml milk + 1 scoop whey + cashews (Thu, Sun) | Daily shake on rest days |
| 5:30–6:00pm | 250ml milk + cashews pre-gym (Fri) | Pre-workout |
| ~7:30pm | 400ml milk + 1 scoop whey post-gym (Fri) | Post-gym recovery |
| Dinner | Section 7 rotation — cook double for next day | |
| Before bed | Soak 8 almonds for tomorrow | 10 seconds |

---

## 15. MISSED MEAL RECOVERY PROTOCOL

| Scenario | Response |
|---|---|
| Skipped breakfast | Start from lunch as normal. Do not double up. One missed breakfast has zero impact on the week. |
| Light or missed lunch | Extra 250ml milk + handful of cashews in the afternoon. ~11g protein, holds until dinner. |
| No dinner cooked, tired | Paneer bhurji. 15 minutes. Do not replace dinner with snacks on a gym day. |
| Completely off day | Return to schedule the next morning. One bad day does not derail a week. |
| Eating out / social dinner | Paneer dish + roti at any Indian restaurant — always on the menu. Portable protein anchor. |
| Travelling | Paneer dish wherever possible. Milk from any convenience store. Banana in bag. |

---

## 16. WEEKLY PROTEIN SNAPSHOT

| Day | Type | Dinner | Protein Without Whey | With 1 Scoop Whey |
|---|---|---|---|---|
| Monday | Gym + Office | Dry aloo + paratha | ~61g | ~85g |
| Tuesday | Cardio + Office | Mix veg + paneer | ~83g | ~107g |
| Wednesday | Gym + Office | Dal tadka + rice | ~67g | ~91g |
| Thursday | Rest + WFH | Chole + roti | ~69–73g | ~93–97g |
| Friday | Gym + WFH | Fun night | ~86–98g | included |
| Saturday | Cardio + Home | Paneer sabzi/bhurji | ~88–100g | included |
| Sunday | Rest + Home | Dalia | ~82–90g | included |
| **Weekly average** | | | **~77g** | **~93g** |

Monday is the lowest protein day without whey — but post-gym shake delivers 37g in the evening, making total evening protein ~45g. Weekly average with whey sits in the 95–110g target range.

---

## 17. WHAT NOT TO STRESS ABOUT YET

> 📋 Internal planning reference — not for website.

| Thing | When to address it |
|---|---|
| Exact macro tracking (carbs/fats daily) | Phase 2 nutrition upgrade — optional |
| Daily calorie counting | Use the weekly snapshot — if following the structure, the range is right |
| Introducing new foods | Section 8 (Picky Eating) — separate slow project |
| Creatine | After 4–6 weeks of consistent diet and training |
| Vitamin D, B12, iron | Section 6 (Supplements) — after diet is consistent for several weeks |
| Supplement timing precision | Get the basics right first |

---

## 18. QUICK REFERENCE CARD

### Office Days (Mon, Tue, Wed)

| Anchor | What | Never Skip |
|---|---|---|
| Wake up | Start pohe prep immediately | ✓ |
| Morning | Pohe + 8 soaked almonds + 5 cashews | ✓ |
| Leaving | 1 banana in the bag | ✓ |
| 10:30am | Banana + 5 cashews together | ✓ — never banana alone |
| Lunch | Section 6 rotation — vary across the week | ✓ |
| Pre-gym Mon/Wed (6pm) | 250ml milk + cashews | ✓ |
| Pre-cardio Tue (5pm) | 250ml milk + whey | ✓ |
| Post-gym Mon/Wed (~8:30pm) | 400ml milk + whey — pour before anything else | ✓ most critical |
| Dinner | Section 7 rotation for the day | ✓ |
| Before bed | Soak 8 almonds | ✓ |

### WFH / Home Days (Thu, Fri, Sat, Sun)

| Anchor | What | Never Skip |
|---|---|---|
| Breakfast | Upma / eggs (Sat+Sun) / cornflakes | ✓ |
| Lunch | Previous night's dinner reheated | ✓ |
| Evening Thu/Sun (5pm) | 250ml milk + whey + cashews | ✓ |
| Pre-gym Fri (5:30pm) | 250ml milk + cashews | ✓ |
| Post-gym Fri (~7:30pm) | 400ml milk + whey | ✓ |
| Dinner | Section 7 rotation — cook double | ✓ |
| Before bed | Soak 8 almonds | ✓ |

### Key Numbers

| Target | Number |
|---|---|
| Daily protein goal | 95–110g |
| Daily calories | 1,800–2,000 kcal |
| Post-gym milk | 400ml |
| Whey per day | 1 scoop (24g) |
| Paneer at dinner | 100–150g |
| Soaked almonds per morning | 8 |

---

## 19. 4-WEEK CHECK-IN CHECKLIST

> 📋 Internal planning reference — not for website.

At the end of Week 4 go through this honestly. Habit audit only — not a plan overhaul.

### Habit Checklist

| Habit | Target | ✓ / ✗ |
|---|---|---|
| Post-gym milk (400ml) Mon/Wed/Fri | Automatic — happens before shower every time | |
| Whey introduced (Week 3) | 1 scoop daily, consistently | |
| Banana in bag every office morning | 8+ out of 12 office mornings | |
| Banana always with cashews | Never alone | |
| Pohe + nuts on office mornings | 8+ out of 12 | |
| Almonds soaked the night before | Most nights | |
| Office lunch varied across the week | Not ordering paneer every single day | |
| Cava bowl tried at least once | Yes / No — feedback? | |
| Sweetgreen rebuilt bowl tried | Yes / No — feedback? | |
| Dinner cooked at home most nights | Not defaulting to Maggi more than once a week | |
| Double portions made for WFH lunches | Working or not? | |
| Scrambled eggs tried on Saturday | Yes / No — any discomfort? | |

### What to Do Based on Results

**8+ checked:** Plan is running. Move to Phase 2 additions (creatine, cornflakes → oats). Stay on current plan for another 4 weeks before the 12-week reassessment.

**5–7 checked:** Identify the specific broken habits. Address those only.

**Fewer than 5 checked:** Something structural is wrong. Open a new chat, share this file, troubleshoot before continuing.

---

## 20. 12-WEEK REASSESSMENT FRAMEWORK

> 📋 Internal planning reference — not for website.

### Data to Bring to the 12-Week Chat

| Metric | How to measure |
|---|---|
| Current weight | Morning, after bathroom, before eating |
| HbA1c | Blood test — request specifically from doctor |
| Gym phase | Phase 1, 2, or 3? |
| Protein average | How many days per week hitting 95g+? |
| Which lunch options stuck | Which of the 5 are actually being used? |
| Egg situation | Scrambled eggs working? Any discomfort? |
| Energy levels | Better, same, or worse than Week 1? |

### What Changes at 12 Weeks

| Trigger | Update |
|---|---|
| Weight increased to 55kg+ | Protein → 100–115g/day. Calories → 2,000–2,200 kcal. |
| Now in Phase 2 (4 gym days) | Review pre-workout nutrition for heavier lifting |
| Scrambled eggs comfortable | Eggs can move into weekday mornings |
| A1C dropped below 5.5 | Plan is working. Continue. No major changes. |
| A1C unchanged or higher | Deeper review of carb sources and meal timing. Consider consulting a dietitian. |
| Lunch rotation settled to 2–3 options | Simplify the plan to reflect reality |
| Creatine ready | 5g creatine monohydrate daily — add to whey shake |
| Cornflakes still not swapped | Make the oats swap now — overdue by 12 weeks |

### What Never Changes at 12 Weeks

- Post-gym milk habit — permanent
- Banana always with cashews — permanent
- Paneer always stocked — permanent
- Dinner rotation framework (dishes can swap, structure stays)
- Fun dinners on Friday only — permanent A1C rule

---

## 21. NEXT CHAT HANDOFF

> 📋 Internal planning reference — not for website. Read this before starting any new nutrition chat.

### What Was Planned and Is Currently Active

Complete Section 3 nutrition plan built in May 2026 through an extensive conversation covering real eating habits, constraints, and preferences. Every detail was specifically negotiated — do not treat this as a generic plan.

**Hard constraints — never violate:**
- No mushrooms, broccoli, or cauliflower — absolute non-negotiable
- No omelettes — currently causing morning digestive discomfort
- Almonds must be soaked overnight — dry almonds not eaten
- No rajma, kidney beans, or black beans — strong dislike
- Picky eater — do not suggest new foods outside Section 8 (Picky Eating plan)
- HbA1c 5.6–5.9 for 2+ years — prediabetes range, family history present

**What is currently active (assumed working at reassessment):**
- Post-gym milk habit
- Pohe + nuts breakfast on office days
- Office lunch rotation across 5 options
- 7-day dinner rotation with leftover lunch coverage
- Whey protein: ON Gold Standard, Double Rich Chocolate, from GNC Newport Centre, Jersey City

### Where to Start in a New Chat

**4-week check-in:** Go through Section 19 checklist together. Fix broken habits before touching anything else.

**12-week reassessment:** Ask for the data in Section 20 before suggesting any changes. Update based on actual numbers, not feelings.

**Issue-specific chat:** Address the specific issue only. Do not re-plan everything.

### What Has Not Been Planned Yet

| Priority | Section | Why |
|---|---|---|
| Next | Section 4 — Hydration | Fast win, supports everything, short session |
| Then | Section 5 — Sleep | Directly affects recovery and training adaptation |
| Then | Section 7 — Habit & Consistency | Most important long-term — prevents gym falling out of schedule again |
| Then | Section 2 — Cardio & Stamina | Layer in once gym habit is established |
| Then | Section 10 — Back Injury Management | Before Phase 2 heavy compound lifts |
| Then | Section 6 — Supplements | After diet consistent for 6+ weeks |
| Then | Section 8 — Picky Eating | Long-term project, low urgency |
| Then | Section 9 — Progress Tracking | Set up at Week 1, referenced monthly |

### Phase 2 Nutrition Pointers

When moving from Phase 1 to Phase 2 of the workout plan:

1. **Calories up:** 1,800–2,000 → 2,000–2,200 kcal. Extra 200 kcal via larger dinner or extra milk on the fourth gym day.
2. **Pre-workout carbs more important:** Barbell squats and deadlifts are more demanding. On the fourth gym day, pre-workout should be a proper meal 90 minutes before — roti + sabzi if timing allows.
3. **Protein target adjusts:** At 54–56kg, target moves to 100–115g/day. Whey shake covers this automatically.
4. **Introduce creatine:** 5g creatine monohydrate daily, mixed into the post-gym whey shake. No loading protocol needed. Plan this in Section 6 (Supplements) chat before Phase 2 starts.
5. **Rest day eating unchanged:** Still ~1,700–1,800 kcal. Only training day calories increase.
6. **Dinner rotation unchanged:** Portion sizes adjust slightly on heavy gym days — more paneer, extra roti — structure stays the same.

---

*Last updated: May 2026 | Version 4.0 | This document covers Section 3 of the Health Planning Project. Sections marked 🔒 go on the Meridian website behind Google auth. Sections marked 📋 are internal planning only — never on the website. Other health plan sections covered in separate project documents.*
