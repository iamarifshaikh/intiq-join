import { FALLBACK_BRANDS } from '@/shared/data/catalog'
import type { EarlyAccessApi } from './port'
import type { SubmitResponseRequest } from './types'

/* A stand-in backend that keeps answers in this browser, so the journey can be built and tried before
   the real one exists. It follows the same rules: one mobile is one shop, and answering again keeps
   the founding number. SAMPLE_JOINED makes the "shops have joined" counter look lived-in. */
const KEY = 'intiq-join.mock-responses'
const SAMPLE_JOINED = 212
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

type Stored = SubmitResponseRequest & { foundingNumber: number; at: string }
const read = (): Stored[] => {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]') as Stored[]
  } catch {
    return []
  }
}

export const mockApi: EarlyAccessApi = {
  async config() {
    await wait(250)
    return { brands: FALLBACK_BRANDS, joinedCount: SAMPLE_JOINED + read().length }
  },
  async submit(request) {
    await wait(700)
    const all = read()
    const at = all.findIndex((r) => r.mobile === request.mobile)
    const foundingNumber = at >= 0 ? all[at].foundingNumber : SAMPLE_JOINED + all.length + 1
    const row: Stored = { ...request, foundingNumber, at: new Date().toISOString() }
    if (at >= 0) all[at] = row
    else all.push(row)
    try {
      localStorage.setItem(KEY, JSON.stringify(all))
    } catch {
      /* private windows: kept for this visit only */
    }
    return { foundingNumber, updated: at >= 0 }
  },
  track(event) {
    if (import.meta.env.DEV) console.debug('[track]', event.event, event.step ?? '')
  },
}
