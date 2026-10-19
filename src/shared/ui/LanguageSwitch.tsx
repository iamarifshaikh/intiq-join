import { Languages } from 'lucide-react'
import { useJourney } from '@/journey/store'
import { LANGS, MESSAGES } from '@/shared/i18n'
import { useVoice } from '@/shared/voice/voice'
import styles from './ui.module.css'

/* One button that steps through हिंदी → मराठी → ગુજરાતી → English, always showing the language in use. */
export function LanguageSwitch() {
  const lang = useJourney((s) => s.lang)
  const setLang = useJourney((s) => s.setLang)
  const stop = useVoice((s) => s.stop)
  const nextLang = LANGS[(LANGS.indexOf(lang) + 1) % LANGS.length]

  return (
    <button
      type="button"
      className={styles.lang}
      onClick={() => {
        stop()
        setLang(nextLang)
      }}
      aria-label={`${MESSAGES[lang].langName}. Change language to ${MESSAGES[nextLang].langName}`}
    >
      <Languages size={16} aria-hidden />
      {MESSAGES[lang].langName}
    </button>
  )
}
