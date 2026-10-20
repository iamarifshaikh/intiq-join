import { describe, expect, it } from 'vitest'
import { formatINR } from '@/shared/format'
import { fill } from '@/shared/i18n'
import { cleanMobile, detailsSchema } from './details'

const good = { ownerName: 'Ramesh', mobile: '9876543210', shopName: 'Shree Stores', state: 'Maharashtra', city: 'Pune', storeType: 'INNERWEAR_SPECIALIST' }

describe('cleanMobile', () => {
  it('keeps ten digits and drops +91, spaces and a leading 0', () => {
    expect(cleanMobile('+91 98765 43210')).toBe('9876543210')
    expect(cleanMobile('09876543210')).toBe('9876543210')
    expect(cleanMobile('919876543210')).toBe('9876543210')
    expect(cleanMobile('98765-43210-99')).toBe('9876543210')
  })
})

describe('detailsSchema', () => {
  it('accepts a complete shop', () => {
    expect(detailsSchema.safeParse(good).success).toBe(true)
  })

  it('refuses mobiles that cannot be Indian', () => {
    expect(detailsSchema.safeParse({ ...good, mobile: '5876543210' }).success).toBe(false)
    expect(detailsSchema.safeParse({ ...good, mobile: '987654321' }).success).toBe(false)
  })

  it('needs a store type from the list', () => {
    expect(detailsSchema.safeParse({ ...good, storeType: undefined }).success).toBe(false)
    expect(detailsSchema.safeParse({ ...good, storeType: 'KIOSK' }).success).toBe(false)
  })

  it('refuses a state not on the list and blank names', () => {
    expect(detailsSchema.safeParse({ ...good, state: 'Bombay' }).success).toBe(false)
    expect(detailsSchema.safeParse({ ...good, ownerName: ' ' }).success).toBe(false)
  })
})

describe('words and numbers', () => {
  it('fills placeholders', () => {
    expect(fill('Step {n} of {total}', { n: 2, total: 5 })).toBe('Step 2 of 5')
  })

  it('groups rupees the Indian way', () => {
    expect(formatINR(125000)).toBe('₹1,25,000')
  })
})
