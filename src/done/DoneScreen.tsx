import { useState } from 'react'
import { Award, Flower2, Send } from 'lucide-react'
import { useJourney } from '@/journey/store'
import { Screen } from '@/layout/Screen'
import { MedalArt } from '@/shared/art/Art'
import { fill } from '@/shared/i18n'
import { useT } from '@/shared/i18n/useT'
import { GoButton, ListenButton } from '@/shared/ui/Buttons'
import styles from './Done.module.css'

/** The client's thank-you, with the retailer's Founding Store number and a way to pass the link on. */
export function DoneScreen() {
  const t = useT()
  const n = useJourney((s) => s.foundingNumber)
  const [copied, setCopied] = useState(false)
  const founding = n ? fill(t.foundingStore, { n: `#${n}` }) : null

  const share = async () => {
    /* the plain link, without this visit's ?ch=, so the next retailer starts fresh */
    const url = location.origin + location.pathname
    try {
      if (navigator.share) return await navigator.share({ title: `${t.titleLine1} ${t.titleLine2}`, text: t.news, url })
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2400)
    } catch {
      /* they closed the share sheet: nothing to do */
    }
  }

  return (
    <Screen
      tone="done"
      art={<MedalArt />}
      caption={
        <>
          {t.thanksTitle}
          <br />
          <em>{t.thanksLine}</em>
        </>
      }
      actions={
        <>
          <ListenButton text={[t.thanksTitle, t.thanksText, founding, t.thanksSub].filter(Boolean).join('. ')} />
          <GoButton onClick={share}>
            <Send size={20} aria-hidden />
            {copied ? t.linkCopied : t.share}
          </GoButton>
        </>
      }
    >
      <div className={styles.head}>
        <span className={styles.flower} aria-hidden>
          <Flower2 />
        </span>
        <h1 className={styles.title}>{t.thanksTitle}</h1>
        <p className={styles.tagline}>{t.thanksTagline}</p>
        <p className={styles.text}>{t.thanksText}</p>
      </div>

      {founding && (
        <div className={styles.badge}>
          <span className={styles.badgeIcon} aria-hidden>
            <Award />
          </span>
          <div>
            <b>{founding}</b>
            <span>{t.foundingNote}</span>
          </div>
        </div>
      )}

      <p className={styles.line}>{t.thanksLine}</p>
      <p className={styles.sub}>{t.thanksSub}</p>
    </Screen>
  )
}
