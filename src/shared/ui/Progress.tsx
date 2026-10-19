import type { CSSProperties } from 'react'
import clsx from 'clsx'
import { useT } from '@/shared/i18n/useT'
import { fill } from '@/shared/i18n'
import styles from './ui.module.css'

/** Story bars, like WhatsApp Status: done ones full, the current one filling over `ms`. It holds
 *  (stops filling) while the story waits for an answer, the voice, or a hidden page. */
export function StoryBars({ count, index, ms, running }: { count: number; index: number; ms: number; running: boolean }) {
  return (
    <div className={styles.bars} aria-hidden style={{ '--dur': `${ms}ms` } as CSSProperties}>
      {Array.from({ length: count }, (_, k) => (
        <i key={k} className={clsx(k < index && styles.full, k === index && (running ? styles.now : styles.held))} />
      ))}
    </div>
  )
}

/** Form progress as dots, the current one stretched. */
export function StepDots({ count, index }: { count: number; index: number }) {
  const t = useT()
  return (
    <div className={styles.dots} role="img" aria-label={fill(t.stepOf, { n: index + 1, total: count })}>
      {Array.from({ length: count }, (_, k) => (
        <i key={k} className={clsx(k < index && styles.past, k === index && styles.current)} />
      ))}
    </div>
  )
}
