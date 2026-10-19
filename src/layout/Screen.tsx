import type { ReactNode } from 'react'
import clsx from 'clsx'
import { LanguageSwitch } from '@/shared/ui/LanguageSwitch'
import { TrustStrip } from '@/shared/ui/TrustStrip'
import { useT } from '@/shared/i18n/useT'
import styles from './Screen.module.css'

interface ScreenProps {
  /** story cards are deep plum on a phone; the form and the end follow the phone's light or dark setting */
  tone: 'story' | 'form' | 'done'
  /** the picture: in the flow on a phone (story only), the whole left pane on a computer */
  art: ReactNode
  /** a line under the picture on a computer */
  caption?: ReactNode
  /** progress: story bars or form dots */
  progress?: ReactNode
  /** the buttons at the bottom */
  actions: ReactNode
  /** under the buttons, e.g. "Skip to form" */
  after?: ReactNode
  /** story only: tapping the left or right of the picture goes back or on, like WhatsApp Status */
  onTapBack?: () => void
  onTapNext?: () => void
  children: ReactNode
}

/* One screen of the journey. A phone gets one full-height column with the buttons in thumb reach.
   From 900px wide (a computer, a tablet) the same screen becomes two panes: the picture on the left
   in deep plum, the words and choices on the right. Only the arrangement changes, never the content. */
export function Screen({ tone, art, caption, progress, actions, after, onTapBack, onTapNext, children }: ScreenProps) {
  const t = useT()
  return (
    <div className={clsx(styles.screen, styles[tone])}>
      <aside className={styles.visual}>
        <div className={styles.art}>{art}</div>
        {caption && <p className={styles.caption}>{caption}</p>}
        {onTapBack && <button type="button" className={clsx(styles.tap, styles.tapBack)} onClick={onTapBack} aria-label={t.back} tabIndex={-1} />}
        {onTapNext && <button type="button" className={clsx(styles.tap, styles.tapNext)} onClick={onTapNext} aria-label={t.next} tabIndex={-1} />}
      </aside>

      <main className={styles.panel}>
        {progress && <div className={styles.progress}>{progress}</div>}
        <header className={styles.header}>
          {/* no company name or mark: the page speaks for the brands, not for us */}
          <span className={styles.brand}>{t.forShopkeepers}</span>
          <LanguageSwitch />
        </header>
        <div className={styles.body}>
          {children}
        </div>
        <div className={styles.actions}>{actions}</div>
        {after && <div className={styles.after}>{after}</div>}
        <TrustStrip className={styles.trust} />
      </main>
    </div>
  )
}
