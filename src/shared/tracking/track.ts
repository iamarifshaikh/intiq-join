import { api } from '@/shared/api'
import type { ApiLanguage, JourneyEventType } from '@/shared/api/types'
import { useJourney } from '@/journey/store'

/* "Where people stop": one small event per card and form step, sent fire-and-forget. If it fails,
   nobody notices; the page never waits for it. */
export function track(event: JourneyEventType, step: number | null = null) {
  const { visitId, channel, lang } = useJourney.getState()
  api.track({ visitId, event, step, channel, language: lang.toUpperCase() as ApiLanguage })
}

/** OPENED, once per page load. */
let opened = false
export function trackOpened() {
  if (opened) return
  opened = true
  track('OPENED')
}
