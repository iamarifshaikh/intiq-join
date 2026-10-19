import type { ReactNode } from 'react'
import { ArrowRight, Award, Banknote, Coins, Gem, Plane, Receipt, Store, Tv } from 'lucide-react'
import { useT } from '@/shared/i18n/useT'
import styles from './Art.module.css'

/* The pictures on the story cards, drawn with shapes and icons (nothing to download, sharp on any
   screen). They always sit on plum: on a phone the card itself, on a computer the left pane. */

export function InviteArt() {
  return (
    <div className={styles.orb}>
      <Store aria-hidden />
    </div>
  )
}

export function PainArt() {
  return (
    <div className={styles.fan} aria-hidden>
      <span>
        <Receipt />
      </span>
      <span>
        <Receipt />
      </span>
      <span>
        <Receipt />
      </span>
      <b>?</b>
    </div>
  )
}

export function RevealArt() {
  return (
    <div className={styles.turn} aria-hidden>
      <span className={styles.bill}>
        <Receipt />
      </span>
      <ArrowRight className={styles.arrow} />
      <span className={styles.coin}>
        <Gem />
      </span>
    </div>
  )
}

export function WinsArt() {
  const t = useT()
  const icons = [Coins, Plane, Banknote, Tv]
  return (
    <div className={styles.wins}>
      {icons.map((Icon, k) => (
        <div key={k}>
          <Icon aria-hidden />
          {t.wins[k]}
        </div>
      ))}
    </div>
  )
}

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

/** On a computer, the form's left pane: the step's icon in a soft badge. */
export function StepArt({ icon }: { icon: ReactNode }) {
  return <div className={styles.step}>{icon}</div>
}
