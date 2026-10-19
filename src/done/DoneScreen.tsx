import { useState } from 'react'
import { CheckCircle2, Coins, Send } from 'lucide-react'
import { useJourney } from '@/journey/store'
import { Screen } from '@/layout/Screen'
import { formatINR } from '@/shared/format'
import { fill } from '@/shared/i18n'
import { useT } from '@/shared/i18n/useT'
import { GoButton, ListenButton } from '@/shared/ui/Buttons'
import { MedalArt } from '@/story/Art'
import styles from './Done.module.css'

/** The end: their Founding Store number, a blurred first look at the wallet, and a way to pass it on. */
export function DoneScreen() {
  const t = useT()
  const n = useJourney((s) => s.foundingNumber)
  const shop = useJourney((s) => s.answers.shopName)
  const [copied, setCopied] = useState(false)
  const title = fill(t.foundingStore, { n: n ? `#${n}` : '' })

  const share = async () => {
    /* the plain link, without this visit's ?ch=, so the next shop starts fresh */
    const url = location.origin + location.pathname
    try {
      if (navigator.share) return await navigator.share({ title: 'INTIQ Rewards', text: t.inviteTitle, url })
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
      caption={title}
      actions={
        <>
          <ListenButton text={`${t.done} ${title}. ${t.doneText}`} />
          <GoButton onClick={share}>
            <Send size={20} aria-hidden />
            {copied ? t.linkCopied : t.share}
          </GoButton>
        </>
      }
    >
      <div className={styles.head}>
        <CheckCircle2 className={styles.tick} aria-hidden />
        <p className={styles.done}>{t.done}</p>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.text}>{t.doneText}</p>
      </div>

      <p className={styles.peekLabel}>{t.firstLook}</p>
      <div className={styles.peek} aria-hidden>
        <div className={styles.wallet}>
          <span>{shop || 'INTIQ Rewards'}</span>
          <b>
            <Coins size={22} /> {formatINR(12450)}
          </b>
          <i />
          <i />
          <i />
        </div>
      </div>
    </Screen>
  )
}
