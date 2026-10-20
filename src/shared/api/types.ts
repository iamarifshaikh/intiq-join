/* The early-access API, survey v2 (docs/backend-v2-prompt.md). Field names are camelCase as in the rest
   of the backend; check them against the backend agent's updated docs/early-access/02-api.md.
     GET  /api/v1/public/early-access/config
     POST /api/v1/public/early-access/responses
     POST /api/v1/public/early-access/events */

export type StoreType = 'INNERWEAR_SPECIALIST' | 'MULTI_BRAND_GARMENT' | 'DEPARTMENT_STORE' | 'SPORTSWEAR_ACTIVEWEAR' | 'WHOLESALE_RETAIL' | 'OTHER'
export type MonthlyPurchase = 'UNDER_50K' | 'FROM_50K_TO_2L' | 'FROM_2L_TO_5L' | 'OVER_5L' | 'PREFER_NOT_TO_SAY'
export type PurchaseMethod = 'DIRECT_FROM_BRANDS' | 'DISTRIBUTORS' | 'WHOLESALERS' | 'COMPANY_SALES_REPS' | 'ONLINE_B2B'
export type RewardInterest = 'YES' | 'MAYBE' | 'NO'
export type JoinInterest = 'YES' | 'CONTACT_ME' | 'NOT_NOW'
export type Channel = 'WHATSAPP' | 'SMS' | 'EMAIL' | 'UNKNOWN'
export type ApiLanguage = 'HI' | 'MR' | 'GU' | 'EN'

export interface EarlyAccessConfig {
  brands: { code: string; name: string }[]
  joinedCount: number
}

export interface SubmitResponseRequest {
  ownerName: string
  /** ten digits, without +91 */
  mobile: string
  shopName: string
  state: string
  city: string
  storeType: StoreType
  monthlyPurchase: MonthlyPurchase
  purchaseMethods: PurchaseMethod[]
  /** brand codes, plus OTHER */
  brands: string[]
  /** optional free text, sent as null when blank */
  otherBrands: string | null
  suggestedBrands: string | null
  rewardInterest: RewardInterest
  joinInterest: JoinInterest
  channel: Channel
  language: ApiLanguage
  /** the "I confirm I am a retailer / business owner" tick, shown with the privacy note */
  consentGiven: true
  consentVersion: string
  /** "send me INTIQ Rewards updates": optional */
  updatesConsent: boolean
  /** honeypot: always empty from a real person */
  website: ''
}

export interface SubmitResponseResult {
  foundingNumber: number
  /** true when this mobile had answered before and the answers were updated */
  updated: boolean
}

export type JourneyEventType = 'OPENED' | 'FORM_STEP' | 'SUBMITTED'

export interface JourneyEvent {
  visitId: string
  event: JourneyEventType
  step: number | null
  channel: Channel
  language: ApiLanguage
}

/** A field the backend refused, in our usual error format. */
export interface FieldError {
  field: string
  message: string
}

export class ApiError extends Error {
  readonly status: number
  readonly fieldErrors: FieldError[]
  constructor(status: number, message: string, fieldErrors: FieldError[] = []) {
    super(message)
    this.status = status
    this.fieldErrors = fieldErrors
  }
}
