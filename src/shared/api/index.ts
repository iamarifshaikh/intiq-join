import { useMutation, useQuery } from '@tanstack/react-query'
import { FALLBACK_BRANDS } from '@/shared/data/catalog'
import { httpApi } from './httpApi'
import { mockApi } from './mockApi'
import type { EarlyAccessApi } from './port'
import { ApiError, type SubmitResponseRequest } from './types'

/* VITE_API_MODE=http talks to the real backend; anything else keeps answers in this browser. */
export const api: EarlyAccessApi = import.meta.env.VITE_API_MODE === 'http' ? httpApi : mockApi

/* "3 shops have joined" puts people off rather than drawing them in, so the line waits for a real crowd */
const MIN_JOINED_TO_SHOW = 20

/** The brand list and the "shops have joined" count. Until it arrives (or if it cannot), the built-in
 *  brand list is used and the counter is simply not shown. */
export function useConfig() {
  const query = useQuery({ queryKey: ['config'], queryFn: () => api.config(), staleTime: 5 * 60_000, retry: 2 })
  const joined = query.data?.joinedCount ?? 0
  return {
    brands: query.data?.brands?.length ? query.data.brands : FALLBACK_BRANDS,
    joinedCount: joined >= MIN_JOINED_TO_SHOW ? joined : null,
  }
}

/** Saving the answers. Safe to retry: the backend treats one mobile as one shop. Network errors are
 *  retried quietly; a refused field is not. */
export function useSubmit() {
  return useMutation({
    mutationFn: (request: SubmitResponseRequest) => api.submit(request),
    retry: (count, error) => count < 2 && error instanceof ApiError && error.status === 0,
  })
}

export { ApiError } from './types'
export type * from './types'
