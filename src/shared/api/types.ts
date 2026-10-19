/* The early-access API, as agreed in the backend brief. Field names are camelCase as in the rest of
   the backend; check them against the backend agent's API summary once it is out.
     GET  /api/v1/public/early-access/config
     POST /api/v1/public/early-access/responses
     POST /api/v1/public/early-access/events */

export type MonthlyPurchase = 'UNDER_50K' | 'FROM_50K_TO_2L' | 'FROM_2L_TO_5L' | 'OVER_5L'
export type PreferredReward = 'CASH' | 'GOLD' | 'TRIP' | 'PHONE_TV'
export type MainTrouble = 'LATE_PAYMENT' | 'HARD_TO_UNDERSTAND' | 'TOO_LITTLE' | 'NO_SCHEME'
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
  /** brand codes, plus OTHER */
  brands: string[]
  monthlyPurchase: MonthlyPurchase
  preferredReward: PreferredReward
  mainTrouble: MainTrouble
  channel: Channel
  language: ApiLanguage
  consentGiven: true
  consentVersion: string
  /** honeypot: always empty from a real person */
  website: ''
}

export interface SubmitResponseResult {
  foundingNumber: number
  /** true when this mobile had answered before and the answers were updated */
  updated: boolean
}

export type JourneyEventType = 'OPENED' | 'STORY_CARD' | 'FORM_STEP' | 'SUBMITTED'

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
