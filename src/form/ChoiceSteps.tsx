import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  ArrowRight,
  BellRing,
  Clock,
  EyeOff,
  Factory,
  Gift,
  Globe,
  HelpCircle,
  IndianRupee,
  MailCheck,
  PhoneCall,
  Search,
  ShoppingBag,
  Signal,
  SignalHigh,
  SignalLow,
  SignalMedium,
  Tags,
  ThumbsDown,
  ThumbsUp,
  Truck,
  UserCheck,
  Warehouse,
  type LucideIcon,
} from 'lucide-react'
import { useJourney, type Answers } from '@/journey/store'
import type { StepId } from '@/journey/steps'
import { useConfig } from '@/shared/api'
import { brandLogo } from '@/shared/data/brandLogos'
import { JOIN_INTEREST, MONTHLY_PURCHASE, OTHER_BRAND, PURCHASE_METHODS, REWARD_INTEREST, brandColour } from '@/shared/data/catalog'
import { useT } from '@/shared/i18n/useT'
import { GoButton } from '@/shared/ui/Buttons'
import { Option, Tile } from '@/shared/ui/Choices'
import { Field, TextInput } from '@/shared/ui/Field'
import { FormStep } from './FormStep'
import styles from './Form.module.css'

/* how long a picked choice shows its tick before the next step */
const PICK_PAUSE_MS = 380

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

/** A list of wide rows, one answer, moves on by itself once picked. */
function SingleChoice<K extends keyof Answers, V extends string>({
  step,
  icon,
  title,
  field,
  values,
  labels,
  icons,
}: {
  step: StepId
  icon: ReactNode
  title: string
  field: K
  values: V[]
  labels: string[]
  icons: LucideIcon[]
}) {
  const picked = useJourney((s) => s.answers[field]) as V | undefined
  const answer = useJourney((s) => s.answer)
  const moveOn = usePickThenNext()
  return (
    <FormStep step={step} icon={icon} title={title}>
      <div className={styles.options}>
        {values.map((value, k) => {
          const Icon = icons[k]
          return (
            <Option
              key={value}
              picked={picked === value}
              onClick={() => {
                answer({ [field]: value } as Partial<Answers>)
                moveOn()
              }}
              icon={<Icon size={22} aria-hidden />}
              label={labels[k]}
            />
          )
        })}
      </div>
    </FormStep>
  )
}

/** A Continue button that waits for at least one pick. */
function NextWhen({ ready }: { ready: boolean }) {
  const t = useT()
  const next = useJourney((s) => s.next)
  return (
    <GoButton onClick={next} disabled={!ready}>
      {t.next}
      <ArrowRight size={20} aria-hidden />
    </GoButton>
  )
}

/** How much they buy a month. */
export function PurchaseStep() {
  const t = useT()
  return (
    <SingleChoice
      step="purchase"
      icon={<IndianRupee />}
      title={t.purchaseTitle}
      field="monthlyPurchase"
      values={MONTHLY_PURCHASE}
      labels={t.purchase}
      icons={[SignalLow, SignalMedium, SignalHigh, Signal, EyeOff]}
    />
  )
}

const METHOD_ICONS = [Factory, Truck, Warehouse, UserCheck, Globe]

/** How they usually buy: as many as apply. */
export function MethodsStep() {
  const t = useT()
  const picked = useJourney((s) => s.answers.purchaseMethods)
  const answer = useJourney((s) => s.answer)
  const toggle = (value: (typeof PURCHASE_METHODS)[number]) => {
    const now = useJourney.getState().answers.purchaseMethods
    answer({ purchaseMethods: now.includes(value) ? now.filter((v) => v !== value) : [...now, value] })
  }
  return (
    <FormStep step="methods" icon={<ShoppingBag />} title={t.methodsTitle} sub={t.pickAll} go={<NextWhen ready={picked.length > 0} />}>
      <div className={styles.tileGrid}>
        {PURCHASE_METHODS.map((value, k) => {
          const Icon = METHOD_ICONS[k]
          return <Tile key={value} picked={picked.includes(value)} onClick={() => toggle(value)} icon={<Icon />} label={t.methods[k]} />
        })}
      </div>
    </FormStep>
  )
}

/** The brands they stock: 39 tiles with a search, "Other / Local Brands" with its own text box, and
 *  an optional line for brands they would like to see. */
export function BrandsStep() {
  const t = useT()
  const { brands } = useConfig()
  const answers = useJourney((s) => s.answers)
  const answer = useJourney((s) => s.answer)
  const [query, setQuery] = useState('')
  const picked = answers.brands
  const otherPicked = picked.includes(OTHER_BRAND)

  /* reads the saved list at tap time, so two quick taps never undo each other */
  const toggle = (code: string) => {
    const now = useJourney.getState().answers.brands
    answer({ brands: now.includes(code) ? now.filter((c) => c !== code) : [...now, code] })
  }
  const q = query.trim().toLowerCase()
  const shown = brands.map((b, k) => ({ ...b, colour: brandColour(k) })).filter((b) => !q || b.name.toLowerCase().includes(q))

  return (
    <FormStep step="brands" icon={<Tags />} title={t.brandsTitle} sub={t.brandsHint} go={<NextWhen ready={picked.length > 0} />}>
      <div className={styles.search}>
        <TextInput lead={<Search size={18} />} type="search" placeholder={t.searchBrands} value={query} onChange={(e) => setQuery(e.target.value)} aria-label={t.searchBrands} />
      </div>
      {picked.length > 0 && <p className={styles.count}>✓ {picked.length}</p>}
      <div className={styles.brandGrid}>
        {shown.map((b) => (
          <Tile key={b.code} compact picked={picked.includes(b.code)} onClick={() => toggle(b.code)} label={b.name} colour={b.colour} logo={brandLogo(b.code)} />
        ))}
        <Tile compact picked={otherPicked} onClick={() => toggle(OTHER_BRAND)} label={t.otherLocal} />
      </div>
      {q && shown.length === 0 && <p className={styles.hint}>{t.noBrandMatch}</p>}

      <div className={styles.extraFields}>
        {otherPicked && (
          <Field label={t.otherBrands}>
            <TextInput maxLength={200} value={answers.otherBrands} onChange={(e) => answer({ otherBrands: e.target.value })} placeholder={t.otherBrands} />
          </Field>
        )}
        <Field label={t.suggestQ}>
          <TextInput maxLength={200} value={answers.suggestedBrands} onChange={(e) => answer({ suggestedBrands: e.target.value })} placeholder={t.suggestPlaceholder} />
        </Field>
      </div>
    </FormStep>
  )
}

/** Would they like extra rewards on regular purchases? */
export function RewardStep() {
  const t = useT()
  return (
    <SingleChoice
      step="reward"
      icon={<Gift />}
      title={t.rewardTitle}
      field="rewardInterest"
      values={REWARD_INTEREST}
      labels={t.reward}
      icons={[ThumbsUp, HelpCircle, ThumbsDown]}
    />
  )
}

/** Would they like an invitation to join? */
export function JoinStep() {
  const t = useT()
  return (
    <SingleChoice
      step="join"
      icon={<BellRing />}
      title={t.joinTitle}
      field="joinInterest"
      values={JOIN_INTEREST}
      labels={t.join}
      icons={[MailCheck, PhoneCall, Clock]}
    />
  )
}
