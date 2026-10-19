/* Fixed lists the journey uses. The backend sends the brand list too (GET /config); this copy is the
   fallback while it loads, or if it cannot be reached. */

import type { MainTrouble, MonthlyPurchase, PreferredReward } from '@/shared/api/types'

export const FALLBACK_BRANDS = [
  'Lady Care', 'Sonari', 'Juliet', 'Sukanya', 'Libra', 'Zola', 'Groverson',
  'Bodycare', 'Floret', 'Bonjour', 'Ramraj', 'V Star', 'Blossom',
].map((name) => ({ code: name.toUpperCase().replace(/\s+/g, '_'), name }))

export const OTHER_BRAND = 'OTHER'

/* each brand's text colour on its tile, so the tiles are easy to tell apart; any new brand cycles these */
const BRAND_COLOURS = ['#BE185D', '#7A2E8E', '#B4232A', '#C2410C', '#1D3A8A', '#0F766E', '#475569', '#0F5132', '#A21CAF', '#1E40AF', '#92400E', '#1F2937', '#DB2777']
export const brandColour = (index: number) => BRAND_COLOURS[index % BRAND_COLOURS.length]

/* answer order matches the words in each language (volumeRanges, rewards, troubles) */
export const MONTHLY_PURCHASE: MonthlyPurchase[] = ['UNDER_50K', 'FROM_50K_TO_2L', 'FROM_2L_TO_5L', 'OVER_5L']
export const PREFERRED_REWARD: PreferredReward[] = ['CASH', 'GOLD', 'TRIP', 'PHONE_TV']
export const MAIN_TROUBLE: MainTrouble[] = ['LATE_PAYMENT', 'HARD_TO_UNDERSTAND', 'TOO_LITTLE', 'NO_SCHEME']

/* card 5: "a shop like yours could earn up to …". A typical month in each range, times twelve, at an
   example rate the client confirms. Shown as an example only. */
export const TYPICAL_MONTH: Record<MonthlyPurchase, number> = { UNDER_50K: 30_000, FROM_50K_TO_2L: 125_000, FROM_2L_TO_5L: 350_000, OVER_5L: 600_000 }
export const EXAMPLE_RATE = 0.02

export const STATES = [
  'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh', 'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir',
  'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
  'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
] as const

export const CONSENT_VERSION = import.meta.env.VITE_CONSENT_VERSION || '2026-10-ea-1'
