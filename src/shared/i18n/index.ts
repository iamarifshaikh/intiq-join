import { en, type Messages } from './en'
import { gu } from './gu'
import { hi } from './hi'
import { mr } from './mr'

export type Lang = 'hi' | 'mr' | 'gu' | 'en'
export const LANGS: Lang[] = ['hi', 'mr', 'gu', 'en']
export const MESSAGES: Record<Lang, Messages> = { hi, mr, gu, en }

/* the voice for each language (the browser's speech today; recorded clips later) */
export const SPEECH_LANG: Record<Lang, string> = { hi: 'hi-IN', mr: 'mr-IN', gu: 'gu-IN', en: 'en-IN' }

/** "{n} shops" + { n: 212 } → "212 shops" */
export const fill = (text: string, vars: Record<string, string | number>) => text.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? ''))

/** The first language: the link's ?lang=, else Marathi or Gujarati on a phone set to it, else Hindi. (Most phones
 *  are set to English even when their owner prefers Hindi, so English is never picked for them.) */
export function detectLang(): Lang {
  const fromLink = new URLSearchParams(location.search).get('lang')
  if (fromLink && (LANGS as string[]).includes(fromLink)) return fromLink as Lang
  const phone = (navigator.language || '').slice(0, 2)
  return phone === 'mr' || phone === 'gu' ? phone : 'hi'
}
