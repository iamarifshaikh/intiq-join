import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { ArrowLeft, Volume2 } from 'lucide-react'
import clsx from 'clsx'
import { useJourney } from '@/journey/store'
import { useT } from '@/shared/i18n/useT'
import { useVoice, voiceAvailable } from '@/shared/voice/voice'
import styles from './ui.module.css'

/** The big main button: Next, Reserve my place. */
export function GoButton({ children, className, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button type="button" className={clsx(styles.go, className)} {...rest}>
      {children}
    </button>
  )
}

/** The round Back button. */
export function BackButton({ onClick }: { onClick: () => void }) {
  const t = useT()
  return (
    <button type="button" className={styles.round} onClick={onClick} aria-label={t.back}>
      <ArrowLeft size={22} aria-hidden />
    </button>
  )
}

/** Reads the screen aloud in the chosen language; tap again to stop. */
export function ListenButton({ text }: { text: string }) {
  const t = useT()
  const lang = useJourney((s) => s.lang)
  const speaking = useVoice((s) => s.speaking)
  const toggle = useVoice((s) => s.toggle)
  if (!voiceAvailable) return null
  return (
    <button type="button" className={clsx(styles.round, speaking && styles.speaking)} onClick={() => toggle(text, lang)} aria-label={t.listen} aria-pressed={speaking}>
      <Volume2 size={22} aria-hidden />
    </button>
  )
}

/** A quiet text link, e.g. "Skip to form". */
export function TextButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button type="button" className={styles.textButton} onClick={onClick}>
      {children}
    </button>
  )
}
