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

      'workouts.eyebrow': 'Workouts',
      'workouts.title': 'Your exercises, your plan, your strength.',
      'workouts.body': 'A library of 450 exercises covering every muscle group. Build your weekly plan from it and log your sets, reps and weights. Every exercise comes with a video and a guide to proper technique.',

      'nutrition.eyebrow': 'Nutrition',
      'nutrition.title': 'Calories, without the hassle.',
      'nutrition.body': 'Log meals the way that suits you: describe the meal to the AI, or add products and amounts yourself from our Saudi product library. Then keep an eye on your calories, protein, carbs and fat.',

      'stores.eyebrow': 'Stores · By users, for users',
      'stores.title': 'A plan or a recipe? It’s already here.',
      'stores.body': 'Publish your meals with their ingredients, amounts and macros, or save other people’s meals in one tap. Same with workout plans: browse the community’s programs, pick one that suits you and start training.',

      'progress.eyebrow': 'Progress',
      'progress.title': 'Your change is worth seeing.',
      'progress.body': 'Log your weight every day and watch it move on the chart. Photograph your body from the same angle, daily or weekly, and the app turns your photos into a video of your progress. Your photos stay on your phone and are never uploaded.',

      'ai.eyebrow': 'AI coach',
      'ai.title1': 'AI that knows your data.',
      'ai.title2': 'Not generic advice.',
      'ai.body': 'Every day you log your workouts, meals and weight, you build up data the AI can use to answer your questions. Ask whether your progress fits your goal or whether your plan needs a change, and it answers from what you’ve actually logged, not lines everyone hears.',

      'consistency.eyebrow': 'Consistency',
      'consistency.title': 'We help you keep at it, every day.',
      'consistency.body': 'Streaks for the gym, nutrition, supplements, water and steps, plus reminders for your gym time, meals, supplements and weigh-ins. Every day you complete your streaks earns a star, and stars raise your level and evolve your Greek character.',

      'competition.eyebrow': 'Competition · You’re not alone',
      'competition.title': 'Compete with your friends. Get better together.',
      'competition.body': 'Add your friends and compete on consistency and stars, on the weights you lift, or on body-weight change, with a clear ranking inside each group. Lifts count relative to body weight, and nobody sees your weight.',

      'gather.w1': 'Workouts.',
      'gather.w2': 'Nutrition.',
      'gather.w3': 'Progress.',
      'gather.w4': 'AI.',
      'gather.w5': 'Consistency.',
      'gather.w6': 'Competition.',
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

      // Workouts (column labels from the app's session screen)
      wkMeta: 'صدر · بار',
      wkCols: ['#', 'السابق', 'كجم', 'تكرار'],
      wkBest: 'أفضل مجموعة',
      wkPR: 'رقم قياسي جديد!',
      wkDelta: '+2.5 كجم عن آخر تمرين',
      wkHint: 'عمود «السابق» يوريك أرقام آخر تمرين، عشان تعرف وش تتخطى.',
      wkFig: 'فيديو وشرح لكل تمرين',
      wkCue: 'أنزل البار لمنتصف صدرك بمرفقين 45 درجة وادفعه بقوة',

      // Nutrition (labels from the app's "describe a meal" and product review screens)
      nuDescribe: 'وصف وجبتك',
      nuMeal: 'سماش برقر منزلي، قطعتين لحم وجبن شيدر بخبز بريوش',
      nuEstimate: 'قدّر',
      nuThinking: 'يقدّر…',
      nuResult: 'السعرات التقديرية',
      nuMost: 'الأقرب',
      nuRange: 'بين 700 و1000',
      nuLibrary: 'مكتبة المنتجات السعودية',
      nuProduct: 'شوفان',
      nuUnits: ['غرام', 'حصة', 'عبوة'],
      nuToday: 'اليوم',
      nuOf: 'من',

      // Stores (button labels from the app's stores)
      stTabs: ['وجبة', 'جدول'],
      stMealName: 'شوفان بالبروتين',
      stMealBy: 'وجبتك · بمكوناتها ومقاديرها',
      stIngredients: [['شوفان', '60 غ'], ['حليب قليل الدسم', '200 مل'], ['بروتين واي', '30 غ'], ['موز', '100 غ']],
      stPublish: 'انشر',
      stPublished: 'متاحة للمجتمع',
      stOther: '@reem',
      stSave: 'احفظها في وجباتي',
      stSaved: 'أُضيفت إلى وجباتي',
      stPlanName: 'دفع · سحب · أرجل',
      stPlanBy: ['من', '@majed', '3 أيام في الأسبوع'],
      stDays: [['الأحد', 'دفع', 'صدر، أكتاف، ترايسبس'], ['الثلاثاء', 'سحب', 'ظهر، بايسبس'], ['الخميس', 'أرجل', 'أمامي، خلفي، سمانة']],
      stAdd: 'أضف هذا الجدول',
      stAdded: 'صار في جداولك',

      // Progress (labels from the app's progress and photo screens)
      pgWeight: 'الوزن · أكتوبر',
      pgAvg: 'متوسط 7 أيام',
      pgMonth: 'هذا الشهر',
      pgDates: ['1 أكتوبر', '8 أكتوبر', '15 أكتوبر', '22 أكتوبر', '29 أكتوبر'],
      pgAxis: ['1', '8', '15', '22', '29'],
      pgGhost: 'الظل: صورتك السابقة، عشان نفس الزاوية',
      pgVideo: 'شهرك بالصور',
      pgPrivate: 'على جوالك فقط',

      // AI
      aiFacts: [
        { label: 'متوسط الوزن · 7 أيام', value: '82.1', unit: 'كجم', sub: 'ينزل 0.5 كجم بالأسبوع' },
        { label: 'Bench Press · أفضل مجموعة', value: '62.5', unit: 'كجم × 8', sub: 'كانت 57.5 قبل 4 أسابيع' },
        { label: 'البروتين · متوسط 14 يوم', value: '118', unit: '/ 150 غ', sub: 'أقل من هدفك' }
      ],
      aiReads: 'يقرأ بياناتك',
      aiQuestion: 'هل أنا ماشي صح؟',
      aiLead: 'تقدّمك ممتاز، مع نقطة وحدة تحتاج انتباه:',
      aiAnswer: [
        { k: 0, text: 'وزنك ينزل بمعدل نص كيلو بالأسبوع، وهذا معدل مناسب لهدف التنشيف.' },
        { k: 1, text: 'أوزانك في Bench Press زادت من 57.5 إلى 62.5 كجم، يعني قوتك محفوظة.' },
        { k: 2, text: 'البروتين: متوسطك 118 غ من هدف 150 غ. لو قرّبته من هدفك، يساعدك تحافظ على عضلك وأنت تنزل.' }
      ],

      // Consistency (streak names, star rule and level names from the app)
      cmToday: 'اليوم',
      cmTasks: [
        { key: 'water', name: 'الماء', sub: '8 من 8 أكواب', from: 12 },
        { key: 'supplements', name: 'المكملات', sub: 'كرياتين 5 غ', from: 20 },
        { key: 'training', name: 'النادي', sub: 'يوم الدفع', from: 6 }
      ],
      cmStreak: 'ستريك',
      cmStar: 'كمّلت ستريكاتك اليوم',
      cmStarGain: '+1 نجمة',
      cmLevelFrom: 'قوي',
      cmLevelTo: 'وحش',
      cmLevel: 'المستوى',
      cmStars: 'نجمة',
      cmNext: '30 نجمة = مستوى «وحش» · التالي «آكل حديد» عند 90',

      // Competition (group criteria from the app)
      cpGroup: 'مجموعة النادي',
      cpBy: 'ترتيب الأعضاء حسب',
      cpCrit: [
        { key: 'commitment', name: 'الالتزام', note: 'النجوم في آخر 30 يوم' },
        { key: 'lifts', name: 'الأوزان', note: 'أفضل رفعاتك نسبةً لوزن جسمك' },
        { key: 'weight', name: 'تغيّر الوزن', note: 'التقدّم نحو هدف كل عضو' }
      ],
      cpUsers: { fahad: 'فهد', you: 'أنت', khalid: 'خالد' },

      // Pricing
      prRows: {
        calories: { cat: 'حساب السعرات', quip: 'عشان تعرف كم سعرة في السماش برقر' },
        lifting: { cat: 'تسجيل أوزان التمارين', quip: 'عشان تتذكر وش رفعت المرة اللي فاتت' },
        ai: { cat: 'أسئلة للذكاء الاصطناعي', quip: 'عشان تسأله «هل أنا ماشي صح؟» وتشرح له كل شيء من البداية' },
        water: { cat: 'متابعة شرب الماء', quip: 'عشان تعدّ أكوابك' }
      },
      prPerMonth: 'ريال / شهر',
      prTotal: 'المجموع كل شهر',
      prCurrency: 'ريال',
      prOne: 'واجهة واحدة. اشتراك واحد. وذكاء اصطناعي يعرف تقدّمك.'
    },

    en: {
      kg: 'kg', g: 'g', kcal: 'kcal',
      protein: 'Protein', carbs: 'Carbs', fat: 'Fat',

      wkMeta: 'Chest · Barbell',
      wkCols: ['Set', 'Previous', 'kg', 'Reps'],
      wkBest: 'Best set',
      wkPR: 'New personal best!',
      wkDelta: '+2.5 kg on last workout',
      wkHint: 'The Previous column shows last workout’s numbers, so you know what to beat.',
      wkFig: 'A video and a guide for every exercise',
      wkCue: 'Lower to mid-chest, elbows at 45, press up hard',

      nuDescribe: 'Describe a meal',
      nuMeal: 'Homemade smash burger, two beef patties and cheddar in a brioche bun',
      nuEstimate: 'Estimate',
      nuThinking: 'Estimating…',
      nuResult: 'Estimated calories',
      nuMost: 'Most likely',
      nuRange: '700–1,000 range',
      nuLibrary: 'Saudi product library',
      nuProduct: 'Rolled oats',
      nuUnits: ['grams', 'serving', 'pack'],
      nuToday: 'Today',
      nuOf: 'of',

      stTabs: ['Meal', 'Program'],
      stMealName: 'Protein oats',
      stMealBy: 'Your meal · with ingredients and amounts',
      stIngredients: [['Rolled oats', '60 g'], ['Low-fat milk', '200 ml'], ['Whey protein', '30 g'], ['Banana', '100 g']],
      stPublish: 'Publish',
      stPublished: 'Live in the store',
      stOther: '@reem',
      stSave: 'Save to My meals',
      stSaved: 'Added to My meals',
      stPlanName: 'Push · Pull · Legs',
      stPlanBy: ['by', '@majed', '3 days a week'],
      stDays: [['Sun', 'Push', 'chest, shoulders, triceps'], ['Tue', 'Pull', 'back, biceps'], ['Thu', 'Legs', 'quads, hamstrings, calves']],
      stAdd: 'Add this program',
      stAdded: 'In your programs',

      pgWeight: 'Weight · October',
      pgAvg: '7-day average',
      pgMonth: 'this month',
      pgDates: ['Oct 1', 'Oct 8', 'Oct 15', 'Oct 22', 'Oct 29'],
      pgAxis: ['1', '8', '15', '22', '29'],
      pgGhost: 'Ghost: your last photo, for the same angle',
      pgVideo: 'Your month in photos',
      pgPrivate: 'On your phone only',

      aiFacts: [
        { label: 'Weight · 7-day average', value: '82.1', unit: 'kg', sub: 'down 0.5 kg a week' },
        { label: 'Bench Press · best set', value: '62.5', unit: 'kg × 8', sub: '57.5 kg four weeks ago' },
        { label: 'Protein · 14-day average', value: '118', unit: '/ 150 g', sub: 'below your target' }
      ],
      aiReads: 'Reading your data',
      aiQuestion: 'Am I on track?',
      aiLead: 'You’re on track, with one thing to watch:',
      aiAnswer: [
        { k: 0, text: 'Your weight is dropping about half a kilo a week, a sensible pace for a cut.' },
        { k: 1, text: 'Your Bench Press went from 57.5 to 62.5 kg, so you’re keeping your strength.' },
        { k: 2, text: 'Protein: you’re averaging 118 g against a 150 g target. Closing that gap helps you keep muscle while you lose weight.' }
      ],

      cmToday: 'Today',
      cmTasks: [
        { key: 'water', name: 'Water', sub: '8 of 8 glasses', from: 12 },
        { key: 'supplements', name: 'Supplements', sub: 'Creatine 5 g', from: 20 },
        { key: 'training', name: 'Gym', sub: 'Push day', from: 6 }
      ],
      cmStreak: 'streak',
      cmStar: 'All of today’s streaks done',
      cmStarGain: '+1 star',
      cmLevelFrom: 'Strong',
      cmLevelTo: 'Beast',
      cmLevel: 'Level',
      cmStars: 'stars',
      cmNext: '30 stars = Beast · next, Iron Eater at 90',

      cpGroup: 'Gym crew',
      cpBy: 'Rank members by',
      cpCrit: [
        { key: 'commitment', name: 'Commitment', note: 'stars in the last 30 days' },
        { key: 'lifts', name: 'Lifts', note: 'your best lifts relative to body weight' },
        { key: 'weight', name: 'Weight change', note: 'progress toward each member’s goal' }
      ],
      cpUsers: { fahad: 'Fahad', you: 'You', khalid: 'Khalid' },

      prRows: {
        calories: { cat: 'Calorie counting', quip: 'to work out what’s in the smash burger' },
        lifting: { cat: 'Workout logging', quip: 'to remember what you lifted last time' },
        ai: { cat: 'Asking an AI', quip: 'to ask “am I on track?” and explain everything from scratch' },
        water: { cat: 'Water tracking', quip: 'to count your glasses' }
      },
      prPerMonth: 'SAR / month',
      prTotal: 'Total, every month',
      prCurrency: 'SAR',
      prOne: 'One app. One subscription. And an AI that knows your progress.'
    }
  }
};
