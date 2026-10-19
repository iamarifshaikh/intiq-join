import type { EarlyAccessApi } from './port'
import { ApiError, type EarlyAccessConfig, type FieldError, type SubmitResponseResult } from './types'

/* The real backend. Relative paths: in production Amplify forwards /api to the backend, in
   development Vite does (see vite.config.ts), so the browser only ever talks to its own host. */
const BASE = '/api/v1/public/early-access'

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(BASE + path, { ...init, headers: { Accept: 'application/json', 'Content-Type': 'application/json', ...init?.headers } })
  } catch {
    throw new ApiError(0, 'Network error')
  }
  const data: unknown = await response.json().catch(() => null)
  if (!response.ok) {
    const problem = (data ?? {}) as { detail?: string; errors?: FieldError[] }
    throw new ApiError(response.status, problem.detail ?? response.statusText, problem.errors ?? [])
  }
  return data as T
}

export const httpApi: EarlyAccessApi = {
  config: () => call<EarlyAccessConfig>('/config'),
  submit: (request) => call<SubmitResponseResult>('/responses', { method: 'POST', body: JSON.stringify(request) }),
  track: (event) => {
    try {
      const body = JSON.stringify(event)
      // sendBeacon survives the page closing; fall back to a keepalive fetch
      const sent = navigator.sendBeacon?.(BASE + '/events', new Blob([body], { type: 'application/json' }))
      if (!sent) void fetch(BASE + '/events', { method: 'POST', body, headers: { 'Content-Type': 'application/json' }, keepalive: true }).catch(() => {})
    } catch {
      /* tracking never breaks the page */
    }
  },
}
