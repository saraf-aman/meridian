/* ============================================================
   MERIDIAN — workout-data.js
   Exercise form library — shared across all phase pages.
   Sets / reps / weight / tempo live in each phase's
   PHASE_CONFIG inline script (co-located with its HTML).
   ============================================================ */

var WD = (function () {
  'use strict';

  var EX = {

    /* ── Pushing ─────────────────────────────────────────────── */

    db_bench: {
      name: 'Dumbbell Flat Bench Press',
      muscles: 'Chest · Front Shoulder · Triceps',
      steps: [
        'Sit on bench with DBs on thighs. Lean back and kick both up — elbows 45° from body at chest height.',
        'Press upward and slightly inward, 2 sec. Stop just short of full elbow lockout.',
        'Lower slowly 3 sec until you feel a mild stretch across the chest.',
        'Keep feet flat and lower back in gentle contact with the bench throughout.'
      ],
      mistakes: [
        'Shrugging shoulders upward — keep them pulled down and back.',
        'Arching lower back off the bench to move more weight.',
        'Bouncing or dropping the weight — the slow return is where muscle is built.'
      ]
    },

    shoulder_press: {
      name: 'Dumbbell Shoulder Press',
      muscles: 'Shoulders · Triceps · Upper Back',
      steps: [
        'Sit on 90° bench. Use thigh-kick to bring DBs to shoulder height, palms facing forward.',
        'Press upward and slightly inward, 2 sec. Stop before elbow lockout.',
        'Lower 3 sec to shoulder height. Pause 1 sec before next rep.',
        'Lower back stays flat against bench — never arch to generate force.'
      ],
      backNote: 'Arching the lower back to press more weight is very common. If your lower back lifts off the pad, drop the weight.'
    },

    incline_press: {
      name: 'Incline Dumbbell Press',
      muscles: 'Upper Chest · Front Shoulder · Triceps',
      steps: [
        'Set bench to 30–45° incline. Use thigh-kick to bring DBs to shoulder height.',
        'Press up and slightly inward at the incline angle, 2 sec. Stop before lockout.',
        'Lower to the sides of your upper chest (not lower chest), 3 sec. Pause 1 sec.',
        'Back stays flat against the incline pad throughout.'
      ]
    },

    push_ups: {
      name: 'Push-Ups',
      muscles: 'Chest · Front Shoulder · Triceps · Core',
      steps: [
        'High plank: hands slightly wider than shoulder-width, body straight from head to heels.',
        'Elbows at 45° from body — not flared outward, not pinned to sides.',
        'Lower chest to 2–3 cm from floor, 3 sec. Push back up, 2 sec.',
        'Core braced throughout — hips must not sag. Start with knee push-ups if needed (same form, knees down).'
      ]
    },

    cable_fly: {
      name: 'Cable Chest Fly',
      muscles: 'Chest · Front Shoulder',
      steps: [
        'Both pulleys at chest height. Stand centred, one handle per hand, arms extended out like a T.',
        'Slight, fixed bend in elbows throughout — do not change this angle during the movement.',
        'Bring hands together in an arc, 2 sec. Like hugging a large tree.',
        'Pause 1 sec, squeeze chest. Return 3 sec to full stretch. Step one foot forward for stability.'
      ]
    },

    bb_bench: {
      name: 'Barbell Bench Press',
      muscles: 'Chest · Front Shoulder · Triceps',
      steps: [
        'Eyes directly below bar. Feet flat on floor. Grip slightly wider than shoulder-width.',
        'Retract shoulder blades firmly — upper back tight against bench. Unrack bar over chest.',
        'Lower to lower chest, elbows at 45–60° from body. Controlled touch, no bounce. Pause 1 sec.',
        'Press upward and slightly back toward the rack. A small natural lower back arch is correct.'
      ],
      backNote: 'Feet stay planted. Lower back should not leave the bench excessively — a small natural arch is fine, a large gap is not.'
    },

    /* ── Pulling ─────────────────────────────────────────────── */

    cable_row: {
      name: 'Seated Cable Row',
      muscles: 'Mid-Back · Lats · Rear Shoulder · Biceps',
      steps: [
        'Low pulley + V-bar. Sit upright, feet on pads, knees slightly bent, cable taut.',
        'Pull handle to your navel, driving elbows straight back as if into your back pockets.',
        'Squeeze shoulder blades 1 sec. Return 3 sec — torso stays upright throughout.',
        'Do not round forward at full extension. Stop before the weight stack touches down.'
      ],
      backNote: 'If your lower back rounds as arms extend, the weight is too heavy. Torso must stay vertical on every rep.'
    },

    lat_pulldown: {
      name: 'Lat Pulldown',
      muscles: 'Lats · Biceps · Rear Shoulder',
      steps: [
        'High pulley, wide straight bar. Thigh pad snug. Overhand grip slightly wider than shoulders.',
        'Slight backward lean (~15°). Pull bar to upper chest, driving elbows down and back toward hips.',
        'Squeeze lats 1 sec at bottom. Return 3 sec — feel the full lat stretch at top.',
        'Always pull to front of chest — never behind the head.'
      ]
    },

    bent_over_row: {
      name: 'Dumbbell Bent-Over Row',
      muscles: 'Mid-Back · Lats · Rear Shoulder · Biceps',
      steps: [
        'Right knee and right hand on bench, left foot on floor. Back flat and parallel to floor.',
        'Pull DB to hip, driving elbow backward and upward, 2 sec. Elbow finishes behind hip.',
        'Pause 1 sec, squeeze back. Lower 3 sec to full arm extension.',
        'Complete all reps on one side, then switch.'
      ],
      backNote: 'Back stays completely flat throughout. If lower back fatigues before your target muscles, the weight is too heavy.'
    },

    face_pull: {
      name: 'Face Pull (Cable)',
      muscles: 'Rear Deltoid · Rotator Cuff · Upper Back',
      steps: [
        'Cable at eye height, rope attachment. Step back until cable is taut.',
        'Pull rope toward your face — elbows flare outward and finish above shoulder height.',
        'Rope ends split to sides of your face. Pause 1 sec, squeezing rear shoulders.',
        'Return 2 sec. Critical for shoulder health and countering the forward posture of pressing work.'
      ]
    },

    /* ── Arms ────────────────────────────────────────────────── */

    bicep_curl: {
      name: 'Dumbbell Bicep Curl',
      muscles: 'Biceps',
      steps: [
        'Stand, DBs at sides, palms facing forward. Upper arms completely pinned to sides.',
        'Curl up 2 sec, pause 1 sec squeezing bicep at top. Lower 3 sec to full extension.',
        'Zero elbow movement throughout — if elbows move forward, the weight is too heavy.'
      ]
    },

    hammer_curl: {
      name: 'Hammer Curl',
      muscles: 'Biceps · Brachialis · Forearms',
      steps: [
        'Stand, DBs at sides, palms facing each other (neutral grip) throughout.',
        'Curl up 2 sec, pause 1 sec at top. Lower 3 sec. Same mechanics as bicep curl, different grip.',
        'Upper arms pinned to sides. The neutral grip shifts emphasis to the brachialis.'
      ]
    },

    tricep_pushdown: {
      name: 'Cable Tricep Pushdown',
      muscles: 'Triceps',
      steps: [
        'High pulley, rope attachment. Stand close. Upper arms pinned to sides, elbows at ~90°.',
        'Push rope down to full arm extension, 2 sec. Flare rope ends apart at the bottom.',
        'Pause 1 sec, squeeze triceps. Return 3 sec. Upper arms must not move.'
      ]
    },

    overhead_tricep: {
      name: 'Overhead Tricep Extension (Cable)',
      muscles: 'Triceps (long head)',
      steps: [
        'Low pulley, rope. Face away from machine. Grip rope overhead, hands behind head.',
        'Extend arms overhead fully, 2 sec. Pause 1 sec at full extension.',
        'Return 3 sec, feeling the tricep stretch. Elbows stay close to head throughout.'
      ]
    },

    /* ── Lower body ──────────────────────────────────────────── */

    leg_press: {
      name: 'Leg Press (Machine)',
      muscles: 'Quads · Glutes · Hamstrings',
      steps: [
        'Feet shoulder-width, toes slightly out. Knees at ~90° at start. Release safety handles.',
        'Lower platform 3 sec to ~90° knee bend. Pause 1 sec.',
        'Push away 2 sec — do not fully lock knees. No stack contact between reps.',
        'Tailbone and lower back stay pressed into seat. Reduce depth if they lift.'
      ],
      backNote: 'Allowing the tailbone to lift at the bottom puts compressive stress on the lumbar spine. Reduce range if this happens.'
    },

    goblet_squat: {
      name: 'Goblet Squat',
      muscles: 'Quads · Glutes · Inner Thighs · Core',
      steps: [
        'Hold DB vertically at chest. Feet slightly wider than shoulder-width, toes 30° outward.',
        'Brace core. Push knees out over toes, sit hips straight down, 3 sec. Heels stay flat.',
        'Lower to thigh-parallel. Pause 1 sec. Drive through heels to stand, 2 sec.',
        'Chest stays upright throughout — do not lean forward.'
      ],
      mistakes: [
        'Heels lifting off the floor — reduce depth, do not force it.',
        'Knees caving inward — actively push them out over your toes.'
      ]
    },

    barbell_squat: {
      name: 'Barbell Squat',
      muscles: 'Quads · Glutes · Hamstrings · Core',
      steps: [
        'Bar on upper back muscle shelf (not neck, not spine). Feet shoulder-width, toes out 20–30°.',
        'Deep breath, brace core hard (Valsalva). Push knees out in direction of toes.',
        'Lower hips back and down, 3 sec to thigh-parallel. Chest stays upright throughout.',
        'Pause 2 sec at bottom. Drive through heels to stand, 2 sec. Breathe out on the way up.'
      ],
      backNote: 'Phase 2 is form-building only. If the weight causes significant forward lean, stop the set — weight is too heavy.'
    },

    leg_curl: {
      name: 'Seated Leg Curl',
      muscles: 'Hamstrings',
      steps: [
        'Thigh pad snug. Ankle pad just above heel. Legs near-fully extended at start.',
        'Curl down 3 sec to ~90° knee bend. Pause 1 sec, squeeze hamstrings.',
        'Return 2 sec to extended position. Pause 1 sec before next rep.'
      ]
    },

    leg_extension: {
      name: 'Leg Extension',
      muscles: 'Quadriceps',
      steps: [
        'Ankle pad against front of lower leg. Knee aligned with machine pivot point.',
        'Extend legs fully upward, 2 sec. Pause 1 sec, squeeze quads.',
        'Lower 3 sec. Do not let the stack touch between reps.'
      ]
    },

    calf_raise: {
      name: 'Calf Raise (Machine)',
      muscles: 'Calves',
      steps: [
        'Balls of feet on platform edge, heels hanging below for a full stretch.',
        'Push through balls of feet, raise heels as high as possible, 2 sec.',
        'Pause 1 sec at top — really squeeze the calf. Lower 2 sec to full stretch. Pause 1 sec.',
        'Full range every rep. No bouncing half reps — calves respond to the stretch.'
      ]
    },

    glute_bridge: {
      name: 'Glute Bridge',
      muscles: 'Glutes · Hamstrings · Lower Back Stabilisers',
      steps: [
        'On back, knees bent, feet hip-width. Fingertips should just reach heels.',
        'Push hips up by squeezing glutes, 2 sec. Straight line from knees to shoulders.',
        'Squeeze hard at top, pause 1 sec. Lower 2 sec. Pause 1 sec at bottom — slight tension.',
        'Drive through heels, not toes. If hamstrings cramp, move feet further away.'
      ]
    },

    romanian_dl: {
      name: 'Dumbbell Romanian Deadlift',
      muscles: 'Hamstrings · Glutes · Lower Back (stabiliser)',
      steps: [
        'Stand, DBs at sides, palms facing body. Feet hip-width, soft knee bend. Brace core.',
        'Push hips BACKWARD as if touching the wall behind you. Torso hinges, DBs drag down your legs.',
        'Lower until hamstring stretch (mid-shin for most). Stop the moment tension moves to lower back.',
        'Drive hips forward to stand, 2 sec. Breathe out. Spine stays naturally arched — never rounded.'
      ],
      backNote: 'Any shift of tension from hamstrings to lower back = you have gone too far. The hinge is from the hips. The back is a stabiliser, never the mover.'
    },

    conv_deadlift: {
      name: 'Conventional Deadlift',
      muscles: 'Hamstrings · Glutes · Lower Back · Traps',
      steps: [
        'Bar over mid-foot. Grip just outside legs, double overhand. Shins touch bar on set-up.',
        'Set position: hips above knees, shoulders above bar, neutral spine. Pull slack out of bar first.',
        'Push the floor away (like a leg press) while pulling the bar against your legs — perfectly vertical bar path.',
        'Pause 2 sec standing tall. Return: push hips back first, then lower bar along your legs.'
      ],
      backNote: 'Phase 2: bar only (45 lbs). Any sensation in the area of your original injury = stop the set immediately. No exceptions.'
    },

    /* ── Core ────────────────────────────────────────────────── */

    dead_bug: {
      name: 'Dead Bug',
      muscles: 'Deep Core · Hip Flexors · Coordination',
      steps: [
        'Lie on back. Press lower back firmly to the floor — no gap, at all times.',
        'Arms pointing to ceiling, knees at 90° in the air. Exhale fully.',
        'Simultaneously lower RIGHT arm overhead + LEFT leg toward the floor, 3–4 sec. Hover 1–2 cm above floor.',
        'Return slowly. Switch: LEFT arm + RIGHT leg. That is 1 rep each side.'
      ],
      backNote: 'Lower back MUST stay in contact with the floor. If it lifts, shorten your range of motion. This rule is non-negotiable.'
    },

    bird_dog: {
      name: 'Bird-Dog',
      muscles: 'Core Stability · Lower Back Extensors · Glutes',
      steps: [
        'On hands and knees. Hands below shoulders, knees below hips. Neutral spine.',
        'Simultaneously extend RIGHT arm forward + LEFT leg backward, 3–4 sec.',
        'At full extension: arm and leg parallel to floor. Hold 2 sec.',
        'Return slowly. Switch: LEFT arm + RIGHT leg. Hips must stay level — zero rotation.'
      ],
      backNote: 'If hips rotate when you extend your leg, reduce your range. Both hip bones must point straight at the floor at all times.'
    },

    plank: {
      name: 'Plank Hold',
      muscles: 'Full Core · Shoulders · Back Stabilisers',
      steps: [
        'Forearm plank: elbows directly below shoulders. Body straight from head to heels.',
        'Feet hip-width, toes tucked. Glutes squeezed, core braced throughout.',
        'Hold for stated duration. Breathe normally.',
        'If lower back compresses, hips are sagging — lift them slightly. Stop if discomfort persists.'
      ]
    },

    mountain_climbers: {
      name: 'Mountain Climbers (Slow)',
      muscles: 'Core · Hip Flexors',
      steps: [
        'High plank: hands below shoulders, arms extended, body in a straight line.',
        'Bring RIGHT knee toward RIGHT elbow, 2 sec. Return 2 sec.',
        'Bring LEFT knee toward LEFT elbow, 2 sec. Return. That is 2 reps.',
        'These are SLOW — core stability work, not cardio. Hips must not bounce or shift.'
      ]
    }

  };

  return { EX: EX };
}());
