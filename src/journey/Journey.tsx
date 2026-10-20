import { useEffect, type ReactNode } from 'react'
import { BrandsStep, JoinStep, MethodsStep, PurchaseStep, RewardStep } from '@/form/ChoiceSteps'
import { DetailsStep } from '@/form/DetailsStep'
import { RetailerStep } from '@/form/RetailerStep'
import { ReviewStep } from '@/form/ReviewStep'
import { DoneScreen } from '@/done/DoneScreen'
import { WelcomeScreen } from '@/welcome/WelcomeScreen'
import { track, trackOpened } from '@/shared/tracking/track'
import { useVoice } from '@/shared/voice/voice'
import { funnelStep, type StepId } from './steps'
import { useJourney } from './store'

const SCREENS: Record<StepId, () => ReactNode> = {
  welcome: () => <WelcomeScreen />,
  confirm: () => <RetailerStep />,
  details: () => <DetailsStep />,
  purchase: () => <PurchaseStep />,
  methods: () => <MethodsStep />,
  brands: () => <BrandsStep />,
  reward: () => <RewardStep />,
  join: () => <JoinStep />,
  review: () => <ReviewStep />,
  done: () => <DoneScreen />,
}

/** Shows the current step. Each step change stops the voice, scrolls to the top and is counted. */
export function Journey() {
  const step = useJourney((s) => s.step)

  useEffect(() => trackOpened(), [])

  useEffect(() => {
    useVoice.getState().stop()
    window.scrollTo(0, 0)
    const position = funnelStep(step)
    if (position) track('FORM_STEP', position)
    else track('SUBMITTED')
  }, [step])

  const Step = SCREENS[step] ?? SCREENS.welcome
  return <Step key={step} />
}
