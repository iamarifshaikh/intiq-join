import { useEffect } from 'react'
import { ConfirmStep } from '@/form/ConfirmStep'
import { DetailsStep } from '@/form/DetailsStep'
import { BrandsStep, RewardStep, TroubleStep } from '@/form/ChoiceSteps'
import { DoneScreen } from '@/done/DoneScreen'
import { StoryCard } from '@/story/StoryCard'
import { VolumeCard } from '@/story/VolumeCard'
import { track, trackOpened } from '@/shared/tracking/track'
import { useVoice } from '@/shared/voice/voice'
import { FORM, STORY, type StepId } from './steps'
import { useJourney } from './store'

const SCREENS: Record<StepId, () => React.ReactNode> = {
  invite: () => <StoryCard step="invite" />,
  pain: () => <StoryCard step="pain" />,
  reveal: () => <StoryCard step="reveal" />,
  wins: () => <StoryCard step="wins" />,
  volume: () => <VolumeCard />,
  founding: () => <StoryCard step="founding" />,
  brands: () => <BrandsStep />,
  reward: () => <RewardStep />,
  trouble: () => <TroubleStep />,
  details: () => <DetailsStep />,
  confirm: () => <ConfirmStep />,
  done: () => <DoneScreen />,
}

/** Shows the current step. Each step change stops the voice, scrolls to the top and is counted. */
export function Journey() {
  const step = useJourney((s) => s.step)

  useEffect(() => trackOpened(), [])

  useEffect(() => {
    useVoice.getState().stop()
    window.scrollTo(0, 0)
    if (STORY.includes(step)) track('STORY_CARD', STORY.indexOf(step) + 1)
    else if (FORM.includes(step)) track('FORM_STEP', FORM.indexOf(step) + 1)
    else track('SUBMITTED')
  }, [step])

  const Step = SCREENS[step] ?? SCREENS.invite
  return <Step key={step} />
}
