import { useEffect, useState } from 'react'
import { ArrowRight, IndianRupee, Signal, SignalHigh, SignalLow, SignalMedium } from 'lucide-react'
import clsx from 'clsx'
import { useJourney } from '@/journey/store'
import { AFTER_ANSWER_MS, STORY } from '@/journey/steps'
import { useAutoplay } from '@/journey/useAutoplay'
import { Screen } from '@/layout/Screen'
import { EXAMPLE_RATE, MONTHLY_PURCHASE, TYPICAL_MONTH } from '@/shared/data/catalog'
import { useT } from '@/shared/i18n/useT'
import { formatINR } from '@/shared/format'
import { BackButton, GoButton, ListenButton } from '@/shared/ui/Buttons'
import { Option } from '@/shared/ui/Choices'
import { StoryBars } from '@/shared/ui/Progress'
import styles from './Story.module.css'

const VOLUME_ICONS = [SignalLow, SignalMedium, SignalHigh, Signal]

/** Card 5: "How much do you buy in a month?" One tap shows what a shop like theirs could earn in a
 *  year (an example), counting up so it feels real. It waits for the answer, then moves on. */
export function VolumeCard() {
  const t = useT()
  const next = useJourney((s) => s.next)
  const back = useJourney((s) => s.back)
  const answer = useJourney((s) => s.answer)
  const picked = useJourney((s) => s.answers.monthlyPurchase)
  const running = useAutoplay(AFTER_ANSWER_MS, picked !== undefined, next)
  const yearly = picked ? TYPICAL_MONTH[picked] * 12 * EXAMPLE_RATE : 0

  return (
    <Screen
      tone="story"
      art={<YearlyArt amount={yearly} />}
      progress={<StoryBars count={STORY.length} index={STORY.indexOf('volume')} ms={AFTER_ANSWER_MS} running={running} />}
      actions={
        <>
          <BackButton onClick={back} />
          <ListenButton text={t.volumeTitle} />
          <GoButton onClick={next} disabled={!picked}>
            {t.next}
            <ArrowRight size={20} aria-hidden />
          </GoButton>
        </>
      }
    >
      <h1 className={styles.title}>{t.volumeTitle}</h1>
      <div className={clsx(styles.options, !picked && styles.ask)}>
        {MONTHLY_PURCHASE.map((value, k) => {
          const Icon = VOLUME_ICONS[k]
          return <Option key={value} picked={picked === value} onClick={() => answer({ monthlyPurchase: value })} icon={<Icon size={22} aria-hidden />} label={t.volumeRanges[k]} />
        })}
      </div>
      {picked && (
        <div className={styles.result} role="status">
          <span>{t.volumeEarnBefore}</span>
          <CountUp to={yearly} />
          <span>{t.volumeEarnAfter}</span>
          <small>{t.exampleOnly}</small>
        </div>
      )}
    </Screen>
  )
}

/** The amount, counting up from zero. */
function CountUp({ to }: { to: number }) {
  const [shown, setShown] = useState(0)
  useEffect(() => {
    const start = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 900)
      setShown(to * (1 - Math.pow(1 - p, 3)))
      if (p < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [to])
  return <b className={styles.amount}>{formatINR(shown)}</b>
}

/** On a computer, the left pane shows the amount large once chosen; on a phone the card shows it. */
function YearlyArt({ amount }: { amount: number }) {
  return <div className={styles.yearly}>{amount ? <CountUp to={amount} /> : <IndianRupee aria-hidden />}</div>
}
