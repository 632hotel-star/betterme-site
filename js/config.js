/*
 * BetterMe site config: the one place to update links, prices and the comparison.
 * Every value here was checked on 2026-11-01. Re-check the comparison prices before each publish.
 */
window.BM = window.BM || {};

BM.config = {
  // App Store listing of BetterMe - All in One (app id 6825474864, live in SA + US since 2026-10-30).
  // The id-only URL opens the visitor's own storefront.
  appStoreUrl: 'https://apps.apple.com/app/id6825474864',

  // Apple's official "Download on the App Store" badge, served by Apple Marketing Tools.
  // If Arabic fails to load, the page falls back to the English badge.
  badge: {
    ar: 'https://toolbox.marketingtools.apple.com/api/badges/download-on-the-app-store/black/ar-sa?size=250x83',
    en: 'https://toolbox.marketingtools.apple.com/api/badges/download-on-the-app-store/black/en-us?size=250x83'
  },

  // BetterMe's own accounts (checked 2026-11-03).
  social: {
    tiktok: 'https://www.tiktok.com/@betterme.ai1',
    instagram: 'https://www.instagram.com/betterme.ai1/'
  },

  // Public legal pages (same text as in the app). Source: docs/APP_STORE_SUBMISSION.md §1.
  legal: {
    privacy: {
      ar: 'https://zlmxdgavlbvsznsueemi.supabase.co/storage/v1/object/public/legal/ar/privacy.txt',
      en: 'https://zlmxdgavlbvsznsueemi.supabase.co/storage/v1/object/public/legal/en/privacy.txt'
    },
    terms: {
      ar: 'https://zlmxdgavlbvsznsueemi.supabase.co/storage/v1/object/public/legal/ar/terms.txt',
      en: 'https://zlmxdgavlbvsznsueemi.supabase.co/storage/v1/object/public/legal/en/terms.txt'
    },
    support: {
      ar: 'https://zlmxdgavlbvsznsueemi.supabase.co/storage/v1/object/public/legal/ar/support.txt',
      en: 'https://zlmxdgavlbvsznsueemi.supabase.co/storage/v1/object/public/legal/en/support.txt'
    }
  },

  // BetterMe's own price (Saudi App Store): monthly 7.99 SAR since 2026-11-04 (owner), plus the app's own 3-day
  // trial per account (no Apple introductory offer). The page shows the monthly price only; yearly is not re-checked.
  price: { monthly: 7.99, yearly: 75.99, trialDays: 3 },

  // "Why pay for more than one subscription?" Service categories with a blurred icon of the reference app
  // (assets/cmp-<key>.webp, blur baked in), no app names. Monthly prices, Saudi App Store, `checkedOn` (README.md).
  comparison: {
    checkedOn: '2026-11-01',
    rows: [
      { key: 'calories', monthly: 77.99 },
      { key: 'lifting', monthly: 18.99 },
      { key: 'ai', monthly: 89.99 },
      { key: 'water', monthly: 4.99 }
    ]
  }
};
