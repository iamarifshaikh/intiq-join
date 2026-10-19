import type { ReactNode } from 'react'
import { useJourney } from '@/journey/store'
import { FORM, type StepId } from '@/journey/steps'
import { Screen } from '@/layout/Screen'
import { fill } from '@/shared/i18n'
import { useT } from '@/shared/i18n/useT'
import { BackButton, ListenButton } from '@/shared/ui/Buttons'
import { StepDots } from '@/shared/ui/Progress'
import { StepArt } from '@/story/Art'
import styles from './Form.module.css'

interface FormStepProps {
  step: StepId
  /** the step's icon, shown large in the left pane on a computer */
  icon: ReactNode
  title: string
  hint?: string
  /** the main button; leave out on steps where one tap moves on */
  go?: ReactNode
  children: ReactNode
}

/** The frame every form step shares: dots, "Step n of 5", the question, Back + Listen + the main button. */
export function FormStep({ step, icon, title, hint, go, children }: FormStepProps) {
  const t = useT()
  const back = useJourney((s) => s.back)
  const index = FORM.indexOf(step)
  return (
    <Screen
      tone="form"
      art={<StepArt icon={icon} />}
      caption={t.asideForm}
      progress={<StepDots count={FORM.length} index={index} />}
      actions={
        <>
          <BackButton onClick={back} />
          <ListenButton text={[title, hint].filter(Boolean).join('. ')} />
          {go}
        </>
      }
    >
      <p className={styles.stepOf}>{fill(t.stepOf, { n: index + 1, total: FORM.length })}</p>
      <h1 className={styles.title}>{title}</h1>
      {hint && <p className={styles.hint}>{hint}</p>}
      {children}
    </Screen>
  )
}
