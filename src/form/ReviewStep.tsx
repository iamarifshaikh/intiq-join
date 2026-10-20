import { Check, ClipboardCheck, Loader2, PencilLine, Send } from 'lucide-react'
import clsx from 'clsx'
import { useJourney } from '@/journey/store'
import type { StepId } from '@/journey/steps'
import { ApiError, useConfig, useSubmit, type ApiLanguage } from '@/shared/api'
import { CONSENT_VERSION, JOIN_INTEREST, MONTHLY_PURCHASE, OTHER_BRAND, PURCHASE_METHODS, REWARD_INTEREST, STORE_TYPES } from '@/shared/data/catalog'
import { useT } from '@/shared/i18n/useT'
import { GoButton } from '@/shared/ui/Buttons'
import { DETAIL_FIELDS, detailsSchema } from './details'
import { FormStep } from './FormStep'
import styles from './Form.module.css'

const blankToNull = (text: string) => (text.trim() ? text.trim() : null)

/** Every answer at a glance, each with Edit; the optional "send me updates" tick; Submit. */
export function ReviewStep() {
  const t = useT()
  const { brands } = useConfig()
  const { answers, channel, lang } = useJourney()
  const answer = useJourney((s) => s.answer)
  const go = useJourney((s) => s.go)
  const finish = useJourney((s) => s.finish)
  const submit = useSubmit()

  const details = detailsSchema.safeParse(answers)
  /* a stale visit (or a skipped step) can arrive here with a gap: send them back to it */
  const firstGap: StepId | null = !answers.confirmed
    ? 'confirm'
    : !details.success
      ? 'details'
      : !answers.monthlyPurchase
        ? 'purchase'
        : !answers.purchaseMethods.length
          ? 'methods'
          : !answers.brands.length
            ? 'brands'
            : !answers.rewardInterest
              ? 'reward'
              : !answers.joinInterest
                ? 'join'
                : null

  const refused = submit.error instanceof ApiError ? submit.error.fieldErrors.some((f) => (DETAIL_FIELDS as string[]).includes(f.field)) : false
  const tooMany = submit.error instanceof ApiError && submit.error.status === 429

  const send = () => {
    if (firstGap || !details.success) return go(firstGap ?? 'details')
    const { monthlyPurchase, rewardInterest, joinInterest } = answers
    if (!monthlyPurchase || !rewardInterest || !joinInterest) return
    submit.mutate(
      {
        ...details.data,
        monthlyPurchase,
        purchaseMethods: answers.purchaseMethods,
        brands: answers.brands,
        otherBrands: answers.brands.includes(OTHER_BRAND) ? blankToNull(answers.otherBrands) : null,
        suggestedBrands: blankToNull(answers.suggestedBrands),
        rewardInterest,
        joinInterest,
        channel,
        language: lang.toUpperCase() as ApiLanguage,
        consentGiven: true,
        consentVersion: CONSENT_VERSION,
        updatesConsent: answers.updatesConsent,
        website: '',
      },
      { onSuccess: (result) => finish(result.foundingNumber) },
    )
  }

  const label = <V extends string>(values: V[], words: string[], value?: V) => (value ? words[values.indexOf(value)] : '—')
  const brandNames = answers.brands.map((code) => (code === OTHER_BRAND ? t.otherLocal : (brands.find((b) => b.code === code)?.name ?? code)))

  const rows: { title: string; value: string; step: StepId }[] = [
    { title: t.storeType, value: label(STORE_TYPES, t.storeTypes, answers.storeType), step: 'details' },
    { title: t.purchaseTitle, value: label(MONTHLY_PURCHASE, t.purchase, answers.monthlyPurchase), step: 'purchase' },
    { title: t.methodsTitle, value: answers.purchaseMethods.map((m) => t.methods[PURCHASE_METHODS.indexOf(m)]).join(', ') || '—', step: 'methods' },
    { title: t.brandsTitle, value: [...brandNames, answers.otherBrands.trim() && answers.brands.includes(OTHER_BRAND) ? `(${answers.otherBrands.trim()})` : ''].filter(Boolean).join(', ') || '—', step: 'brands' },
    { title: t.rewardTitle, value: label(REWARD_INTEREST, t.reward, answers.rewardInterest), step: 'reward' },
    { title: t.joinTitle, value: label(JOIN_INTEREST, t.join, answers.joinInterest), step: 'join' },
  ]

  return (
    <FormStep
      step="review"
      icon={<ClipboardCheck />}
      title={t.reviewTitle}
      sub={t.reviewSub}
      go={
        <GoButton onClick={send} disabled={submit.isPending}>
          {submit.isPending ? (
            <>
              <Loader2 size={20} className={styles.spin} aria-hidden />
              {t.sending}
            </>
          ) : (
            <>
              {t.submit}
              <Send size={18} aria-hidden />
            </>
          )}
        </GoButton>
      }
    >
      <div className={styles.summary}>
        <div className={styles.who}>
          <b>{answers.shopName}</b>
          <span>
            {answers.ownerName} · +91 {answers.mobile}
          </span>
          <span>
            {answers.city}, {answers.state}
          </span>
          <button type="button" className={styles.edit} onClick={() => go('details')}>
            <PencilLine size={14} aria-hidden /> {t.edit}
          </button>
        </div>
        <dl className={styles.answers}>
          {rows.map((row) => (
            <div key={row.title}>
              <dt>{row.title}</dt>
              <dd translate={row.step === 'brands' ? 'no' : undefined}>{row.value}</dd>
              <button type="button" className={styles.edit} onClick={() => go(row.step)} aria-label={`${t.edit}: ${row.title}`}>
                <PencilLine size={14} aria-hidden />
              </button>
            </div>
          ))}
        </dl>
      </div>

      <label className={clsx(styles.consent, answers.updatesConsent && styles.consentOn)}>
        <input type="checkbox" checked={answers.updatesConsent} onChange={(e) => answer({ updatesConsent: e.target.checked })} />
        <span className={styles.box} aria-hidden>
          <Check size={16} />
        </span>
        <span>{t.consent}</span>
      </label>

      {submit.isError && (
        <p className={styles.error} role="alert">
          {tooMany ? t.tooMany : refused ? t.checkDetails : t.sendFailed}
        </p>
      )}
    </FormStep>
  )
}
