import type { ReactNode } from 'react'
import { useJourney } from '@/journey/store'
import { QUESTIONS, type StepId } from '@/journey/steps'
import { Screen } from '@/layout/Screen'
import { StepArt } from '@/shared/art/Art'
import { fill } from '@/shared/i18n'
import { useT } from '@/shared/i18n/useT'
import { BackButton, ListenButton } from '@/shared/ui/Buttons'
import { StepDots } from '@/shared/ui/Progress'
import styles from './Form.module.css'

interface FormStepProps {
  step: StepId
  /** the step's icon, shown large in the left pane on a computer */
  icon: ReactNode
  title: string
  sub?: string
  /** the main button; leave out on steps where one tap moves on */
  go?: ReactNode
  children: ReactNode
}

/** The frame every question shares: dots, "Step n of 8", the question, Back + Listen + the main button. */
export function FormStep({ step, icon, title, sub, go, children }: FormStepProps) {
  const t = useT()
  const back = useJourney((s) => s.back)
  const index = QUESTIONS.indexOf(step)
  return (
    <Screen
      tone="form"
      art={<StepArt icon={icon} />}
      caption={
        <>
          {t.titleLine1}
          <br />
          <em>{t.titleLine2}</em>
        </>
      }
      progress={<StepDots count={QUESTIONS.length} index={index} />}
      actions={
        <>
          <BackButton onClick={back} />
          <ListenButton text={[title, sub].filter(Boolean).join('. ')} />
          {go}
        </>
      }
    >
      <p className={styles.stepOf}>{fill(t.stepOf, { n: index + 1, total: QUESTIONS.length })}</p>
      <h1 className={styles.title}>{title}</h1>
      {sub && <p className={styles.hint}>{sub}</p>}
      {children}
    </Screen>
  )
}
