import type { ReactNode } from 'react'
import clsx from 'clsx'
import { LanguageSwitch } from '@/shared/ui/LanguageSwitch'
import { TrustStrip } from '@/shared/ui/TrustStrip'
import { useT } from '@/shared/i18n/useT'
import styles from './Screen.module.css'

interface ScreenProps {
  /** every screen follows the phone's light or dark setting; done adds a little celebration */
  tone: 'form' | 'done'
  /** the picture: the whole left pane on a computer (a phone has no room for it) */
  art: ReactNode
  /** a line under the picture on a computer */
  caption?: ReactNode
  /** progress dots */
  progress?: ReactNode
  /** the buttons at the bottom */
  actions: ReactNode
  /** under the buttons, e.g. a hint */
  after?: ReactNode
  children: ReactNode
}

/* One screen of the journey. A phone gets one full-height column with the buttons in thumb reach.
   From 900px wide (a computer, a tablet) the same screen becomes two panes: the picture on the left
   in deep plum, the words and choices on the right. Only the arrangement changes, never the content. */
export function Screen({ tone, art, caption, progress, actions, after, children }: ScreenProps) {
  const t = useT()
  return (
    <div className={clsx(styles.screen, styles[tone])}>
      <aside className={styles.visual}>
        <div className={styles.art}>{art}</div>
        {caption && <p className={styles.caption}>{caption}</p>}
      </aside>

      <main className={styles.panel}>
        {progress && <div className={styles.progress}>{progress}</div>}
        <header className={styles.header}>
          <span className={styles.brand} translate="no">
            INTIQ <span>REWARDS</span>
          </span>
          <LanguageSwitch />
        </header>
        <div className={styles.body}>
          {children}
        </div>
        <div className={styles.actions}>{actions}</div>
        {after && <div className={styles.after}>{after}</div>}
        <TrustStrip className={styles.trust} />
        <p className={styles.footer}>{t.footer}</p>
      </main>
    </div>
  )
}
