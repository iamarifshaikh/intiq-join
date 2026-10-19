import { useEffect, useState } from 'react'
import { useVoice } from '@/shared/voice/voice'

/** Moves the story on after `ms`, like WhatsApp Status. Holds while `ready` is false (the ₹ card waits
 *  for an answer), while the voice is reading, and while the page is hidden (a call, another app).
 *  Coming back starts the card's time again. Returns whether it is running, for the progress bar. */
export function useAutoplay(ms: number, ready: boolean, onDone: () => void) {
  const speaking = useVoice((s) => s.speaking)
  const [visible, setVisible] = useState(() => !document.hidden)

  useEffect(() => {
    const onVisibility = () => setVisible(!document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  const running = ready && !speaking && visible
  useEffect(() => {
    if (!running) return
    const timer = setTimeout(onDone, ms)
    return () => clearTimeout(timer)
  }, [running, ms, onDone])

  return running
}
