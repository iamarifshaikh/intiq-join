import { useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Check, ChevronDown, Search, X } from 'lucide-react'
import clsx from 'clsx'
import styles from './Picker.module.css'

/** keeps the page behind the sheet still; returns the undo */
function lockPageScroll() {
  const body = document.body
  const before = body.style.overflow
  body.style.overflow = 'hidden'
  return () => {
    body.style.overflow = before
  }
}

export interface PickerOption {
  value: string
  label: string
}

interface PickerProps {
  /** the field's name, also the sheet's title */
  label: string
  value: string
  onChange: (value: string) => void
  options: PickerOption[]
  /** shown first, as large chips (e.g. the launch states) */
  featured?: string[]
  placeholder: string
  searchPlaceholder: string
  lead?: ReactNode
  invalid?: boolean
}

/* A field that opens a sheet with every option on view: a search on top, the featured ones as chips,
   then the full list with a tick on the chosen one. Instead of the phone's plain drop-down, where
   people have to scroll a tiny wheel to see what is there. A bottom sheet on a phone, a centred
   panel on a computer. */
export function Picker({ label, value, onChange, options, featured = [], placeholder, searchPlaceholder, lead, invalid }: PickerProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const trigger = useRef<HTMLButtonElement>(null)
  const chosen = options.find((o) => o.value === value)

  const close = () => {
    setOpen(false)
    setQuery('')
    trigger.current?.focus()
  }
  const pick = (v: string) => {
    onChange(v)
    close()
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    document.addEventListener('keydown', onKey)
    const unlock = lockPageScroll()
    return () => {
      document.removeEventListener('keydown', onKey)
      unlock()
    }
  }, [open])

  const q = query.trim().toLowerCase()
  const shown = options.filter((o) => !q || o.label.toLowerCase().includes(q))
  const featuredOptions = featured.map((f) => options.find((o) => o.value === f)).filter((o): o is PickerOption => !!o)

  return (
    <>
      <button
        ref={trigger}
        type="button"
        className={clsx(styles.trigger, invalid && styles.invalid, !chosen && styles.empty)}
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-invalid={invalid || undefined}
      >
        {lead && <span className={styles.lead}>{lead}</span>}
        <span className={styles.value}>{chosen ? chosen.label : placeholder}</span>
        <ChevronDown size={20} className={styles.chevron} aria-hidden />
      </button>

      {open &&
        createPortal(
          <div className={styles.overlay} onClick={close}>
            <div className={styles.sheet} role="dialog" aria-modal="true" aria-label={label} onClick={(e) => e.stopPropagation()}>
              <div className={styles.grip} aria-hidden />
              <div className={styles.head}>
                <b>{label}</b>
                <button type="button" className={styles.close} onClick={close} aria-label="Close">
                  <X size={20} />
                </button>
              </div>
              <label className={styles.search}>
                <Search size={18} aria-hidden />
                <input autoFocus type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={searchPlaceholder} />
              </label>

              {!q && featuredOptions.length > 0 && (
                <div className={styles.featured}>
                  {featuredOptions.map((o) => (
                    <button key={o.value} type="button" className={clsx(styles.chip, o.value === value && styles.chipOn)} onClick={() => pick(o.value)}>
                      {o.value === value && <Check size={16} aria-hidden />}
                      {o.label}
                    </button>
                  ))}
                </div>
              )}

              <ul className={styles.list} role="listbox" aria-label={label}>
                {shown.map((o) => (
                  <li key={o.value}>
                    <button type="button" role="option" aria-selected={o.value === value} className={clsx(styles.option, o.value === value && styles.optionOn)} onClick={() => pick(o.value)}>
                      <span>{o.label}</span>
                      {o.value === value && <Check size={18} aria-hidden />}
                    </button>
                  </li>
                ))}
                {shown.length === 0 && <li className={styles.none}>—</li>}
              </ul>
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
