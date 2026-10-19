import { ShieldCheck } from 'lucide-react'
import clsx from 'clsx'
import { useT } from '@/shared/i18n/useT'
import styles from './ui.module.css'

/* On every screen: what we never ask for. */
export function TrustStrip({ className }: { className?: string }) {
  const t = useT()
  return (
    <p className={clsx(styles.trust, className)}>
      <ShieldCheck size={15} aria-hidden />
      <span>{t.trust}</span>
    </p>
  )
}
