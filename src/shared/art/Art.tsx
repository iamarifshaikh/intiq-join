import type { ReactNode } from 'react'
import clsx from 'clsx'
import { Award } from 'lucide-react'
import styles from './Art.module.css'

/* The pictures, drawn with shapes and icons (nothing to download, sharp on any screen). They sit on
   plum: the left pane on a computer, or the welcome hero on a phone. */

/** The client's ₹ coin. */
export function CoinArt({ small }: { small?: boolean }) {
  return (
    <div className={clsx(styles.coin, small && styles.small)} aria-hidden>
      ₹
    </div>
  )
}

/** A gold medal, for the Founding Store moment. */
export function MedalArt({ children }: { children?: ReactNode }) {
  return (
    <div className={styles.medalWrap}>
      <div className={styles.medal}>
        <Award aria-hidden />
      </div>
      {children}
    </div>
  )
}

/** On a computer, a step's icon in a soft badge in the left pane. */
export function StepArt({ icon }: { icon: ReactNode }) {
  return <div className={styles.step}>{icon}</div>
}
