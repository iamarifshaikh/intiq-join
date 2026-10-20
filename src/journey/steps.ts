/* The survey, in order: one welcome screen, eight short steps, then thank-you. Changing the order or
   adding a step starts here (and one entry in Journey.tsx). The funnel counts FORM_STEP by position
   in STEPS, so welcome is step 1 and review is step 9. */

export type StepId = 'welcome' | 'confirm' | 'details' | 'purchase' | 'methods' | 'brands' | 'reward' | 'join' | 'review' | 'done'

export const STEPS: StepId[] = ['welcome', 'confirm', 'details', 'purchase', 'methods', 'brands', 'reward', 'join', 'review', 'done']

/** the steps with a question: the dots and "Step n of 8" count these */
export const QUESTIONS: StepId[] = STEPS.filter((s) => s !== 'welcome' && s !== 'done')

/** 1-based position for the funnel (welcome = 1 … review = 9); done has none */
export const funnelStep = (step: StepId) => (step === 'done' ? null : STEPS.indexOf(step) + 1)
