/*
 * Text. Arabic lives in index.html (it is the page's own language); `static.en` holds the English for every
 * [data-i18n] key, `ui` the labels the script writes itself, and `rows` the pricing categories in both languages.
 * Every claim matches the app on main (1.0.3).
 */
window.BM = window.BM || {};

BM.strings = {
  static: {
    en: {
      'meta.title': 'BetterMe · Everything you need for the gym, in one app',
      'meta.description': 'Workouts on video, AI nutrition, progress you can see and a coach that knows your numbers. All in one app, under one subscription.',
      'nav.skip': 'Skip to content',
      'nav.lang': 'العربية',
      'nav.langLabel': 'التبديل إلى العربية',
      'cta.badgeAlt': 'Download on the App Store',
      'cta.note': 'If the link doesn’t open, open it in Safari',
      'social.tiktok': 'BetterMe on TikTok',
      'social.instagram': 'BetterMe on Instagram',

      'hero.l1': 'Everything you need for the gym,',
      'hero.l2': 'in one app.',
      'hero.alt': 'The BetterMe home screen on a phone',

      'hl.title': 'Get the highlights.',
      'hl.dots': 'Highlights',
      'hl.1a': 'Snap your meal,',
      'hl.1b': 'and the calories count themselves.',
      'hl.2a': 'Every exercise on video,',
      'hl.2b': 'and your rest counted for you.',
      'hl.3a': 'An AI coach',
      'hl.3b': 'that answers from your numbers.',
      'hl.4a': 'Watch your body',
      'hl.4b': 'change.',
      'hl.5a': 'Race your friends',
      'hl.5b': 'to the top.',

      'food.t1': 'Log your food',
      'food.t2': 'the way that suits you.',
      'food.i1': 'Snap it',
      'food.i2': 'Describe it',
      'food.i3': 'Barcode',
      'food.i4': 'Saudi products',
      'food.i5': 'The store',
      'food.alt': 'Clip: a meal photo and its calorie estimate',
      'nutrition.alt': 'The Nutrition tab in BetterMe',

      'train.t1': 'Know when to add weight,',
      'train.t2': 'and when to back off.',
      'train.planA': 'Your plan, ready.',
      'train.planB': 'Built by AI, or brought over from your old app.',
      'train.clips': 'exercises, all on video.',
      'train.rest': 'Rest counts down on your Lock Screen.',
      'train.i1': 'Reps and sets',
      'train.i2': 'Import your plan',
      'train.i3': 'AI-built plan',
      'train.i4': 'Community plans',
      'train.i5': 'A video for every exercise',
      'train.i6': 'Exercise swaps',
      'train.alt': 'Clip: a live workout with the exercise video and the rest timer',
      'workout.alt': 'The Workout tab in BetterMe',

      'coach.t1': 'Ask it anything.',
      'coach.t2': 'It answers from your numbers.',
      'coach.b1': 'An AI coach that knows',
      'coach.b2': 'your goal, your plan and your lifts,',
      'coach.b3': 'and answers from them.',
      'coach.alt': 'The AI coach answering for your goal',

      'journey.t1': 'See your progress',
      'journey.t2': 'with your own eyes.',
      'journey.day': 'Day',
      'journey.of': 'of 113',
      'journey.i1': 'Your weight, daily',
      'journey.i2': 'A photo, weekly',
      'journey.i3': 'InBody, monthly',
      'progress.alt': 'The Progress tab in BetterMe',

      'levels.t1': 'Show up every day.',
      'levels.t2': 'Collect your streaks.',
      'levels.s1': 'Calories',
      'levels.s2': 'Training',
      'levels.s3': 'Water',
      'levels.s4': 'Steps',
      'levels.s5': 'Supplements',
      'levels.m1': 'More streaks, more stars,',
      'levels.m2': 'a higher level.',
      'levels.l1': 'Beginner',
      'levels.l2': 'Strong',
      'levels.l3': 'Beast',
      'levels.l4': 'Iron Eater',
      'levels.w1': 'From day one',
      'levels.after': 'After',
      'levels.days7': 'days at',
      'levels.days': 'days at',

      'compete.t1': 'Compete with your friends.',
      'compete.t2': 'On consistency and lifts.',
      'compete.i1': 'Lifts',
      'compete.i2': 'Consistency',
      'compete.i3': 'Progress rate',
      'compete.i4': 'Prizes for the most consistent',
      'compete.fine': 'And nobody sees your weight.',
      'compete.alt': 'A friends group ranking',

      'all.t1': 'And everything you track,',
      'all.t2': 'in one place.',
      'problem.c1': 'Your food',
      'problem.c2': 'Calories',
      'problem.c3': 'Protein',
      'problem.c4': 'Workouts',
      'problem.c5': 'Reps',
      'problem.c6': 'Sets',
      'problem.c7': 'Good form',
      'problem.c8': 'Creatine',
      'problem.c9': 'Steps',
      'problem.c10': 'Water',
      'problem.c11': 'Body photos',
      'problem.c12': 'InBody',
      'problem.c13': 'Daily weight',
      'problem.c14': 'A coach',
      'problem.c15': 'An easy start',
      'problem.c16': 'Competition',

      'price.t1': 'Instead of four subscriptions,',
      'price.t2': 'just one.',
      'price.others': 'Four apps',
      'price.total': 'Total, every month',
      'price.currency': 'SAR',
      'price.per': 'SAR / month',
      'price.trialA': 'Try it free for',
      'price.trialB': 'days.',

      'end.l1': 'All of this and more,',
      'end.l2': 'in one app.',
      'end.linksLabel': 'Links',
      'end.privacy': 'Privacy',
      'end.terms': 'Terms',
      'end.support': 'Support'
    }
  },

  ui: {
    ar: { dot: 'المزية', pause: 'إيقاف مؤقت', play: 'تشغيل' },
    en: { dot: 'Highlight', pause: 'Pause', play: 'Play' }
  },

  // Pricing categories (no app names on the page; see README.md).
  rows: {
    ar: { calories: 'حساب السعرات', lifting: 'تسجيل الأوزان', ai: 'الذكاء الاصطناعي', water: 'متابعة الماء' },
    en: { calories: 'Calorie counting', lifting: 'Workout logging', ai: 'AI questions', water: 'Water tracking' }
  }
};
