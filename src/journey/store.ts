import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { Channel, JoinInterest, MonthlyPurchase, PurchaseMethod, RewardInterest, StoreType } from '@/shared/api/types'
import { detectLang, type Lang } from '@/shared/i18n'
import { STEPS, type StepId } from './steps'

export interface Answers {
  /** the "I am a retailer" tick on the confirm step */
  confirmed: boolean
  ownerName: string
  mobile: string
  shopName: string
  state: string
  city: string
  storeType?: StoreType
  monthlyPurchase?: MonthlyPurchase
  purchaseMethods: PurchaseMethod[]
  brands: string[]
  otherBrands: string
  suggestedBrands: string
  rewardInterest?: RewardInterest
  joinInterest?: JoinInterest
  /** "send me updates": optional */
  updatesConsent: boolean
}

interface JourneyState {
  step: StepId
  lang: Lang
  /** which blast the link came from (?ch=whatsapp|sms|email), kept from the first visit */
  channel: Channel
  /** a random id for this browser, so "where people stop" counts visits, not clicks */
  visitId: string
  answers: Answers
  /** set once the answers are saved */
  foundingNumber: number | null
  go: (step: StepId) => void
  next: () => void
  back: () => void
  setLang: (lang: Lang) => void
  answer: (patch: Partial<Answers>) => void
  finish: (foundingNumber: number) => void
}

const EMPTY: Answers = {
  confirmed: false,
  ownerName: '',
  mobile: '',
  shopName: '',
  state: '',
  city: '',
  purchaseMethods: [],
  brands: [],
  otherBrands: '',
  suggestedBrands: '',
  updatesConsent: false,
}

const channelFromLink = (): Channel => {
  const ch = (new URLSearchParams(location.search).get('ch') ?? '').toUpperCase()
  return ch === 'WHATSAPP' || ch === 'SMS' || ch === 'EMAIL' ? ch : 'UNKNOWN'
}

const newVisitId = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`)

/* Saved in the browser as they go, so the same link reopens where they stopped. The version lets a
   later change to the steps start a stale visit cleanly instead of breaking it. */
export const useJourney = create<JourneyState>()(
  persist(
    (set, get) => ({
      step: 'welcome',
      lang: detectLang(),
      channel: channelFromLink(),
      visitId: newVisitId(),
      answers: EMPTY,
      foundingNumber: null,
      go: (step) => set({ step }),
      next: () => set({ step: STEPS[Math.min(STEPS.indexOf(get().step) + 1, STEPS.length - 1)] }),
      back: () => set({ step: STEPS[Math.max(STEPS.indexOf(get().step) - 1, 0)] }),
      setLang: (lang) => set({ lang }),
      answer: (patch) => set({ answers: { ...get().answers, ...patch } }),
      finish: (foundingNumber) => set({ foundingNumber, step: 'done' }),
    }),
    {
      // v2 is the client's survey format; a visit saved by the old journey starts fresh
      name: 'intiq-join.v2',
      version: 2,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ step, lang, channel, visitId, answers, foundingNumber }) => ({ step, lang, channel, visitId, answers, foundingNumber }),
    },
  ),
)
