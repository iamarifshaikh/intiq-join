/* The journey, in order. Changing the order or adding a step starts here.
   - story: six cards that play by themselves (like WhatsApp Status) and end in the form
   - form:  five short steps, taps first
   - done:  the Founding Store moment */

export type StepId =
  | 'invite' | 'pain' | 'reveal' | 'wins' | 'volume' | 'founding'
  | 'brands' | 'reward' | 'trouble' | 'details' | 'confirm'
  | 'done'

export const STORY: StepId[] = ['invite', 'pain', 'reveal', 'wins', 'volume', 'founding']
export const FORM: StepId[] = ['brands', 'reward', 'trouble', 'details', 'confirm']
export const STEPS: StepId[] = [...STORY, ...FORM, 'done']

export const isStory = (step: StepId) => STORY.includes(step)
export const isForm = (step: StepId) => FORM.includes(step)

/* How long a story card plays before the next one. The ₹ card waits for an answer, then this long. */
export const CARD_MS = 6000
export const AFTER_ANSWER_MS = 3500
