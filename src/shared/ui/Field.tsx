import type { InputHTMLAttributes, ReactNode, Ref, SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import styles from './ui.module.css'

interface FieldProps {
  label: string
  /** a gentle line under the field, e.g. how a mobile number starts */
  hint?: ReactNode
  children: ReactNode
}

/** A label above a big field. */
export function Field({ label, hint, children }: FieldProps) {
  return (
    <label className={styles.field}>
      <span className={styles.fieldLabel}>{label}</span>
      {children}
      {hint && <span className={styles.hint}>{hint}</span>}
    </label>
  )
}

/** A big text box with an optional icon or "+91" in front. */
export function TextInput({ lead, ref, ...rest }: InputHTMLAttributes<HTMLInputElement> & { lead?: ReactNode; ref?: Ref<HTMLInputElement> }) {
  return (
    <span className={styles.input}>
      {lead && <span className={styles.lead}>{lead}</span>}
      <input ref={ref} {...rest} />
    </span>
  )
}

/** A big pick-list, e.g. the state. */
export function Select({ lead, ref, children, ...rest }: SelectHTMLAttributes<HTMLSelectElement> & { lead?: ReactNode; ref?: Ref<HTMLSelectElement> }) {
  return (
    <span className={styles.input}>
      {lead && <span className={styles.lead}>{lead}</span>}
      <select ref={ref} {...rest}>
        {children}
      </select>
      <ChevronDown size={20} className={styles.chevron} aria-hidden />
    </span>
  )
}
