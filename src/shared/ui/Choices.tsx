import type { CSSProperties, ReactNode } from 'react'
import { Check } from 'lucide-react'
import clsx from 'clsx'
import styles from './ui.module.css'

/** A big square choice with a picture and a word: rewards, troubles, brands. */
export function Tile({ picked, onClick, icon, label, colour, compact }: { picked: boolean; onClick: () => void; icon?: ReactNode; label: ReactNode; colour?: string; compact?: boolean }) {
  return (
    <button type="button" className={clsx(styles.tile, picked && styles.picked, compact && styles.compact)} onClick={onClick} aria-pressed={picked}>
      <span className={styles.tick} aria-hidden>
        <Check size={16} />
      </span>
      {icon && <span className={styles.pic}>{icon}</span>}
      <span className={styles.tileLabel} style={colour ? ({ '--brand-colour': colour } as CSSProperties) : undefined}>
        {label}
      </span>
    </button>
  )
}

/** A wide row choice: the ₹ ranges. */
export function Option({ picked, onClick, icon, label }: { picked: boolean; onClick: () => void; icon: ReactNode; label: ReactNode }) {
  return (
    <button type="button" className={clsx(styles.option, picked && styles.picked)} onClick={onClick} aria-pressed={picked}>
      {icon}
      {label}
    </button>
  )
}
