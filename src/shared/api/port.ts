import type { EarlyAccessConfig, JourneyEvent, SubmitResponseRequest, SubmitResponseResult } from './types'

/** What the journey needs from a backend. Two versions exist: the real one (http) and one that keeps
 *  everything in this browser (mock), chosen by VITE_API_MODE. The screens never know which. */
export interface EarlyAccessApi {
  config(): Promise<EarlyAccessConfig>
  submit(request: SubmitResponseRequest): Promise<SubmitResponseResult>
  /** fire-and-forget: never throws, never slows the page */
  track(event: JourneyEvent): void
}
