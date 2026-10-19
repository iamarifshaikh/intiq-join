import { useEffect, useRef } from 'react'
import { ArrowRight, Banknote, CalendarX, Coins, HelpCircle, Plane, Puzzle, Smartphone, Ban, Gift, Frown, Store } from 'lucide-react'
import { useJourney } from '@/journey/store'
import { useConfig } from '@/shared/api'
import { brandLogo } from '@/shared/data/brandLogos'
import { MAIN_TROUBLE, OTHER_BRAND, PREFERRED_REWARD, brandColour } from '@/shared/data/catalog'
import { useT } from '@/shared/i18n/useT'
import { GoButton } from '@/shared/ui/Buttons'
import { Tile } from '@/shared/ui/Choices'
import { FormStep } from './FormStep'
import styles from './Form.module.css'

/* how long a picked tile shows its tick before the next step */
const PICK_PAUSE_MS = 380

/** Step 1: which brands they keep. Several, so this one has a Next button. */
export function BrandsStep() {
  const t = useT()
  const { brands } = useConfig()
  const picked = useJourney((s) => s.answers.brands)
  const answer = useJourney((s) => s.answer)
  const next = useJourney((s) => s.next)
  /* reads the saved list at tap time, so two quick taps never undo each other */
  const toggle = (code: string) => {
    const now = useJourney.getState().answers.brands
    answer({ brands: now.includes(code) ? now.filter((c) => c !== code) : [...now, code] })
  }

  return (
    <FormStep
      step="brands"
      icon={<Store />}
      title={t.brandsTitle}
      hint={t.brandsHint}
      go={
        <GoButton onClick={next} disabled={picked.length === 0}>
          {t.next}
          <ArrowRight size={20} aria-hidden />
        </GoButton>
      }
    >
      <div className={styles.brandGrid}>
        {brands.map((b, k) => (
          <Tile key={b.code} compact picked={picked.includes(b.code)} onClick={() => toggle(b.code)} label={b.name} colour={brandColour(k)} logo={brandLogo(b.code)} />
        ))}
        <Tile compact picked={picked.includes(OTHER_BRAND)} onClick={() => toggle(OTHER_BRAND)} label={t.other} />
      </div>
    </FormStep>
  )
}

/** One tap and on: shows the tick for a moment, then the next step. */
function usePickThenNext() {
  const next = useJourney((s) => s.next)
  const timer = useRef<number>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])
  return () => {
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(next, PICK_PAUSE_MS)
  }
}

const REWARD_ICONS = [Banknote, Coins, Plane, Smartphone]

/** Step 2: the reward they would love most. */
export function RewardStep() {
  const t = useT()
  const picked = useJourney((s) => s.answers.preferredReward)
  const answer = useJourney((s) => s.answer)
  const moveOn = usePickThenNext()
  return (
    <FormStep step="reward" icon={<Gift />} title={t.rewardTitle}>
      <div className={styles.tileGrid}>
        {PREFERRED_REWARD.map((value, k) => {
          const Icon = REWARD_ICONS[k]
          return (
            <Tile
              key={value}
              picked={picked === value}
              onClick={() => {
                answer({ preferredReward: value })
                moveOn()
              }}
              icon={<Icon />}
              label={t.rewards[k]}
            />
          )
        })}
      </div>
    </FormStep>
  )
}

const TROUBLE_ICONS = [CalendarX, Puzzle, HelpCircle, Ban]

/** Step 3: what troubles them in today's schemes. */
export function TroubleStep() {
  const t = useT()
  const picked = useJourney((s) => s.answers.mainTrouble)
  const answer = useJourney((s) => s.answer)
  const moveOn = usePickThenNext()
  return (
    <FormStep step="trouble" icon={<Frown />} title={t.troubleTitle}>
      <div className={styles.tileGrid}>
        {MAIN_TROUBLE.map((value, k) => {
          const Icon = TROUBLE_ICONS[k]
          return (
            <Tile
              key={value}
              picked={picked === value}
              onClick={() => {
                answer({ mainTrouble: value })
                moveOn()
              }}
              icon={<Icon />}
              label={t.troubles[k]}
            />
          )
        })}
      </div>
    </FormStep>
  )
}
