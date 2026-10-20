import { ArrowRight, Check, ShieldCheck } from 'lucide-react'
import clsx from 'clsx'
import { useJourney } from '@/journey/store'
import { useT } from '@/shared/i18n/useT'
import { GoButton } from '@/shared/ui/Buttons'
import { FormStep } from './FormStep'
import styles from './Form.module.css'

/** "Before we begin": one tick, "I confirm I am a retailer / business owner", with the privacy note.
 *  This tick is the consent the backend stores (consentGiven + consentVersion). */
export function RetailerStep() {
  const t = useT()
  const confirmed = useJourney((s) => s.answers.confirmed)
  const answer = useJourney((s) => s.answer)
  const next = useJourney((s) => s.next)

  return (
    <FormStep
      step="confirm"
      icon={<ShieldCheck />}
      title={t.confirmTitle}
      sub={t.confirmSub}
      go={
        <GoButton onClick={next} disabled={!confirmed}>
          {t.next}
          <ArrowRight size={20} aria-hidden />
        </GoButton>
      }
    >
      <label className={clsx(styles.consent, styles.consentBig, confirmed && styles.consentOn)}>
        <input type="checkbox" checked={confirmed} onChange={(e) => answer({ confirmed: e.target.checked })} />
        <span className={styles.box} aria-hidden>
          <Check size={16} />
        </span>
        <span>{t.confirmText}</span>
      </label>
      <p className={styles.smallprint}>{t.privacy}</p>
    </FormStep>
  )
}
