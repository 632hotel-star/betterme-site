/*
 * Text. Arabic lives in index.html (it is the page's own language); `static.en` holds the English for every
 * [data-i18n] key, and `rows` the pricing categories in both languages. Every claim matches the app on main (1.0.3).
 */
window.BM = window.BM || {};

BM.strings = {
  static: {
    en: {
      'meta.title': 'BetterMe · Everything you need for the gym, in one app',
      'meta.description': 'Workouts on video, AI nutrition, progress and a coach that knows your numbers. All in one app, under one subscription.',
      'nav.skip': 'Skip to content',
      'nav.lang': 'العربية',
      'nav.langLabel': 'التبديل إلى العربية',
      'nav.download': 'Download the app',
      'nav.downloadShort': 'Download',
      'cta.badgeAlt': 'Download on the App Store',
      'social.tiktok': 'BetterMe on TikTok',
      'social.instagram': 'BetterMe on Instagram',

      'hero.l1': 'Everything you need for the gym.',
      'hero.l2': 'In one app.',
      'hero.sub': 'Workouts on video, AI nutrition, and a coach that knows your numbers.',
      'hero.note': 'If the link doesn’t open, open it in Safari',
      'hero.scroll': 'Scroll to see the app',

      'tour.title1': 'Five tabs.',
      'tour.title2': 'Everything in its place.',
      'tour.home.tab': 'Home',
      'tour.home.t': 'Your whole day on one screen.',
      'tour.home.d': 'Stars, streaks and today’s workout, the moment you open it.',
      'tour.home.alt': 'The Home tab in BetterMe',
      'tour.workout.tab': 'Workout',
      'tour.workout.t': 'Your plan is ready. Every exercise on video.',
      'tour.workout.d': 'Know what to train today, and how to do it right.',
      'tour.workout.alt': 'The Workout tab in BetterMe',
      'tour.nutrition.tab': 'Nutrition',
      'tour.nutrition.t': 'Snap your food. The calories count themselves.',
      'tour.nutrition.d': 'Or describe it in a few words, or scan the barcode.',
      'tour.nutrition.alt': 'The Nutrition tab in BetterMe',
      'tour.progress.tab': 'Progress',
      'tour.progress.t': 'Watch your body change.',
      'tour.progress.d': 'Weight, photos, your plan and InBody reports, all in front of you.',
      'tour.progress.alt': 'The Progress tab in BetterMe',
      'tour.friends.tab': 'Friends',
      'tour.friends.t': 'Race your friends to the top.',
      'tour.friends.d': 'On commitment and lifts. Nobody sees your weight.',
      'tour.friends.alt': 'A friends group in BetterMe',

      'new.title': 'New in BetterMe',
      'new.photo.t': 'Snap your plate. We’ll do the math.',
      'new.photo.d': 'AI reads the calories, protein, carbs and fat from a single photo.',
      'new.photo.alt': 'Clip: a meal photo and its calorie estimate',
      'new.coach.t': 'AI that answers from your own data.',
      'new.coach.d': 'It knows your workouts, meals and weight, and gives you your next step.',
      'new.coach.alt': 'The AI coach answering from your data',
      'new.clips.t': 'exercises, all on video.',
      'new.clips.d': 'See the right form before you lift.',
      'new.inbody.t': 'Snap your InBody. Know if you’re on track.',
      'new.inbody.d': 'And see the change from scan to scan.',
      'new.live.t': 'Train with the clip in front of you.',
      'new.live.d': 'A rest timer, a 3-minute warm-up, and every set saved.',
      'new.live.alt': 'Clip: a live workout with the exercise video and the rest timer',
      'new.lock.t': 'Rest counts down on your Lock Screen.',
      'new.lock.d': 'And widgets show your day without opening the app.',

      'levels.title': 'Finish your day, earn a star.',
      'levels.body': 'Collect stars, and your character ranks up with you.',
      'levels.l1': 'Beginner',
      'levels.l2': 'Strong',
      'levels.l3': 'Beast',
      'levels.l4': 'Iron Eater',

      'price.title': 'One subscription instead of four.',
      'price.per': 'SAR / month',
      'price.trialA': 'Try it free for',
      'price.trialB': 'days.',
      'price.others': 'If you paid for each one separately',
      'price.total': 'Total, every month',
      'price.currency': 'SAR',

      'end.title': 'Ready to start?',
      'end.note': 'If the link doesn’t open, open it in Safari',
      'end.linksLabel': 'Links',
      'end.privacy': 'Privacy',
      'end.terms': 'Terms',
      'end.support': 'Support'
    }
  },

  // Pricing categories (no app names on the page; see README.md).
  rows: {
    ar: { calories: 'حساب السعرات', lifting: 'تسجيل الأوزان', ai: 'الذكاء الاصطناعي', water: 'متابعة الماء' },
    en: { calories: 'Calorie counting', lifting: 'Workout logging', ai: 'AI questions', water: 'Water tracking' }
  }
};
