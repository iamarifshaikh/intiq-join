import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { Channel, MainTrouble, MonthlyPurchase, PreferredReward } from '@/shared/api/types'
import { detectLang, type Lang } from '@/shared/i18n'
import { STEPS, type StepId } from './steps'

export interface Answers {
  brands: string[]
  monthlyPurchase?: MonthlyPurchase
  preferredReward?: PreferredReward
  mainTrouble?: MainTrouble
  ownerName: string
  mobile: string
  shopName: string
  state: string
  city: string
  consent: boolean
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

const EMPTY: Answers = { brands: [], ownerName: '', mobile: '', shopName: '', state: '', city: '', consent: false }

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
      step: 'invite',
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
      name: 'intiq-join.v1',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ step, lang, channel, visitId, answers, foundingNumber }) => ({ step, lang, channel, visitId, answers, foundingNumber }),
    },
  ),
)
