import clsx from 'clsx'
import { useT } from '@/shared/i18n/useT'
import { fill } from '@/shared/i18n'
import styles from './ui.module.css'

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
