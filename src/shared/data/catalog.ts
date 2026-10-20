/* Fixed lists the survey uses. The backend sends the brand list too (GET /config); this copy is the
   fallback while it loads, or if it cannot be reached. Codes match the backend's migration. */

import type { JoinInterest, MonthlyPurchase, PurchaseMethod, RewardInterest, StoreType } from '@/shared/api/types'

/* the client's brand list, in the client's order, without the category headings */
export const FALLBACK_BRANDS: { code: string; name: string }[] = [
  ['NKYD', 'NKYD'], ['ENAMOR', 'Enamor'], ['JOCKEY', 'Jockey'], ['AMANTE', 'Amante'], ['SONARI', 'Sonari'],
  ['JULIET', 'Juliet'], ['PARIS_BEAUTY', 'Paris Beauty'], ['FLORET', 'Floret'], ['KALYANI', 'Kalyani'], ['LIBRA', 'Libra'],
  ['RIZA', 'Riza'], ['CALIBRA', 'Calibra'], ['HEMALI', 'Hemali'], ['LITTLE_LACY', 'Little Lacy'], ['LADY_CARE', 'Ladycare'],
  ['RED_ROSE', 'Red Rose'], ['BODYCARE', 'Bodycare'], ['INCARE', 'InCare'], ['LAVOS', 'Lavos'], ['ESSA', 'ESSA'],
  ['RANJIT', 'Ranjit'], ['HINT', 'Hint'], ['VIP', 'VIP'], ['DOLLAR', 'Dollar'], ['JAMES_AND_HARPER', 'James & Harper'],
  ['V_STAR', 'V-Star'], ['SUKANYA', 'Sukanya'], ['L_AND_M', 'L&M'], ['LANGO', 'Lango'], ['LADY_BEAUTY', 'Lady Beauty'],
  ['ARCHOO', 'Archoo'], ['SMARTY_PANTY', 'Smarty Panty'], ['COMFORT', 'Comfort'], ['JINAL', 'Jinal'], ['LOBSTER', 'Lobster'],
  ['DERMAWEAR', 'Dermawear'], ['LYCOT', 'Lycot'], ['OCEANIC', 'Oceanic'], ['LACTRA', 'Lactra'],
].map(([code, name]) => ({ code, name }))

export const OTHER_BRAND = 'OTHER'

/* each brand's text colour on its tile, so the tiles are easy to tell apart; any new brand cycles these */
const BRAND_COLOURS = ['#BE185D', '#7A2E8E', '#B4232A', '#C2410C', '#1D3A8A', '#0F766E', '#475569', '#0F5132', '#A21CAF', '#1E40AF', '#92400E', '#1F2937', '#DB2777']
export const brandColour = (index: number) => BRAND_COLOURS[index % BRAND_COLOURS.length]

/* answer order matches the words in each language (storeTypes, purchase, methods, reward, join) */
export const STORE_TYPES: StoreType[] = ['INNERWEAR_SPECIALIST', 'MULTI_BRAND_GARMENT', 'DEPARTMENT_STORE', 'SPORTSWEAR_ACTIVEWEAR', 'WHOLESALE_RETAIL', 'OTHER']
export const MONTHLY_PURCHASE: MonthlyPurchase[] = ['UNDER_50K', 'FROM_50K_TO_2L', 'FROM_2L_TO_5L', 'OVER_5L', 'PREFER_NOT_TO_SAY']
export const PURCHASE_METHODS: PurchaseMethod[] = ['DIRECT_FROM_BRANDS', 'DISTRIBUTORS', 'WHOLESALERS', 'COMPANY_SALES_REPS', 'ONLINE_B2B']
export const REWARD_INTEREST: RewardInterest[] = ['YES', 'MAYBE', 'NO']
export const JOIN_INTEREST: JoinInterest[] = ['YES', 'CONTACT_ME', 'NOT_NOW']

/* the backend stores these exact names */
const ALL_STATES = [
  'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh', 'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir',
  'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
  'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
] as const
export type StateName = (typeof ALL_STATES)[number]
export const STATES: readonly StateName[] = ALL_STATES
export const STATE_NAMES = ALL_STATES
/* the launch states, shown first and large in the state picker */
export const STATES_FIRST: StateName[] = ['Maharashtra', 'Gujarat']

export const CONSENT_VERSION = import.meta.env.VITE_CONSENT_VERSION || '2026-10-ea-2'
