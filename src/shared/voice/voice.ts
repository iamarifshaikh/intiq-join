import { create } from 'zustand'
import { SPEECH_LANG, type Lang } from '@/shared/i18n'

/* Reads a screen aloud. Today it is the browser's own speech; recorded clips (a real person's voice)
   can replace it here without touching any screen.  */

interface VoiceState {
  speaking: boolean
  /** start reading, or stop if already reading */
  toggle: (text: string, lang: Lang) => void
  stop: () => void
}

const synth = typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null

const pickVoice = (lang: Lang) => {
  const want = SPEECH_LANG[lang]
  const voices = synth?.getVoices() ?? []
  const own = voices.find((v) => v.lang === want) ?? voices.find((v) => v.lang.startsWith(want.slice(0, 2)))
  // Marathi voices are rare on computers; Hindi reads Devanagari well enough as a fallback. Gujarati is
  // a different script, so it gets no stand-in: the phone's own Gujarati voice, if it has one.
  return own ?? (lang === 'mr' ? voices.find((v) => v.lang === 'hi-IN') : undefined) ?? null
}

export const voiceAvailable = synth !== null

export const useVoice = create<VoiceState>((set, get) => ({
  speaking: false,
  stop: () => {
    synth?.cancel()
    set({ speaking: false })
  },
  toggle: (text, lang) => {
    if (!synth) return
    if (get().speaking) return get().stop()
    const utterance = new SpeechSynthesisUtterance(text.replace(/\p{Extended_Pictographic}/gu, ''))
    const voice = pickVoice(lang)
    utterance.voice = voice
    utterance.lang = voice?.lang ?? SPEECH_LANG[lang]
    utterance.rate = 0.92
    utterance.onend = utterance.onerror = () => set({ speaking: false })
    synth.cancel()
    set({ speaking: true })
    synth.speak(utterance)
  },
}))
