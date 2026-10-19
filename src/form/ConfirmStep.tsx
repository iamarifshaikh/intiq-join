import { Check, Loader2, PencilLine, ShieldCheck } from 'lucide-react'
import clsx from 'clsx'
import { useJourney } from '@/journey/store'
import { ApiError, useConfig, useSubmit, type ApiLanguage } from '@/shared/api'
import { CONSENT_VERSION, MAIN_TROUBLE, OTHER_BRAND, PREFERRED_REWARD } from '@/shared/data/catalog'
import { useT } from '@/shared/i18n/useT'
import { GoButton, TextButton } from '@/shared/ui/Buttons'
import { DETAIL_FIELDS, detailsSchema } from './details'
import { FormStep } from './FormStep'
import styles from './Form.module.css'

/** Step 5: everything at a glance, one consent tick, and Reserve. */
export function ConfirmStep() {
  const t = useT()
  const { brands } = useConfig()
  const { answers, channel, lang } = useJourney()
  const answer = useJourney((s) => s.answer)
  const go = useJourney((s) => s.go)
  const finish = useJourney((s) => s.finish)
  const submit = useSubmit()

  const brandNames = answers.brands.map((code) => (code === OTHER_BRAND ? t.other : (brands.find((b) => b.code === code)?.name ?? code)))
  const reward = answers.preferredReward ? t.rewards[PREFERRED_REWARD.indexOf(answers.preferredReward)] : null
  const trouble = answers.mainTrouble ? t.troubles[MAIN_TROUBLE.indexOf(answers.mainTrouble)] : null

  /* a stale visit (or a skipped step) can arrive here with a gap: send them back to it */
  const details = detailsSchema.safeParse(answers)
  const firstGap = !answers.brands.length ? 'brands' : !answers.preferredReward ? 'reward' : !answers.mainTrouble ? 'trouble' : !details.success ? 'details' : null

  const refused = submit.error instanceof ApiError ? submit.error.fieldErrors.some((f) => (DETAIL_FIELDS as string[]).includes(f.field)) : false
  const tooMany = submit.error instanceof ApiError && submit.error.status === 429

  const reserve = () => {
    if (firstGap) return go(firstGap)
    if (!details.success || !answers.monthlyPurchase || !answers.preferredReward || !answers.mainTrouble) return
    submit.mutate(
      {
        ...details.data,
        brands: answers.brands,
        monthlyPurchase: answers.monthlyPurchase,
        preferredReward: answers.preferredReward,
        mainTrouble: answers.mainTrouble,
        channel,
        language: lang.toUpperCase() as ApiLanguage,
        consentGiven: true,
        consentVersion: CONSENT_VERSION,
        website: '',
      },
      { onSuccess: (result) => finish(result.foundingNumber) },
    )
  }

  return (
    <FormStep
      step="confirm"
      icon={<ShieldCheck />}
      title={t.confirmTitle}
      go={
        <GoButton onClick={reserve} disabled={!answers.consent || submit.isPending}>
          {submit.isPending ? (
            <>
              <Loader2 size={20} className={styles.spin} aria-hidden />
              {t.sending}
            </>
          ) : (
            <>
              {t.reserve}
              <Check size={20} aria-hidden />
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
          <TextButton onClick={() => go('details')}>
            <PencilLine size={15} aria-hidden /> {t.editDetails}
          </TextButton>
        </div>
        <div className={styles.chips}>
          {brandNames.map((name) => (
            <span key={name}>{name}</span>
          ))}
          {reward && <span className={styles.chipSoft}>{reward}</span>}
          {trouble && <span className={styles.chipSoft}>{trouble}</span>}
        </div>
      </div>

      <label className={clsx(styles.consent, answers.consent && styles.consentOn)}>
        <input type="checkbox" checked={answers.consent} onChange={(e) => answer({ consent: e.target.checked })} />
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
