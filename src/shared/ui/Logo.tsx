import styles from './ui.module.css'

/* The INTIQ mark: a small round badge. */
export function Logo() {
  return (
    <span className={styles.logo} aria-hidden>
      i<b>q</b>
    </span>
  )
}
