import type { ReactNode } from 'react'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useJourney } from '@/journey/store'
import { CARD_MS, STORY } from '@/journey/steps'
import { useAutoplay } from '@/journey/useAutoplay'
import { Screen } from '@/layout/Screen'
import { useConfig } from '@/shared/api'
import { fill } from '@/shared/i18n'
import { useT } from '@/shared/i18n/useT'
import { GoButton, ListenButton, TextButton } from '@/shared/ui/Buttons'
import { StoryBars } from '@/shared/ui/Progress'
import { InviteArt, MedalArt, PainArt, RevealArt, WinsArt } from './Art'
import styles from './Story.module.css'

type StoryStep = 'invite' | 'pain' | 'reveal' | 'wins' | 'founding'

/** One story card: a picture, one line, and it moves on by itself. The last card reserves a place. */
export function StoryCard({ step }: { step: StoryStep }) {
  const t = useT()
  const next = useJourney((s) => s.next)
  const back = useJourney((s) => s.back)
  const go = useJourney((s) => s.go)
  const { joinedCount } = useConfig()
  const index = STORY.indexOf(step)
  const running = useAutoplay(CARD_MS, true, next)
  const last = step === 'founding'
  /* skipping jumps past the pitch, not past the one story question the form needs */
  const skip = () => go(useJourney.getState().answers.monthlyPurchase ? 'brands' : 'volume')

  const card: Record<StoryStep, { art: ReactNode; title: string; text?: string; extra?: ReactNode }> = {
    invite: { art: <InviteArt />, title: t.inviteTitle, text: t.inviteText },
    pain: { art: <PainArt />, title: t.painTitle, text: t.painText },
    reveal: {
      art: <RevealArt />,
      title: t.revealTitle,
      text: t.revealText,
      extra: (
        <span className={styles.soon}>
          <Sparkles size={16} aria-hidden />
          {t.launchingSoon}
        </span>
      ),
    },
    wins: { art: <WinsArt />, title: t.winsTitle },
    founding: {
      art: (
        <MedalArt>
          {joinedCount !== null && (
            <span className={styles.joined}>
              <i aria-hidden />
              {fill(t.joined, { n: joinedCount })}
            </span>
          )}
        </MedalArt>
      ),
      title: t.foundingTitle,
      text: t.foundingText,
    },
  }
  const { art, title, text, extra } = card[step]

  return (
    <Screen
      tone="story"
      art={art}
      progress={<StoryBars count={STORY.length} index={index} ms={CARD_MS} running={running} />}
      onTapBack={index > 0 ? back : undefined}
      onTapNext={next}
      actions={
        <>
          <ListenButton text={[title, text].filter(Boolean).join('. ')} />
          <GoButton onClick={next}>
            {last ? t.reserve : t.next}
            <ArrowRight size={20} aria-hidden />
          </GoButton>
        </>
      }
      after={last ? <span className={styles.minute}>{t.takesAMinute}</span> : <TextButton onClick={skip}>{t.skipToForm}</TextButton>}
    >
      <h1 className={styles.title}>{title}</h1>
      {text && <p className={step === 'pain' ? styles.strong : styles.text}>{text}</p>}
      {extra}
    </Screen>
  )
}
