/**
 * MR.REGYM — Program Configuration
 * ─────────────────────────────────────────────────────────────────
 * This is the ONLY file you need to edit when the program changes.
 *
 * EXERCISE FIELDS:
 *   nameFa      {string}  Persian exercise name (displayed in app)
 *   nameEn      {string}  English exercise name (saved in logs)
 *   sets        {number}  Number of sets
 *   reps        {string}  Rep scheme e.g. "8-10", "12-15", "max", "15+10+10"
 *   system      {string}  Training system: "خطی" | "هرمی" | "سوپرست" | "رست پاز" | "مایورپس" | ""
 *   rest        {number}  Rest in seconds between sets (0 = no timer)
 *   superset    {boolean} true if this is a superset (two moves in one block)
 *   note        {string}  Optional coach note shown in app
 *   videoSearch {string}  YouTube search query for exercise tutorial
 *
 * USERS:
 *   Add a new key under USERS to add a new person.
 *   Each user has: name, avatar (single char), avatarColor (CSS gradient),
 *   info (age/weight string), days[], corrective[], cardio[]
 */

const PROGRAM_CONFIG = {

  // ── AFSHIN ────────────────────────────────────────────────────────
  afshin: {
    name: "افشین",
    nameEn: "Afshin",
    avatar: "ا",
    avatarColor: "linear-gradient(135deg, #e8501a, #f07030)",
    info: "۳۸ ساله · ۱۰۳ کیلوگرم",

    days: [
      {
        titleFa: "روز اول — سینه و پشت بازو",
        titleEn: "Day 1 — Chest & Triceps",
        exercises: [
          {
            nameFa: "پرس سینه دمبل",
            nameEn: "Dumbbell Chest Press",
            sets: 4, reps: "8-10", system: "خطی", rest: 120,
            videoSearch: "dumbbell chest press technique"
          },
          {
            nameFa: "پرس بالا سینه دستگاه تک دست",
            nameEn: "Single-Arm Incline Chest Press Machine",
            sets: 3, reps: "12-15", system: "خطی", rest: 120,
            videoSearch: "incline chest press machine one arm"
          },
          {
            nameFa: "پرس زیر سینه سیمکش",
            nameEn: "Decline Cable Chest Press",
            sets: 3, reps: "10", system: "خطی", rest: 120,
            videoSearch: "decline cable chest press"
          },
          {
            nameFa: "پشت بازو خوابیده هالتر EZ",
            nameEn: "EZ Bar Skull Crusher",
            sets: 4, reps: "10", system: "خطی", rest: 120,
            videoSearch: "EZ bar skull crusher lying tricep extension"
          },
          {
            nameFa: "پشت بازو سیمکش دسته طنابی",
            nameEn: "Cable Tricep Rope Pushdown",
            sets: 1, reps: "15+10+10", system: "رست پاز", rest: 20,
            note: "استراحت درونی ستی ۲۰ ثانیه",
            videoSearch: "cable tricep rope pushdown rest pause technique"
          },
          {
            nameFa: "نشر خم سیمکش آرنج خم",
            nameEn: "Bent-Over Cable Lateral Raise (Bent Elbow)",
            sets: 4, reps: "12", system: "خطی", rest: 120,
            videoSearch: "bent over cable lateral raise bent elbow rear delt"
          },
          {
            nameFa: "فیله میز فیله",
            nameEn: "Back Extension / Hyperextension",
            sets: 3, reps: "15", system: "خطی", rest: 120,
            videoSearch: "back extension hyperextension machine lower back"
          },
          {
            nameFa: "کرانچ پهلو سیمکش نشسته",
            nameEn: "Seated Cable Oblique Crunch",
            sets: 3, reps: "15", system: "خطی", rest: 120,
            videoSearch: "seated cable oblique crunch"
          },
          {
            nameFa: "فلاتر کیکس",
            nameEn: "Flutter Kicks",
            sets: 3, reps: "max", system: "خطی", rest: 120,
            videoSearch: "flutter kicks ab exercise"
          }
        ]
      },

      {
        titleFa: "روز دوم — سرشانه و پا",
        titleEn: "Day 2 — Shoulders & Legs",
        exercises: [
          {
            nameFa: "پرس سرشانه دمبل نشسته",
            nameEn: "Seated Dumbbell Shoulder Press",
            sets: 4, reps: "12", system: "خطی", rest: 120,
            note: "سبک بزن",
            videoSearch: "seated dumbbell shoulder press technique"
          },
          {
            nameFa: "نشر جانب دمبل ایستاده",
            nameEn: "Standing Dumbbell Lateral Raise",
            sets: 3, reps: "12", system: "خطی", rest: 120,
            videoSearch: "standing dumbbell lateral raise shoulder"
          },
          {
            nameFa: "هک اسکوات دستگاه",
            nameEn: "Hack Squat Machine",
            sets: 4, reps: "8-10", system: "خطی", rest: 120,
            videoSearch: "hack squat machine technique legs"
          },
          {
            nameFa: "ددلیفت رومانیایی هالتر + پشت ران دستگاه نشسته",
            nameEn: "Romanian Deadlift Barbell + Seated Leg Curl Machine",
            sets: 4, reps: "12-15 + 10-12", system: "خطی", rest: 120,
            superset: true,
            videoSearch: "romanian deadlift barbell stiff leg technique"
          },
          {
            nameFa: "لانجز اسمیت",
            nameEn: "Smith Machine Lunges",
            sets: 3, reps: "10-12", system: "خطی", rest: 120,
            videoSearch: "smith machine lunges technique"
          },
          {
            nameFa: "ساید لانجز",
            nameEn: "Side / Lateral Lunges",
            sets: 3, reps: "10", system: "خطی", rest: 120,
            videoSearch: "side lateral lunges technique"
          },
          {
            nameFa: "جلو ران دستگاه",
            nameEn: "Leg Extension Machine",
            sets: 3, reps: "10-12-15", system: "هرمی", rest: 120,
            videoSearch: "leg extension machine quad technique"
          },
          {
            nameFa: "ساق نشسته دستگاه",
            nameEn: "Seated Calf Raise Machine",
            sets: 3, reps: "15", system: "خطی", rest: 120,
            videoSearch: "seated calf raise machine technique"
          },
          {
            nameFa: "ساعد دمبل سه جهت",
            nameEn: "Dumbbell Forearm Curl Three Directions",
            sets: 3, reps: "15", system: "خطی", rest: 120,
            videoSearch: "dumbbell wrist curl forearm three directions"
          }
        ]
      },

      {
        titleFa: "روز سوم — زیربغل و جلو بازو",
        titleEn: "Day 3 — Back & Biceps",
        exercises: [
          {
            nameFa: "لت پول داون دستگاه مچ سوپینیشن",
            nameEn: "Lat Pulldown Machine (Supination Grip)",
            sets: 4, reps: "10-12", system: "خطی", rest: 120,
            videoSearch: "lat pulldown supination underhand grip machine"
          },
          {
            nameFa: "زیربغل رویینگ دستگاه دست باز پرونیشن",
            nameEn: "Seated Cable Row Wide Grip Pronation",
            sets: 4, reps: "12-15", system: "خطی", rest: 120,
            videoSearch: "seated cable row wide grip pronation back"
          },
          {
            nameFa: "زیربغل H بار دستگاه گیرش خنثی",
            nameEn: "T-Bar Row Neutral Grip",
            sets: 3, reps: "10-12-15", system: "هرمی", rest: 120,
            videoSearch: "t-bar row neutral grip back technique"
          },
          {
            nameFa: "جلو بازو دمبل اسپایدری پرونیشن",
            nameEn: "Dumbbell Spider Curl (Pronation Grip)",
            sets: 3, reps: "12-15", system: "خطی", rest: 120,
            videoSearch: "dumbbell spider curl pronation bicep"
          },
          {
            nameFa: "جلو بازو سیمکش ایستاده",
            nameEn: "Standing Cable Bicep Curl (Myo-Reps)",
            sets: 1, reps: "20+5+5+4+3", system: "مایورپس", rest: 0,
            note: "استراحت درون ستی ۵ الی ۱۵ ثانیه یا ۳-۵ نفس عمیق",
            videoSearch: "standing cable bicep curl myo reps technique"
          },
          {
            nameFa: "شراگز اسمیت",
            nameEn: "Smith Machine Shrugs",
            sets: 3, reps: "15", system: "خطی", rest: 120,
            videoSearch: "smith machine shrugs trapezius technique"
          },
          {
            nameFa: "فلای معکوس دستگاه گیرش خنثی",
            nameEn: "Reverse Pec Deck Fly Neutral Grip",
            sets: 4, reps: "10-12", system: "خطی", rest: 120,
            videoSearch: "reverse pec deck fly neutral grip rear delt machine"
          },
          {
            nameFa: "جک نایف لبه نیمکت",
            nameEn: "Jackknife Bench Edge",
            sets: 3, reps: "15", system: "خطی", rest: 120,
            videoSearch: "jackknife crunch bench edge abs"
          },
          {
            nameFa: "کرانچ استار فیش",
            nameEn: "Starfish Crunch",
            sets: 3, reps: "20", system: "خطی", rest: 120,
            videoSearch: "starfish crunch ab exercise"
          }
        ]
      }
    ],

    corrective: [
      {
        nameFa: "پروترکشن/ریترکشن کتف",
        nameEn: "Scapular Protraction / Retraction",
        sets: 3, reps: "15", system: "خطی", rest: 60,
        videoSearch: "scapular protraction retraction corrective exercise"
      },
      {
        nameFa: "پل باسن",
        nameEn: "Glute Bridge",
        sets: 3, reps: "12", system: "خطی", rest: 60,
        note: "۵ ثانیه منقبض",
        videoSearch: "glute bridge hip thrust bodyweight hold"
      },
      {
        nameFa: "کشش پریفورمیس",
        nameEn: "Piriformis Stretch",
        sets: 3, reps: "15s", system: "خطی", rest: 60,
        videoSearch: "piriformis stretch seated figure four"
      }
    ],

    cardio: [
      {
        nameFa: "دوچرخه یا الپتیکال",
        nameEn: "Bike or Elliptical",
        sets: 1, reps: "10 دقیقه", system: "", rest: 0,
        videoSearch: "stationary bike elliptical cardio technique"
      },
      {
        nameFa: "تردمیل",
        nameEn: "Treadmill",
        sets: 1, reps: "10 دقیقه", system: "", rest: 0,
        videoSearch: "treadmill moderate pace cardio"
      }
    ]
  },

  // ── SHIVA ─────────────────────────────────────────────────────────
  shiva: {
    name: "شیوا",
    nameEn: "Shiva",
    avatar: "ش",
    avatarColor: "linear-gradient(135deg, #8040e0, #c060ff)",
    info: "۳۵ ساله · ۶۸ کیلوگرم",

    days: [
      {
        titleFa: "روز اول — پا و سرشانه",
        titleEn: "Day 1 — Legs & Shoulders",
        exercises: [
          {
            nameFa: "پرس پا دستگاه نشسته",
            nameEn: "Seated Leg Press Machine",
            sets: 4, reps: "12-15", system: "خطی", rest: 120,
            videoSearch: "seated leg press machine technique"
          },
          {
            nameFa: "کیک بک سیمکش پا صاف",
            nameEn: "Cable Kickback Straight Leg",
            sets: 3, reps: "12-15", system: "خطی", rest: 120,
            videoSearch: "cable kickback straight leg glute"
          },
          {
            nameFa: "جلو ران دستگاه",
            nameEn: "Leg Extension Machine",
            sets: 3, reps: "12-15", system: "خطی", rest: 120,
            videoSearch: "leg extension machine quad technique"
          },
          {
            nameFa: "پشت ران دستگاه نشسته",
            nameEn: "Seated Leg Curl Machine",
            sets: 3, reps: "8-12", system: "خطی", rest: 120,
            videoSearch: "seated leg curl machine hamstring"
          },
          {
            nameFa: "استپ آپ دمبل تمرکز بر باسن + هیپ تراست هالتر",
            nameEn: "Dumbbell Step-Up (Glute Focus) + Barbell Hip Thrust",
            sets: 3, reps: "12-15 + 12-15", system: "سوپرست", rest: 120,
            superset: true,
            videoSearch: "dumbbell step up glute focus barbell hip thrust"
          },
          {
            nameFa: "پرس سرشانه دستگاه گیرش خنثی",
            nameEn: "Shoulder Press Machine (Neutral Grip)",
            sets: 3, reps: "15-20", system: "خطی", rest: 120,
            videoSearch: "shoulder press machine neutral grip"
          },
          {
            nameFa: "فلای معکوس دستگاه گیرش خنثی",
            nameEn: "Reverse Pec Deck Fly (Neutral Grip)",
            sets: 3, reps: "10-12", system: "خطی", rest: 120,
            videoSearch: "reverse pec deck fly neutral grip rear delt"
          },
          {
            nameFa: "راشن توییست",
            nameEn: "Russian Twist",
            sets: 3, reps: "15-20", system: "خطی", rest: 90,
            videoSearch: "Russian twist abs core exercise technique"
          }
        ]
      },

      {
        titleFa: "روز دوم — زیربغل و بازو",
        titleEn: "Day 2 — Back & Arms",
        exercises: [
          {
            nameFa: "لت پول داون سیمکش پروانه تک دست",
            nameEn: "Single-Arm Cable Lat Pulldown (Butterfly Grip)",
            sets: 3, reps: "12-15", system: "خطی", rest: 120,
            videoSearch: "single arm lat pulldown cable butterfly"
          },
          {
            nameFa: "پرس بالا سینه دمبل",
            nameEn: "Incline Dumbbell Bench Press",
            sets: 3, reps: "10-12-15", system: "هرمی", rest: 120,
            videoSearch: "incline dumbbell bench press technique"
          },
          {
            nameFa: "زیربغل رویینگ دستگاه دست جمع سوپینیشن",
            nameEn: "Seated Cable Row Close Grip Supination",
            sets: 3, reps: "10-12", system: "خطی", rest: 120,
            videoSearch: "seated cable row close grip supination back"
          },
          {
            nameFa: "فلای سینه دستگاه",
            nameEn: "Pec Deck Fly Machine",
            sets: 3, reps: "12-15", system: "خطی", rest: 120,
            videoSearch: "pec deck fly machine chest technique"
          },
          {
            nameFa: "زیر بغل دمبل با حمایت سینه پرونیشن",
            nameEn: "Chest-Supported Dumbbell Row (Pronation)",
            sets: 3, reps: "10-12", system: "خطی", rest: 120,
            videoSearch: "chest supported dumbbell row pronation back"
          },
          {
            nameFa: "نشر جانب دمبل نشسته",
            nameEn: "Seated Dumbbell Lateral Raise",
            sets: 3, reps: "12", system: "خطی", rest: 120,
            videoSearch: "seated dumbbell lateral raise shoulder"
          },
          {
            nameFa: "جلو بازو دمبل نشسته + پشت بازو اورهد سیمکش نشسته",
            nameEn: "Seated Dumbbell Bicep Curl + Seated Overhead Cable Tricep Extension",
            sets: 3, reps: "12-15 + 12-15", system: "سوپرست", rest: 120,
            superset: true,
            videoSearch: "seated dumbbell bicep curl overhead cable tricep superset"
          },
          {
            nameFa: "پشت بازو دیپ دستگاه",
            nameEn: "Tricep Dip Machine",
            sets: 3, reps: "10-12", system: "خطی", rest: 120,
            videoSearch: "tricep dip machine technique"
          },
          {
            nameFa: "کراس کرانچ + پلانک",
            nameEn: "Cross Crunch + Plank",
            sets: 3, reps: "10-12 + max", system: "سوپرست", rest: 120,
            superset: true,
            videoSearch: "cross crunch oblique superset plank abs"
          }
        ]
      },

      {
        titleFa: "روز سوم — باسن و پا",
        titleEn: "Day 3 — Glutes & Legs",
        exercises: [
          {
            nameFa: "هیپ تراست تک پا",
            nameEn: "Single-Leg Hip Thrust",
            sets: 4, reps: "8-10", system: "خطی", rest: 120,
            videoSearch: "single leg hip thrust glute technique"
          },
          {
            nameFa: "پشت ران دستگاه خوابیده",
            nameEn: "Lying Leg Curl Machine",
            sets: 3, reps: "10-12-15", system: "هرمی", rest: 120,
            videoSearch: "lying leg curl machine hamstring technique"
          },
          {
            nameFa: "لانجز دمبل تمرکز بر چهارسر",
            nameEn: "Dumbbell Lunges (Quad Focus)",
            sets: 3, reps: "12", system: "خطی", rest: 120,
            videoSearch: "dumbbell lunges quad focused technique"
          },
          {
            nameFa: "هیپ ابداکشن سیمکش ایستاده",
            nameEn: "Standing Cable Hip Abduction",
            sets: 3, reps: "12", system: "خطی", rest: 120,
            videoSearch: "standing cable hip abduction glute"
          },
          {
            nameFa: "اسکوات سیمکش",
            nameEn: "Cable Squat",
            sets: 3, reps: "10-12", system: "خطی", rest: 120,
            videoSearch: "cable squat technique legs"
          },
          {
            nameFa: "ددلیفت رومانیایی دمبل تک پا",
            nameEn: "Single-Leg Romanian Deadlift Dumbbell",
            sets: 3, reps: "15", system: "خطی", rest: 120,
            note: "حرفه ای",
            videoSearch: "single leg romanian deadlift dumbbell technique"
          },
          {
            nameFa: "فیله میز فیله",
            nameEn: "Back Extension / Hyperextension",
            sets: 3, reps: "10", system: "خطی", rest: 120,
            videoSearch: "back extension hyperextension machine lower back"
          },
          {
            nameFa: "کرانچ سیمکش نشسته",
            nameEn: "Seated Cable Crunch",
            sets: 3, reps: "12-15", system: "خطی", rest: 120,
            videoSearch: "seated cable crunch abs technique"
          }
        ]
      }
    ],

    corrective: [
      {
        nameFa: "چرخش خارجی بازو",
        nameEn: "External Arm Rotation",
        sets: 3, reps: "15", system: "خطی", rest: 60,
        videoSearch: "external arm rotation shoulder corrective exercise"
      },
      {
        nameFa: "فیس پول با حفظ چین تاک",
        nameEn: "Face Pull with Chin Tuck",
        sets: 3, reps: "12", system: "خطی", rest: 60,
        videoSearch: "face pull chin tuck corrective posture"
      },
      {
        nameFa: "کشش سینه سه گوش دیوار",
        nameEn: "Wall Pectoral Stretch (Three-Point)",
        sets: 3, reps: "20s", system: "خطی", rest: 60,
        videoSearch: "wall chest stretch pectoral three points"
      },
      {
        nameFa: "جمع کردن اشیا با کف پا",
        nameEn: "Toe Curl / Marble Pickup",
        sets: 3, reps: "20", system: "خطی", rest: 60,
        videoSearch: "toe curl marble pickup foot intrinsic exercise"
      }
    ],

    cardio: [
      {
        nameFa: "دوچرخه یا الپتیکال",
        nameEn: "Bike or Elliptical",
        sets: 1, reps: "6 دقیقه", system: "", rest: 0,
        videoSearch: "stationary bike elliptical cardio technique"
      },
      {
        nameFa: "تردمیل",
        nameEn: "Treadmill",
        sets: 1, reps: "10 دقیقه", system: "", rest: 0,
        videoSearch: "treadmill moderate pace cardio"
      }
    ]
  }

};
