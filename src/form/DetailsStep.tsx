import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, Building2, MapPin, Phone, Store, User, UserRound } from 'lucide-react'
import clsx from 'clsx'
import { useJourney } from '@/journey/store'
import { STATES } from '@/shared/data/catalog'
import { useT } from '@/shared/i18n/useT'
import { GoButton } from '@/shared/ui/Buttons'
import { Field, Select, TextInput } from '@/shared/ui/Field'
import { cleanMobile, detailsSchema, type Details } from './details'
import { FormStep } from './FormStep'
import styles from './Form.module.css'

/** Step 4: name, mobile, shop, state, city, on one screen. Saved to the visit as they type, so a
 *  closed tab comes back filled in. */
export function DetailsStep() {
  const t = useT()
  const answers = useJourney((s) => s.answers)
  const answer = useJourney((s) => s.answer)
  const next = useJourney((s) => s.next)

  const { register, handleSubmit, setValue, formState } = useForm<Details>({
    resolver: zodResolver(detailsSchema),
    mode: 'onTouched',
    defaultValues: {
      ownerName: answers.ownerName,
      mobile: answers.mobile,
      shopName: answers.shopName,
      state: (answers.state || undefined) as Details['state'],
      city: answers.city,
    },
  })
  const bad = formState.errors
  const keep = (field: keyof Details) => ({
    onChange: (e: { target: { value: string } }) => answer({ [field]: e.target.value }),
  })
  const mobile = register('mobile', {
    onChange: (e) => {
      const digits = cleanMobile(e.target.value)
      setValue('mobile', digits)
      answer({ mobile: digits })
    },
  })

  return (
    <FormStep
      step="details"
      icon={<UserRound />}
      title={t.detailsTitle}
      go={
        <GoButton type="submit" form="details">
          {t.next}
          <ArrowRight size={20} aria-hidden />
        </GoButton>
      }
    >
      <form id="details" className={styles.fields} onSubmit={handleSubmit(next)} noValidate>
        <div className={clsx(bad.ownerName && styles.bad)}>
          <Field label={t.ownerName}>
            <TextInput lead={<User size={20} />} autoComplete="name" maxLength={80} aria-invalid={!!bad.ownerName} {...register('ownerName', keep('ownerName'))} />
          </Field>
        </div>
        <div className={clsx(bad.mobile && styles.bad)}>
          <Field label={t.mobile} hint={bad.mobile ? t.mobileHint : undefined}>
            <TextInput lead={<><Phone size={18} />+91</>} type="tel" inputMode="numeric" autoComplete="tel-national" maxLength={14} aria-invalid={!!bad.mobile} {...mobile} />
          </Field>
        </div>
        <div className={clsx(bad.shopName && styles.bad)}>
          <Field label={t.shopName}>
            <TextInput lead={<Store size={20} />} autoComplete="organization" maxLength={80} aria-invalid={!!bad.shopName} {...register('shopName', keep('shopName'))} />
          </Field>
        </div>
        <div className={styles.pair}>
          <div className={clsx(bad.state && styles.bad)}>
            <Field label={t.state}>
              <Select lead={<MapPin size={20} />} aria-invalid={!!bad.state} defaultValue="" {...register('state', keep('state'))}>
                <option value="" disabled>
                  {t.chooseState}
                </option>
                {STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
          <div className={clsx(bad.city && styles.bad)}>
            <Field label={t.city}>
              <TextInput lead={<Building2 size={20} />} autoComplete="address-level2" maxLength={60} aria-invalid={!!bad.city} {...register('city', keep('city'))} />
            </Field>
          </div>
        </div>
        {Object.keys(bad).length > 0 && (
          <p className={styles.error} role="alert">
            {t.checkDetails}
          </p>
        )}
      </form>
    </FormStep>
  )
}
