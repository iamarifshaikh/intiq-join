import type { CSSProperties, ReactNode } from 'react'
import { Check } from 'lucide-react'
import clsx from 'clsx'
import styles from './ui.module.css'

/** A big square choice with a picture and a word: rewards, troubles, brands. */
export function Tile({
  picked,
  onClick,
  icon,
  label,
  colour,
  compact,
  logo,
}: {
  picked: boolean
  onClick: () => void
  icon?: ReactNode
  label: ReactNode
  colour?: string
  compact?: boolean
  /** a brand's logo: shown large, with the name small beneath it */
  logo?: string
}) {
  return (
    <button
      type="button"
      className={clsx(styles.tile, picked && styles.picked, compact && styles.compact, logo && styles.withLogo)}
      onClick={onClick}
      aria-pressed={picked}
      // brand names are names: never let the browser "translate" them (Chrome turned Bonjour into Good morning)
      translate={colour || logo ? 'no' : undefined}
    >
      <span className={styles.tick} aria-hidden>
        <Check size={16} />
      </span>
      {logo ? (
        <span className={styles.brandLogo}>
          <img src={logo} alt="" loading="lazy" />
        </span>
      ) : (
        icon && <span className={styles.pic}>{icon}</span>
      )}
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
