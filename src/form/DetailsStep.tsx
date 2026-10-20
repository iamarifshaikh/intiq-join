import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, Building2, Dumbbell, LayoutGrid, MapPin, MoreHorizontal, Phone, Shirt, Store, Warehouse, User, UserRound, type LucideIcon } from 'lucide-react'
import clsx from 'clsx'
import { useJourney } from '@/journey/store'
import { STATES, STATES_FIRST, STORE_TYPES } from '@/shared/data/catalog'
import { useT } from '@/shared/i18n/useT'
import { GoButton } from '@/shared/ui/Buttons'
import { Tile } from '@/shared/ui/Choices'
import { Field, TextInput } from '@/shared/ui/Field'
import { Picker } from '@/shared/ui/Picker'
import { cleanMobile, detailsSchema, type Details } from './details'
import { FormStep } from './FormStep'
import styles from './Form.module.css'

/* one picture per store type, in the order of STORE_TYPES */
const STORE_ICONS: LucideIcon[] = [Shirt, LayoutGrid, Building2, Dumbbell, Warehouse, MoreHorizontal]

/** "Tell us about yourself": name, shop, mobile, city, state and store type, on one screen, in the
 *  client's order. Saved to the visit as they type, so a closed tab comes back filled in. */
export function DetailsStep() {
  const t = useT()
  const answers = useJourney((s) => s.answers)
  const answer = useJourney((s) => s.answer)
  const next = useJourney((s) => s.next)

  const { register, handleSubmit, setValue, control, formState } = useForm<Details>({
    resolver: zodResolver(detailsSchema),
    mode: 'onTouched',
    defaultValues: {
      ownerName: answers.ownerName,
      shopName: answers.shopName,
      mobile: answers.mobile,
      city: answers.city,
      state: (answers.state || undefined) as Details['state'],
      storeType: answers.storeType,
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
      sub={t.detailsSub}
      go={
        <GoButton type="submit" form="details">
          {t.next}
          <ArrowRight size={20} aria-hidden />
        </GoButton>
      }
    >
      <form id="details" className={styles.fields} onSubmit={handleSubmit(() => next())} noValidate>
        <div className={clsx(bad.ownerName && styles.bad)}>
          <Field label={t.ownerName}>
            <TextInput lead={<User size={20} />} autoComplete="name" maxLength={80} aria-invalid={!!bad.ownerName} {...register('ownerName', keep('ownerName'))} />
          </Field>
        </div>
        <div className={clsx(bad.shopName && styles.bad)}>
          <Field label={t.shopName}>
            <TextInput lead={<Store size={20} />} autoComplete="organization" maxLength={80} aria-invalid={!!bad.shopName} {...register('shopName', keep('shopName'))} />
          </Field>
        </div>
        <div className={clsx(bad.mobile && styles.bad)}>
          <Field label={t.mobile} hint={t.mobileHint}>
            <TextInput
              lead={
                <>
                  <Phone size={18} />
                  +91
                </>
              }
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              maxLength={14}
              aria-invalid={!!bad.mobile}
              {...mobile}
            />
          </Field>
        </div>
        <div className={styles.pair}>
          <div className={clsx(bad.city && styles.bad)}>
            <Field label={t.city}>
              <TextInput lead={<Building2 size={20} />} autoComplete="address-level2" maxLength={60} aria-invalid={!!bad.city} {...register('city', keep('city'))} />
            </Field>
          </div>
          <div className={clsx(bad.state && styles.bad)}>
            <Field label={t.state}>
              <Controller
                control={control}
                name="state"
                render={({ field }) => (
                  <Picker
                    label={t.state}
                    value={field.value ?? ''}
                    onChange={(v) => {
                      field.onChange(v)
                      answer({ state: v })
                    }}
                    options={STATES.map((st) => ({ value: st, label: st }))}
                    featured={[...STATES_FIRST]}
                    placeholder={t.chooseState}
                    searchPlaceholder={t.searchState}
                    lead={<MapPin size={20} />}
                    invalid={!!bad.state}
                  />
                )}
              />
            </Field>
          </div>
        </div>
        <div className={clsx(styles.group, bad.storeType && styles.bad)} role="radiogroup" aria-label={t.storeType}>
          <span className={styles.groupLabel}>{t.storeType}</span>
          <Controller
            control={control}
            name="storeType"
            render={({ field }) => (
              <div className={styles.typeGrid}>
                {STORE_TYPES.map((type, k) => {
                  const Icon = STORE_ICONS[k]
                  return (
                    <Tile
                      key={type}
                      compact
                      picked={field.value === type}
                      onClick={() => {
                        field.onChange(type)
                        answer({ storeType: type })
                      }}
                      icon={<Icon />}
                      label={t.storeTypes[k]}
                    />
                  )
                })}
              </div>
            )}
          />
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
