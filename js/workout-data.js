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
        'Pick up a dumbbell in each hand. Sit on the flat bench with both dumbbells resting on your thighs.',
        'Lean back onto the bench and simultaneously kick both thighs upward — the momentum brings the dumbbells to chest level. This is the standard way to get heavy dumbbells into position safely.',
        'Lie flat on the bench. Hold both dumbbells at chest level, elbows at roughly 45 degrees from your body — not flared straight out to the sides like a T, and not pinned against your ribcage.',
        'Press both dumbbells upward and very slightly inward toward each other, counting 2 seconds on the way up. Stop just before full elbow lockout — leave a slight bend.',
        'Lower slowly, counting 3 seconds, until the dumbbells are back at chest level and you feel a mild stretch across the chest.',
        'Keep your feet flat on the floor and your lower back in gentle contact with the bench at all times. Do not arch your back off the bench to generate more force.'
      ],
      mistakes: [
        'Shrugging your shoulders toward your ears during the press — actively keep your shoulders pulled down and back throughout.',
        'Arching your lower back off the bench to push more weight — your back should stay in contact with the bench.',
        'Dropping or bouncing the weight — the slow, controlled lowering phase is where most of the muscle is built.'
      ]
    },

    shoulder_press: {
      name: 'Dumbbell Shoulder Press',
      muscles: 'Shoulders · Triceps · Upper Back',
      steps: [
        'Sit on an adjustable bench set to 90 degrees (fully upright). If no adjustable bench is available, sit on the edge of a flat bench with your back braced.',
        'To get the dumbbells into position: hold both at thigh level while seated, then use the thigh-kick technique — kick your thighs upward one at a time to swing each dumbbell up to shoulder height.',
        'Starting position: dumbbells at shoulder height, palms facing forward, elbows at roughly 90 degrees and slightly in front of your body — elbows should not be flared directly out to your sides.',
        'Press both dumbbells upward and slightly inward so they come close together at the top, counting 2 seconds. Do not let them clank together. Stop just before locking the elbows.',
        'Lower slowly, counting 3 seconds, back to shoulder height. Pause 1 second at the bottom before the next rep.',
        'Keep your lower back pressed against the bench pad at all times. Do not arch your back to generate force — if you feel your back arching, the weight is too heavy.'
      ],
      backNote: 'Arching the lower back to press more weight is extremely common and puts direct stress on the lumbar spine. If your lower back lifts off the pad at any point, drop the weight by one step.'
    },

    incline_press: {
      name: 'Incline Dumbbell Press',
      muscles: 'Upper Chest · Front Shoulder · Triceps',
      steps: [
        'Set an adjustable bench to a 30–45 degree incline — roughly halfway between fully flat and fully upright. Do not set it fully upright, that turns it into a shoulder press.',
        'Sit on the bench. Use the thigh-kick technique to bring the dumbbells to shoulder height: dumbbells on thighs, lean back onto the incline pad, kick thighs upward to swing DBs into position.',
        'Starting position: dumbbells at shoulder height beside your upper chest, elbows at roughly 45 degrees from your body.',
        'Press upward and slightly inward at the angle of the incline, counting 2 seconds. Stop before elbow lockout.',
        'Lower to the sides of your upper chest — not your lower chest. Count 3 seconds. Pause 1 second before the next rep.',
        'Keep your back flat against the incline pad throughout. Do not arch away from the pad to push more weight.'
      ]
    },

    push_ups: {
      name: 'Push-Ups',
      muscles: 'Chest · Front Shoulder · Triceps · Core',
      steps: [
        'Full push-up: Start in a high plank position — hands on the floor, slightly wider than shoulder-width. Arms fully extended. Body forms a perfectly straight line from your head to your heels. Feet together or hip-width apart.',
        'Elbows should travel at roughly 45 degrees from your body as you lower — not flared straight out to the sides (like a T), and not pinned tightly against your ribs.',
        'Lower your chest toward the floor, counting 3 seconds. Stop when your chest is about 2–3 centimetres from the floor. Your chest should nearly touch, but not rest on, the floor.',
        'Push back up, counting 2 seconds, until arms are extended again.',
        'Keep your core braced and glutes squeezed throughout the entire movement. Your hips must not sag toward the floor — your body is a rigid plank from head to heels the whole time.',
        'Knee push-up (if full push-ups are not yet possible): Same setup as above but place your knees on the floor. From your knees to your shoulders, your body should still form a straight line — do not put your backside in the air. Same tempo applies. Transition to full push-ups once you can complete 10 knee push-ups with correct form.'
      ]
    },

    cable_fly: {
      name: 'Cable Chest Fly',
      muscles: 'Chest · Front Shoulder',
      steps: [
        'Set both cable pulleys to chest height. Stand in the centre of the cable setup, one handle in each hand.',
        'Step one foot slightly forward for balance. Arms are extended outward to your sides like a T shape. Maintain a slight, fixed bend in your elbows — roughly 15–20 degrees. This elbow angle does not change during the movement.',
        'Bring both hands together in an arc in front of you, as if you are hugging a large tree. Count 2 seconds on this pulling-together phase.',
        'When your hands meet in front of your chest, pause 1 second and squeeze the chest muscles hard.',
        'Return slowly outward, counting 3 seconds, until your arms are back in the T starting position and you feel a stretch across the chest.',
        'Important: if only one cable column is available, do one arm at a time with a single handle attachment — the movement is the same.'
      ]
    },

    bb_bench: {
      name: 'Barbell Bench Press',
      muscles: 'Chest · Front Shoulder · Triceps',
      steps: [
        'Lie on the flat bench inside the bench press rack. Position yourself so your eyes are directly below the bar. Feet flat on the floor.',
        'Grip the bar slightly wider than shoulder-width — your hands should be at the point where, when you lower the bar, it naturally contacts your lower chest.',
        'Before unracking: retract your shoulder blades firmly (pull them down and together) and press your upper back into the bench. This creates a stable, rigid base. A small natural arch in the lower back is correct and intentional.',
        'Unrack by straightening your arms to lift the bar off the hooks, then shift it horizontally until it is directly above your chest.',
        'Lower the bar to your lower chest, counting 3 seconds. Elbows travel at 45–60 degrees from your body — not flared straight out to the sides. Controlled touch on the chest — no bouncing. Pause 1 second.',
        'Press upward and very slightly back toward the rack until arms are extended. A small lower back arch throughout is normal. An excessive gap between your back and the bench is not — keep feet planted firmly.'
      ],
      backNote: 'Keep feet firmly planted on the floor the entire set. A small natural lower back arch is correct bench press technique. A large gap where your back bridges off the bench is a risk — if this happens, you are using too much weight.'
    },

    /* ── Pulling ─────────────────────────────────────────────── */

    cable_row: {
      name: 'Seated Cable Row',
      muscles: 'Mid-Back · Lats · Rear Shoulder · Biceps',
      steps: [
        'This is the cable machine with the low pulley — the cable comes from near the floor. Attach the V-bar (also called a close-grip row handle — it looks like a narrow V or triangle with two handles close together).',
        'Sit on the bench facing the machine. Place your feet on the foot pads or frame. Knees slightly bent — not straight, not deeply bent. Reach forward and grip the V-bar.',
        'Starting position: sitting upright with arms extended forward holding the handle, cable taut (not slack). Your torso is at roughly 90 degrees — not leaning back, not leaning forward.',
        'Pull the handle toward your lower abdomen (navel area). As you pull, drive your elbows backward and slightly downward — as if you are trying to put your elbows into your back pockets.',
        'At the end of the pull, your hands should be touching or nearly touching your stomach. Your elbows should be behind your body. Squeeze your shoulder blades together for 1 second.',
        'Return the handle slowly toward the machine, counting 3 seconds. Your torso stays upright throughout — do not round your back forward as your arms extend, and do not lean back then jerk forward for momentum.',
        'Stop before the weight stack touches down. Keep tension on the cable between reps.'
      ],
      backNote: 'The critical mistake here is rounding the lower back at full arm extension. As your arms extend, resist the urge to lean forward and round. If you cannot keep your back flat throughout the full range, the weight is too heavy — drop it down.'
    },

    lat_pulldown: {
      name: 'Lat Pulldown',
      muscles: 'Lats · Biceps · Rear Shoulder',
      steps: [
        'This is the cable machine with the high pulley — the cable comes from above. Attach the wide straight bar (the long horizontal bar typically already on this machine).',
        'Sit facing the machine. Adjust the thigh pad so it sits snugly on top of your thighs when seated — it should hold you down when you pull. Without the pad engaging, your body will simply lift off the seat.',
        'Reach up and grip the bar with an overhand grip (palms facing away from you), slightly wider than shoulder-width. Your hands should be at roughly the point where the bar starts to angle downward on each side.',
        'Starting position: sitting upright with arms extended overhead holding the bar. You will have a slight backward lean of about 10–15 degrees — this is correct. Do not lean all the way back.',
        'Pull the bar downward toward your upper chest. As you pull, think of driving your elbows downward and back toward your hips. Your chest should rise slightly to meet the bar.',
        'The bar should come to just below your chin, touching or nearly touching the top of your chest. Squeeze the back muscles for 1 second at the bottom.',
        'Return the bar upward slowly, counting 3 seconds. Let your arms extend fully at the top and feel the stretch in the lats before the next rep.'
      ],
      mistakes: [
        'Pulling the bar behind your head — this puts significant stress on the cervical spine. Always pull to the front of your chest.',
        'Using momentum — leaning back aggressively and swinging your body to move the weight. The movement should come from your back muscles, not from throwing your body weight.'
      ]
    },

    bent_over_row: {
      name: 'Dumbbell Bent-Over Row',
      muscles: 'Mid-Back · Lats · Rear Shoulder · Biceps',
      steps: [
        'Place your right knee and right hand on a flat bench. Your right hand should be directly below your right shoulder, and your right knee directly below your right hip. Left foot stays planted firmly on the floor.',
        'Pick up the dumbbell with your left hand. Your left arm hangs straight down toward the floor, palm facing your body (toward the bench).',
        'Your back should be parallel to the floor — flat and horizontal. Look at a spot on the floor directly below your face, not up or to the side.',
        'Pull the dumbbell upward toward your hip, driving your elbow backward and upward, counting 2 seconds. Your elbow should travel close to your body and finish behind your hip.',
        'At the top, pause 1 second and squeeze the back muscles on that side.',
        'Lower the dumbbell slowly, counting 3 seconds, back to the fully extended arm position where your arm hangs straight down.',
        'Complete all prescribed reps on the left side. Then switch: right hand holds the dumbbell, left knee and left hand on the bench.'
      ],
      backNote: 'Keep your back completely flat and parallel to the floor throughout the entire set. If your lower back is fatiguing before your upper back and arm muscles, the weight is too heavy. Drop it down.'
    },

    face_pull: {
      name: 'Face Pull (Cable)',
      muscles: 'Rear Deltoid · Rotator Cuff · Upper Back',
      steps: [
        'Set the cable pulley to eye height or slightly above. Attach the rope (the thick rope with two knotted ends).',
        'Stand facing the cable machine, feet hip-width apart. Grip the rope with both hands, palms facing each other. Step backward until there is tension in the cable — the weight should not be resting on the stack.',
        'Pull the rope toward your face, counting 2 seconds. As you pull, your hands will naturally separate — let them come to either side of your face, not to the centre of your face.',
        'Your elbows should flare outward and upward, finishing above shoulder height. Pause 1 second, squeezing the rear shoulder muscles hard.',
        'Return slowly, counting 2 seconds. This exercise is critical for shoulder health and directly counteracts the rounded-shoulder posture that develops from pressing work.'
      ]
    },

    /* ── Arms ────────────────────────────────────────────────── */

    bicep_curl: {
      name: 'Dumbbell Bicep Curl',
      muscles: 'Biceps',
      steps: [
        'Stand with a dumbbell in each hand, feet hip-width apart. Arms hanging at your sides, palms facing forward (supinated grip — this is the standard curl grip).',
        'Keeping your upper arms completely pinned to your sides and absolutely still, curl both dumbbells upward toward your shoulders, counting 2 seconds on the way up. Your upper arms must not move at all — only your forearms move.',
        'At the top, your forearms are nearly vertical. Pause 1 second and squeeze the bicep hard.',
        'Lower slowly, counting 3 seconds, back to full arm extension at your sides.',
        'You can do both arms simultaneously or alternating — both are acceptable in Phase 1.',
        'If your upper arms or elbows are swinging forward as you curl, the weight is too heavy. Drop down to the next weight.'
      ]
    },

    hammer_curl: {
      name: 'Hammer Curl',
      muscles: 'Biceps · Brachialis · Forearms',
      steps: [
        'Stand with a dumbbell in each hand, feet hip-width apart. Arms at your sides, palms facing each other — as if holding a hammer. This neutral grip is different from the regular bicep curl and stays neutral throughout the entire movement.',
        'Keeping your upper arms completely still and pinned to your sides, curl both dumbbells upward, counting 2 seconds. The palms never rotate — they face each other the whole time.',
        'At the top, pause 1 second and squeeze. Lower slowly, counting 3 seconds, to full extension.',
        'The neutral grip shifts emphasis to the brachialis — the muscle underneath the bicep — and also works the forearms more than a standard curl. This creates fuller-looking upper arms over time.'
      ]
    },

    tricep_pushdown: {
      name: 'Cable Tricep Pushdown',
      muscles: 'Triceps',
      steps: [
        'Set the cable to the high pulley. Attach the rope. Stand facing the machine, feet hip-width apart. Step close — roughly 30–40 cm from the pulley column.',
        'Grip the rope with both hands, palms facing each other (neutral grip). Pull the rope down so your elbows are bent at roughly 90 degrees and your upper arms are pinned vertically at your sides. This is your starting position.',
        'Push the rope downward, extending your arms, counting 2 seconds. As you reach the bottom of the movement, pull the two ends of the rope slightly apart (outward away from each other) — this small flare at the bottom increases the tricep contraction.',
        'Pause 1 second at full arm extension, squeezing the triceps hard.',
        'Return slowly upward, counting 3 seconds. Do not let the weight pull your elbows forward or upward — your upper arms must stay still and pinned to your sides throughout the entire set.'
      ]
    },

    overhead_tricep: {
      name: 'Overhead Tricep Extension (Cable)',
      muscles: 'Triceps (long head)',
      steps: [
        'Set the cable to the low pulley. Attach the rope. Stand facing away from the machine.',
        'Reach back and grip the rope with both hands, palms facing each other. Raise your arms overhead so your hands are positioned behind your head near the top of your neck. Elbows point toward the ceiling.',
        'This is your starting position: arms bent overhead, hands behind head, elbows high and close to your head.',
        'Extend your arms fully overhead, counting 2 seconds. Stop just before locking the elbows.',
        'Pause 1 second at full extension with arms overhead.',
        'Return slowly, counting 3 seconds. You will feel a deep stretch in the back of your upper arms (the tricep) at the bottom. Elbows must stay close to your head throughout — do not let them flare outward.'
      ]
    },

    /* ── Lower body ──────────────────────────────────────────── */

    leg_press: {
      name: 'Leg Press (Machine)',
      muscles: 'Quads · Glutes · Hamstrings',
      steps: [
        'Sit in the leg press machine. It has a reclined seat and a large platform you push with your feet. Adjust the seat: you want your knees at roughly 90 degrees when your feet are flat on the platform.',
        'Place your feet on the platform shoulder-width apart, toes pointed slightly outward (about 15–20 degrees). Feet should be positioned in the middle of the platform — not at the very top edge, not at the very bottom edge.',
        'Before starting: release the safety handles (usually two handles on the sides that you turn or push to disengage the lock). Always check these are released before pressing.',
        'Lower the platform toward you by bending your knees slowly, counting 3 seconds. Lower until your knees are at roughly 90 degrees — thighs roughly parallel to the floor. Pause 1 second.',
        'Push the platform away by extending your legs, counting 2 seconds. Do not fully lock your knees at the top — leave a very slight bend.',
        'Do not let the weight stack touch down between reps. Keep tension throughout the set.',
        'When the set is complete, engage the safety handles before getting up — turn both side handles back into the locked position.'
      ],
      backNote: 'Keep your lower back and tailbone pressed firmly into the seat pad throughout every rep. If your tailbone lifts off the seat at the bottom, you are going too deep — reduce the range of motion. This tailbone-lifting is one of the most common sources of lower back strain on the leg press.'
    },

    goblet_squat: {
      name: 'Goblet Squat',
      muscles: 'Quads · Glutes · Inner Thighs · Core',
      steps: [
        'Pick up one dumbbell. Hold it vertically with both hands cupped around the top end — as if you are holding a large goblet or chalice. Your hands form a diamond shape around the weight, and the dumbbell hangs vertically in front of your chest.',
        'Stand with your feet slightly wider than shoulder-width, toes pointed outward at about 30 degrees. The dumbbell should be held at chest height, close to your sternum. Elbows point downward.',
        'Before squatting, breathe in and brace your core.',
        'Lower your body by pushing your knees outward in the direction your toes are pointing, and sitting your hips straight down, counting 3 seconds. Keep your chest upright — do not let it collapse forward. Think "chest up" throughout.',
        'Lower until your thighs are parallel to the floor, or as low as you can go while your heels stay flat on the floor. Do not force depth beyond what your body allows. Pause 1 second at the bottom.',
        'Push through your heels to stand back up, counting 2 seconds. Breathe out on the way up.',
        'Do not lock your knees at the top — keep a very slight bend.'
      ],
      mistakes: [
        'Heels lifting off the floor — this means ankle mobility is tight. Do not force depth. Go only as low as heels stay completely flat.',
        'Chest collapsing forward — the dumbbell weight should help keep you upright. If you are leaning forward significantly, the weight may be too heavy or you may need to widen your stance.',
        'Knees caving inward — actively drive your knees outward throughout the entire movement, not just at the bottom.'
      ]
    },

    barbell_squat: {
      name: 'Barbell Squat',
      muscles: 'Quads · Glutes · Hamstrings · Core',
      steps: [
        'Set the J-hooks at approximately your shoulder height when standing. The bar should be at a height where you can unrack it with a slight knee bend, not a deep squat. Set the safety bars just below hip height (to catch the bar if you fail a rep).',
        'Stand under the bar. The bar sits on the shelf of muscle at the top of your upper back — just below the bony bump at the top of your spine. It should NOT rest on the bony spine itself and NOT on your neck. Grip the bar slightly wider than shoulder-width.',
        'Take a deep breath and brace your core. Stand up to lift the bar from the hooks. Take exactly 2 controlled steps backward — one step back with the right foot, one with the left. Stop and set your feet.',
        'Feet shoulder-width apart, toes pointed outward 20–30 degrees. This is your squatting stance.',
        'Take another deep breath and brace your core hard — as if bracing for a punch to the stomach. This is the Valsalva manoeuvre and it protects your spine under load. Push your knees outward in the direction your toes are pointing.',
        'Lower your hips back and down, counting 3 seconds. Keep your chest upright — if your chest is collapsing toward your thighs, the weight is too heavy. Lower to thigh-parallel (thighs parallel to the floor). Do not go deeper in Phase 2.',
        'Pause 2 seconds at the bottom — this is longer than most exercises and is intentional. It removes any bounce and builds true strength.',
        'Drive through your heels to stand back up, counting 2 seconds. Breathe out on the way up. Do not lock your knees at the top.'
      ],
      backNote: 'If the weight causes significant forward lean — your chest dropping toward your thighs — stop the set immediately. In Phase 2, this is a form-building exercise, not a maximum effort. Ego has no place here. If the bar alone (45 lbs) feels heavy, that is completely fine — use it and build the pattern.'
    },

    leg_curl: {
      name: 'Seated Leg Curl',
      muscles: 'Hamstrings',
      steps: [
        'Sit in the machine. It has a seat with a pad that sits on top of your thighs (to hold you down when pulling) and a roller pad that presses against the back of your lower legs just above the ankles.',
        'Adjust the thigh pad so it sits snugly on top of your thighs when you are seated. Adjust the ankle pad so it presses firmly against the back of your lower legs just above the ankle. Adjust the starting lever so your legs begin in a near-fully extended position.',
        'Grip the handles on the sides of the seat.',
        'Curl your legs downward by bending your knees, pulling the ankle pad down and backward, counting 3 seconds. At the end of the movement, your knees should be bent at roughly 90 degrees or slightly more.',
        'Pause 1 second at the bottom, squeezing the hamstrings.',
        'Return your legs to the extended position slowly, counting 2 seconds. Pause 1 second at the top with legs extended before the next rep.'
      ]
    },

    leg_extension: {
      name: 'Leg Extension',
      muscles: 'Quadriceps',
      steps: [
        'Sit in the machine. It has a seat with a roller pad that presses against the front of your lower legs just above the ankles. Adjust the back pad so you sit comfortably.',
        'Adjust the ankle pad so it sits against the front of your lower legs just above the ankle. Your knee should align with the pivot point of the machine (the axis it rotates around — most machines have a small marker or sticker indicating this).',
        'Grip the handles on the sides of the seat.',
        'Extend your legs upward by straightening your knees, pushing the ankle pad up and forward, counting 2 seconds.',
        'At the top, your legs are fully extended. Pause 1 second and squeeze the quadriceps (the front of your thighs) as hard as you can.',
        'Lower slowly, counting 3 seconds, back to the starting position. Do not let the weight stack touch between reps — keep tension on the muscle.'
      ]
    },

    calf_raise: {
      name: 'Calf Raise (Machine)',
      muscles: 'Calves',
      steps: [
        'Standing calf raise machine: stand on the platform with the shoulder pads resting on your shoulders (on the trapezius — the muscle at the top of your shoulders, not on your neck). Only the balls of your feet should be on the edge of the platform — your heels hang off the back.',
        'If your gym does not have a dedicated calf raise machine: use the leg press machine with a light weight. Place just the balls of your feet on the very bottom edge of the platform and push through your calves.',
        'Starting position: heels hanging below the platform level, giving your calves a full stretch. This stretch at the bottom is important — do not skip it.',
        'Push through the balls of your feet to raise your heels as high as possible, counting 2 seconds. Rise up onto your tiptoes.',
        'At the top, pause 1 second and squeeze the calf muscles hard at the peak contraction.',
        'Lower slowly, counting 2 seconds, all the way back below the platform level for the full stretch.',
        'Pause 1 second at the bottom before the next rep. Full range every single rep — the calves respond specifically to the full stretch at the bottom combined with the full contraction at the top.'
      ]
    },

    glute_bridge: {
      name: 'Glute Bridge',
      muscles: 'Glutes · Hamstrings · Lower Back Stabilisers',
      steps: [
        'Lie on your back on a mat or the floor. Bend your knees so your feet are flat on the floor, hip-width apart. Your feet should be placed close enough to your backside that if you reach your hands along the floor beside you, your fingertips just graze your heels.',
        'Arms flat on the floor at your sides for stability.',
        'Push your hips upward toward the ceiling by squeezing your glutes — think of "tucking" your tailbone upward. Count 2 seconds on the way up.',
        'At the top, your body should form a straight line from your knees to your shoulders — not a sharp peak, not a sagging arc. Squeeze your glutes hard at the top. Pause 1 second.',
        'Lower your hips slowly, counting 2 seconds.',
        'Pause 1 second at the bottom — hips just touching the floor — before the next rep. Do not fully relax at the bottom. Maintain slight tension before driving back up.',
        'Drive upward through your heels, not your toes. If your hamstrings are cramping, your feet are too close to your backside — move them slightly further away.'
      ]
    },

    romanian_dl: {
      name: 'Dumbbell Romanian Deadlift',
      muscles: 'Hamstrings · Glutes · Lower Back (stabiliser)',
      steps: [
        'Stand upright holding a dumbbell in each hand, arms hanging at your sides, palms facing your body. Feet hip-width apart. Soft bend in your knees — not deeply bent, not fully locked. This is the starting position.',
        'Before moving: brace your core, take a breath in, and hold it for the duration of the rep.',
        'Push your hips backward — imagine trying to touch the wall behind you with your backside. As you do this, your torso will hinge forward and the dumbbells will begin travelling down the front of your legs. Count 3 seconds on the way down.',
        'The dumbbells should stay close to your legs throughout — almost dragging against your thighs, then your shins as you lower.',
        'Lower until you feel a strong stretch in the back of your thighs (your hamstrings). For most people at this stage, this will be around mid-shin. Stop the instant you feel the tension shift from your hamstrings into your lower back — that is your stopping point, regardless of how far down you are.',
        'Pause 1 second at the bottom.',
        'Drive your hips forward to return to standing, counting 2 seconds. Think of pushing the floor away with your feet rather than lifting with your back. Breathe out on the way up.'
      ],
      backNote: 'Your back must remain in a neutral position throughout — a very slight natural arch, not flat and not rounded. If you look at yourself from the side in a mirror, your back should look identical at the bottom as it did at the top. The moment your lower back rounds, you have gone too far. Any shift of tension from hamstrings to lower back = you have gone too far.'
    },

    conv_deadlift: {
      name: 'Conventional Deadlift',
      muscles: 'Hamstrings · Glutes · Lower Back · Traps',
      steps: [
        'Load the barbell on the floor. With just the bar and no plates, it sits very low. Add a pair of 10 lb plates to each side — this raises the bar to the correct starting height of roughly mid-shin.',
        'Stand with feet hip-width apart, toes pointed slightly outward. Walk forward until the bar is directly over your mid-foot — not against your shins, and not far away. Roughly 3–5 cm from your shins.',
        'Bend down and grip the bar just outside your legs with a double overhand grip (both palms facing you). Hands just outside shoulder-width.',
        'Set your back position before lifting: lower your hips until your shins touch the bar. At this point: hips should be above your knees, shoulders above the bar (and slightly in front of it), back in a neutral position (same slight arch as when standing). Do not squat deeply — this is a hip hinge, not a squat.',
        'Take a deep breath in and brace your core hard. Before pulling, take the slack out of the bar: pull upward very gently until you feel resistance from the bar — it makes a small sound. This prevents the bar from jerking off the floor.',
        'The pull: push the floor away with your feet (as if doing a leg press), while simultaneously pulling the bar against your shins and legs. The bar travels in a perfectly vertical line, dragging up your legs the whole way.',
        'As the bar passes your knees, drive your hips forward to stand fully upright. Count 3 seconds for the entire upward phase.',
        'At the top: stand tall, hips fully extended, shoulders slightly back. Do NOT lean backward or hyperextend your spine.',
        'Pause 2 seconds at the top. Return: push your hips backward first, then lower the bar along your legs maintaining the same neutral spine, until it reaches the floor.'
      ],
      backNote: 'Phase 2 introduction: bar only (45 lbs). No exceptions on the starting weight. Any sensation in the area of your original back injury during or after the deadlift = stop the set immediately and do not continue. This is the most back-relevant exercise in the program and must be treated with full respect.'
    },

    /* ── Core ────────────────────────────────────────────────── */

    dead_bug: {
      name: 'Dead Bug',
      muscles: 'Deep Core · Hip Flexors · Coordination',
      steps: [
        'Lie on your back on a mat. Press your lower back firmly into the floor — there must be no gap between your lower back and the floor. This contact with the floor must be maintained throughout every single rep.',
        'Raise both arms straight toward the ceiling, wrists above your shoulders.',
        'Raise both legs so your knees are bent at 90 degrees in the air — shins parallel to the floor. This is your starting position.',
        'Breathe out fully.',
        'Simultaneously lower your RIGHT arm overhead toward the floor AND your LEFT leg toward the floor — straightening the leg as you go. Move both limbs slowly, taking 3–4 seconds to reach the end position.',
        'Both limbs should hover just 1–2 centimetres above the floor. Do NOT let them touch the floor.',
        'Return both limbs slowly to the starting position.',
        'Then switch: lower your LEFT arm overhead and your RIGHT leg simultaneously.',
        'That is one rep on each side.'
      ],
      backNote: 'If your lower back lifts off the floor at any point during the movement, you have gone too far. Shorten the range of motion — do not lower as far. The lower back staying flat is the entire point of the exercise and is protecting your spine. This rule is non-negotiable.'
    },

    bird_dog: {
      name: 'Bird-Dog',
      muscles: 'Core Stability · Lower Back Extensors · Glutes',
      steps: [
        'Start on your hands and knees on a mat. Hands directly below your shoulders, knees directly below your hips. Your spine is neutral — neither arched upward nor rounded downward. Look at a spot on the floor about 30 cm in front of your hands, not up.',
        'Gently brace your core — create a rigid frame between your hips and your ribcage. Think of stiffening your torso so it does not rotate.',
        'Simultaneously extend your RIGHT arm forward (reaching toward the wall in front of you) and your LEFT leg backward (reaching toward the wall behind you). Take 3–4 seconds to reach full extension.',
        'At full extension: your extended arm and leg should be roughly parallel to the floor — not higher. Hold this position for 2 seconds.',
        'Return both limbs to the starting position slowly.',
        'Switch: simultaneously extend your LEFT arm forward and RIGHT leg backward. Hold 2 seconds. Return.',
        'That is one rep on each side.'
      ],
      backNote: 'The most common mistake: when you extend your leg, the same-side hip will try to hike upward, causing the pelvis to rotate. Resist this completely — both hip bones must point straight down at the floor at all times. If you cannot prevent the hip rotation, shorten your leg extension until you can.'
    },

    plank: {
      name: 'Plank Hold',
      muscles: 'Full Core · Shoulders · Back Stabilisers',
      steps: [
        'Start in a forearm plank: both forearms on the floor, elbows directly below your shoulders. You can make fists or have flat palms — either is fine.',
        'Lift your hips off the floor so your body forms a perfectly straight line from your head to your heels. Your body should look like a plank of wood — not sagging in the middle, not peaking at the hips.',
        'Feet hip-width apart, toes tucked under.',
        'Hold for the full stated duration. Breathe normally throughout — do not hold your breath.',
        'Keep your glutes squeezed and your core braced for the entire hold. Both of these will naturally help your hips from sagging.',
        'If you feel compression or discomfort in your lower back: your hips are likely sagging. Try to slightly raise your hips. If the discomfort continues after adjusting, stop the plank and do the bird-dog instead for that set.'
      ]
    },

    mountain_climbers: {
      name: 'Mountain Climbers (Slow)',
      muscles: 'Core · Hip Flexors',
      steps: [
        'Start in a high plank position: both hands on the floor below your shoulders, arms fully extended. Body forms a straight line from head to heels — same starting position as a push-up.',
        'Bring your RIGHT knee forward toward your RIGHT elbow, counting 2 seconds as you bring it in.',
        'Return it to the starting position, counting 2 seconds.',
        'Bring your LEFT knee forward toward your LEFT elbow, counting 2 seconds. Return, counting 2 seconds.',
        'That is 2 reps total (1 per leg). Continue alternating slowly.',
        'These are SLOW mountain climbers — completely different from the fast cardio version you may have seen. The tempo is 2 seconds forward, 2 seconds back, per leg. The purpose is core stability, not cardiovascular work.',
        'If your hips are bouncing, swaying, or your lower back is sagging at any point, slow down further.'
      ]
    }

  };

  return { EX: EX };
}());
