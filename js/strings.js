/*
 * Text. Arabic static text lives in index.html (it is the page's own language); `static.en` holds the
 * English for every [data-i18n] key. `demo` holds the text the animated examples draw, in both languages.
 * Every example reflects what BetterMe 1.0 actually does; app labels are copied from the app's strings.
 */
window.BM = window.BM || {};

BM.strings = {
  static: {
    en: {
      'meta.title': 'BetterMe · Everything you need for the gym, in one app',
      'meta.description': 'Workouts, nutrition, progress and an AI that knows your data, plus streaks and competing with friends. All in one app, under one subscription.',
      'nav.skip': 'Skip to content',
      'nav.lang': 'العربية',
      'nav.langLabel': 'التبديل إلى العربية',
      'nav.download': 'Download',
      'cta.badgeAlt': 'Download on the App Store',
      'hero.l1': 'Everything you need for the gym.',
      'hero.l2': 'In one app.',
      'hero.note': 'If the link doesn’t open, open it in Safari',
      'hero.scroll': 'Scroll down. Each feature plays as you go.',
      'social.follow': 'Follow us',
      'social.tiktok': 'BetterMe on TikTok',
      'social.instagram': 'BetterMe on Instagram',

      'workouts.eyebrow': 'Workouts',
      'workouts.title': 'Log your workout. Watch your strength grow.',
      'workouts.body': '450 exercises, each with a video and a guide.',

      'nutrition.eyebrow': 'Nutrition',
      'nutrition.title': 'Describe your meal. We count it.',
      'nutrition.body': 'Or pick from the Saudi product library.',

      'stores.eyebrow': 'Stores',
      'stores.title': 'Meals and programs from other users.',
      'stores.body': 'Publish your meal, or save someone’s program in a tap.',

      'progress.eyebrow': 'Progress',
      'progress.title': 'See your change for yourself.',
      'progress.body': 'Your weight on a chart, your photos in a video that stays on your phone.',

      'ai.eyebrow': 'AI coach',
      'ai.title': 'AI that knows your data.',
      'ai.body': 'Ask about your progress. It answers from your numbers.',

      'consistency.eyebrow': 'Consistency',
      'consistency.title': 'Finish your day, earn a star.',
      'consistency.body': 'Streaks and reminders. Stars level up your character.',

      'competition.eyebrow': 'Competition',
      'competition.title': 'Compete with your friends.',
      'competition.body': 'On commitment, lifts or weight change. Nobody sees your weight.',

      'gather.w1': 'Workouts.',
      'gather.w2': 'Nutrition.',
      'gather.w3': 'Stores.',
      'gather.w4': 'Progress.',
      'gather.w5': 'AI.',
      'gather.w6': 'Consistency.',
      'gather.w7': 'Competition.',
      'gather.l1': 'All of it in one app.',
      'gather.l2': 'Under one subscription.',

      'pricing.eyebrow': 'Pricing',
      'pricing.title': 'Why pay for more than one subscription?',

      'end.title': 'Ready to start?',
      'end.note': 'If the link doesn’t open, open it in Safari',
      'end.linksLabel': 'Links',
      'end.privacy': 'Privacy',
      'end.terms': 'Terms',
      'end.support': 'Support'
    }
  },

  demo: {
    ar: {
      kg: 'كجم', g: 'غ', kcal: 'سعرة',
      protein: 'بروتين', carbs: 'كارب', fat: 'دهون',

      // Workouts
      wkFig: 'فيديو وشرح لكل تمرين',
      wkPR: 'رقم قياسي',

      // Nutrition (an AI-style estimate for the described meal)
      nuMeal: 'سماش برقر منزلي بجبن شيدر',

      // Stores: one meal goes out to the store, one program comes back
      stBoxes: ['المتجر', 'عندك'],
      stCards: {
        meal: { tag: 'وجبة', title: 'شوفان بالبروتين', sub: '536 سعرة' },
        plan: { tag: 'جدول', title: 'دفع · سحب · أرجل', sub: '3 أيام بالأسبوع' }
      },
      stPublish: 'انشر وجبتك',
      stSave: 'احفظ جدول',

      // Progress
      pgWeight: 'وزنك هذا الشهر',
      pgVideo: 'صورك في فيديو',
      pgDates: ['1 أكتوبر', '8 أكتوبر', '15 أكتوبر', '22 أكتوبر', '29 أكتوبر'],
      pgPrivate: 'على جوالك فقط',

      // AI
      aiQuestion: 'هل أنا ماشي صح؟',
      aiFacts: [
        { label: 'الوزن', value: '82.1', unit: 'كجم' },
        { label: 'Bench Press', value: '62.5', unit: 'كجم' },
        { label: 'البروتين', value: '118', unit: 'غ' }
      ],
      aiAnswer: [
        { k: 0, text: 'وزنك ينزل نص كيلو بالأسبوع. ممتاز.' },
        { k: 1, text: 'قوتك زادت من 57.5 إلى 62.5 كجم.' },
        { k: 2, warn: true, text: 'زِد البروتين: 118 من هدفك 150 غ.' }
      ],

      // Consistency (streak names and level names from the app)
      cmTasks: [{ key: 'water', name: 'الماء' }, { key: 'supplements', name: 'المكملات' }, { key: 'training', name: 'النادي' }],
      cmStarGain: '+1 نجمة',
      cmLevelFrom: 'قوي',
      cmLevelTo: 'وحش',

      // Competition (group criteria from the app)
      cpCrit: [{ key: 'commitment', name: 'الالتزام' }, { key: 'lifts', name: 'الأوزان' }, { key: 'weight', name: 'تغيّر الوزن' }],
      cpUsers: { fahad: 'فهد', you: 'أنت', khalid: 'خالد' },

      // Pricing
      prRows: { calories: 'حساب السعرات', lifting: 'تسجيل الأوزان', ai: 'الذكاء الاصطناعي', water: 'متابعة الماء' },
      prPerMonth: 'ريال / شهر',
      prTotal: 'المجموع كل شهر',
      prCurrency: 'ريال',
      prOne: 'تطبيق واحد. اشتراك واحد. وذكاء اصطناعي يعرف تقدّمك.'
    },

    en: {
      kg: 'kg', g: 'g', kcal: 'kcal',
      protein: 'Protein', carbs: 'Carbs', fat: 'Fat',

      wkFig: 'A video and a guide for every exercise',
      wkPR: 'New best',

      nuMeal: 'Homemade smash burger with cheddar',

      stBoxes: ['Store', 'Yours'],
      stCards: {
        meal: { tag: 'Meal', title: 'Protein oats', sub: '536 kcal' },
        plan: { tag: 'Program', title: 'Push · Pull · Legs', sub: '3 days a week' }
      },
      stPublish: 'Publish your meal',
      stSave: 'Save a program',

      pgWeight: 'Your weight this month',
      pgVideo: 'Your photos as a video',
      pgDates: ['Oct 1', 'Oct 8', 'Oct 15', 'Oct 22', 'Oct 29'],
      pgPrivate: 'On your phone only',

      aiQuestion: 'Am I on track?',
      aiFacts: [
        { label: 'Weight', value: '82.1', unit: 'kg' },
        { label: 'Bench Press', value: '62.5', unit: 'kg' },
        { label: 'Protein', value: '118', unit: 'g' }
      ],
      aiAnswer: [
        { k: 0, text: 'You’re losing half a kilo a week. Good pace.' },
        { k: 1, text: 'Your strength is up from 57.5 to 62.5 kg.' },
        { k: 2, warn: true, text: 'Eat more protein: 118 of your 150 g.' }
      ],

      cmTasks: [{ key: 'water', name: 'Water' }, { key: 'supplements', name: 'Supplements' }, { key: 'training', name: 'Gym' }],
      cmStarGain: '+1 star',
      cmLevelFrom: 'Strong',
      cmLevelTo: 'Beast',

      cpCrit: [{ key: 'commitment', name: 'Commitment' }, { key: 'lifts', name: 'Lifts' }, { key: 'weight', name: 'Weight change' }],
      cpUsers: { fahad: 'Fahad', you: 'You', khalid: 'Khalid' },

      prRows: { calories: 'Calorie counting', lifting: 'Workout logging', ai: 'AI questions', water: 'Water tracking' },
      prPerMonth: 'SAR / month',
      prTotal: 'Total, every month',
      prCurrency: 'SAR',
      prOne: 'One app. One subscription. And an AI that knows your progress.'
    }
  }
};
