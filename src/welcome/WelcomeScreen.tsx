import clsx from 'clsx'
import { ArrowRight, BadgeCheck, Coins, Gift, HeartHandshake, MapPin, Megaphone, ShieldCheck } from 'lucide-react'
import { useJourney } from '@/journey/store'
import { Screen } from '@/layout/Screen'
import { useConfig } from '@/shared/api'
import { CoinArt } from '@/shared/art/Art'
import { LANGS, MESSAGES, fill } from '@/shared/i18n'
import { useT } from '@/shared/i18n/useT'
import { GoButton, ListenButton } from '@/shared/ui/Buttons'
import { useVoice } from '@/shared/voice/voice'
import styles from './Welcome.module.css'

/* the promise is three short "no"s in one sentence; each language ends them with . or । */
const splitPromise = (text: string) =>
  text
    .split(/(?<=[.।])\s+/)
    .map((s) => s.trim())
    .filter(Boolean)

/** The client's welcome: every line of their invitation, laid out as a page rather than a paragraph.
 *  The headline in a plum hero, the programme as four icon rows, the promise as three badges, the
 *  benefits as ticks, and their sign-off as a quote from Team INTIMASIA. */
export function WelcomeScreen() {
  const t = useT()
  const lang = useJourney((s) => s.lang)
  const setLang = useJourney((s) => s.setLang)
  const next = useJourney((s) => s.next)
  const { joinedCount } = useConfig()

  const features = [
    { icon: <Gift />, text: t.programme },
    { icon: <Coins />, text: t.earn },
    { icon: <MapPin />, text: t.launch },
    { icon: <HeartHandshake />, text: t.pride },
  ]

  return (
    <Screen
      tone="form"
      art={<CoinArt />}
      caption={
        <>
          INTIQ REWARDS
          <br />
          <em>
            {t.titleLine1} {t.titleLine2}
          </em>
        </>
      }
      actions={
        <>
          <ListenButton text={[t.news, t.forRetailers, t.programme, t.earn, t.launch, t.pride, t.promise, t.tagline].join(' ')} />
          <GoButton onClick={next}>
            {t.next}
            <ArrowRight size={20} aria-hidden />
          </GoButton>
        </>
      }
      after={<span className={styles.hint}>{t.continueHint}</span>}
    >
      <div className={styles.langs} role="radiogroup" aria-label={t.chooseLanguage}>
        <span className={styles.langLabel}>{t.chooseLanguage}</span>
        <div className={styles.langRow}>
          {LANGS.map((l) => (
            <button
              key={l}
              type="button"
              role="radio"
              aria-checked={l === lang}
              className={clsx(styles.lang, l === lang && styles.langOn)}
              onClick={() => {
                useVoice.getState().stop()
                setLang(l)
              }}
            >
              {MESSAGES[l].langName}
            </button>
          ))}
        </div>
      </div>

      <section className={styles.hero}>
        <div className={styles.heroCoin}>
          <CoinArt small />
        </div>
        <span className={styles.tag}>{t.welcomeTag}</span>
        <h1 className={styles.title}>
          {t.titleLine1}
          <br />
          <em>{t.titleLine2}</em>
        </h1>
        <p className={styles.news}>
          <Megaphone size={18} aria-hidden />
          <span>{t.news}</span>
        </p>
        <p className={styles.for}>{t.forRetailers}</p>
      </section>

      <ul className={styles.features}>
        {features.map((f) => (
          <li key={f.text}>
            <span className={styles.featureIcon} aria-hidden>
              {f.icon}
            </span>
            <span>{f.text}</span>
          </li>
        ))}
      </ul>

      <section className={styles.promise}>
        <ShieldCheck className={styles.promiseIcon} aria-hidden />
        <ul>
          {splitPromise(t.promise).map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </section>

      <ul className={styles.benefits}>
        {t.benefits.map((b) => (
          <li key={b}>
            <BadgeCheck size={20} aria-hidden />
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <figure className={styles.quote}>
        <p>{t.invite}</p>
        <blockquote>{t.tagline}</blockquote>
        <figcaption>— {t.team}</figcaption>
      </figure>

      {joinedCount !== null && (
        <p className={styles.joined}>
          <i aria-hidden />
          {fill(t.joined, { n: joinedCount })}
        </p>
      )}

      <p className={styles.privacy}>{t.privacy}</p>
    </Screen>
  )
}
