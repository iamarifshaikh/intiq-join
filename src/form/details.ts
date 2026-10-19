import { z } from 'zod'
import { STATES } from '@/shared/data/catalog'

/* The rules for "Your details", the same ones the backend checks. Messages are not shown word for
   word: a refused field just turns red with the field's own hint. */
export const detailsSchema = z.object({
  ownerName: z.string().trim().min(2).max(80),
  mobile: z.string().regex(/^[6-9]\d{9}$/),
  shopName: z.string().trim().min(2).max(80),
  state: z.enum(STATES),
  city: z.string().trim().min(2).max(60),
})

export type Details = z.infer<typeof detailsSchema>
export type DetailField = keyof Details
export const DETAIL_FIELDS: DetailField[] = ['ownerName', 'mobile', 'shopName', 'state', 'city']

/** keeps only digits, drops a leading +91 / 91 / 0, at most ten */
export const cleanMobile = (raw: string) => {
  let digits = raw.replace(/\D/g, '')
  if (digits.length > 10 && digits.startsWith('91')) digits = digits.slice(2)
  if (digits.length > 10 && digits.startsWith('0')) digits = digits.slice(1)
  return digits.replace(/^0+/, '').slice(0, 10)
}
