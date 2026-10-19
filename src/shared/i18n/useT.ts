import { useJourney } from '@/journey/store'
import type { Messages } from './en'
import { MESSAGES } from './index'

/** The words for the language chosen now. (Kept apart from index.ts so the store can use detectLang
 *  without a circular import.) */
export function useT(): Messages {
  return MESSAGES[useJourney((s) => s.lang)]
}
