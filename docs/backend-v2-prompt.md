# Task: Early-access survey v2: change the Founding Store API to the client's new survey format

## Context
- The early-access module `com.intiq.reward.earlyaccess` is live: 3 public endpoints and 5 admin endpoints, documented in `docs/early-access/02-api.md`.
- The client has sent a new survey format. The retailer page (intiq-join) is being rebuilt to match it.
- The flow is now:
  1. Welcome
  2. "I confirm I'm a retailer"
  3. Contact details, now with **store type**
  4. Monthly purchase, now with **"Prefer not to say"**
  5. **How they buy**
  6. **Brands**: a new list of 39, plus optional "other brands" text and brand suggestions
  7. **Interest in extra rewards**
  8. **Interest in an invitation**
  9. Review, with an optional **"send me updates"** consent
- The **reward** and **trouble** questions are removed.

## Working rules
- **Plan first.** Send me a short LLD before coding: migration, DTO and enum changes, query changes, admin changes.
- **Add a new Flyway migration.** Never edit `V2026_10_19_1000__early_access.sql`. Existing rows must survive.
- Keep the existing conventions: ProblemDetail errors with `errors: [{field, message}]`, the paging envelope, and the env-only config.
- Don't commit or push until I say so.

## 1. `POST /api/v1/public/early-access/responses`: new request

```json
{
  "ownerName": "Ramesh Patil",
  "mobile": "9876543210",
  "shopName": "Shree Ganesh Stores",
  "state": "Maharashtra",
  "city": "Pune",
  "storeType": "INNERWEAR_SPECIALIST",
  "monthlyPurchase": "FROM_2L_TO_5L",
  "purchaseMethods": ["DISTRIBUTORS", "WHOLESALERS"],
  "brands": ["JOCKEY", "SONARI", "OTHER"],
  "otherBrands": "Rupa, Lux",
  "suggestedBrands": "Van Heusen",
  "rewardInterest": "YES",
  "joinInterest": "CONTACT_ME",
  "channel": "WHATSAPP",
  "language": "HI",
  "consentGiven": true,
  "consentVersion": "2026-10-ea-2",
  "updatesConsent": true,
  "website": ""
}
```

The response is unchanged: `201 { "foundingNumber": 213, "updated": false }`, or `200 … "updated": true` for the same mobile.

| field | rule | change |
|---|---|---|
| `ownerName`, `mobile`, `shopName`, `state`, `city` | as today (state: the same 36 names) | unchanged |
| `storeType` | required, one of `INNERWEAR_SPECIALIST` `MULTI_BRAND_GARMENT` `DEPARTMENT_STORE` `SPORTSWEAR_ACTIVEWEAR` `WHOLESALE_RETAIL` `OTHER` | **new** |
| `monthlyPurchase` | required, `UNDER_50K` `FROM_50K_TO_2L` `FROM_2L_TO_5L` `OVER_5L` **`PREFER_NOT_TO_SAY`** | **new value** |
| `purchaseMethods` | required, 1–5 items, de-duplicated, each one of `DIRECT_FROM_BRANDS` `DISTRIBUTORS` `WHOLESALERS` `COMPANY_SALES_REPS` `ONLINE_B2B` | **new** |
| `brands` | required, **1–40** items (was 1–20), each an active brand code or `OTHER` | limit raised |
| `otherBrands` | optional text, trimmed, at most 200 characters, blank → null | **new** |
| `suggestedBrands` | optional text, trimmed, at most 200 characters, blank → null | **new** |
| `rewardInterest` | required, `YES` `MAYBE` `NO` | **new** |
| `joinInterest` | required, `YES` `CONTACT_ME` `NOT_NOW` | **new** |
| `consentGiven` | must be `true`. It now means the "I confirm I am a retailer / business owner" tick, shown with the privacy note | wording only |
| `consentVersion` | as today; the page now sends `2026-10-ea-2` | unchanged |
| `updatesConsent` | optional boolean, default `false` ("I agree to receive information about INTIQ Rewards and programme updates") | **new** |
| `preferredReward`, `mainTrouble` | **no longer sent.** Make them optional (accept and ignore if present), and make the columns nullable so old rows keep their values | **now optional** |
| `channel`, `language`, `website` | as today | unchanged |

Upsert, honeypot, rate limit and body size: all unchanged. On an update, replace the new fields too, including resetting `otherBrands` and `suggestedBrands` to null if they're blank now.

## 2. Brand catalog: replace with the client's 39 brands
Add a migration that:
- marks every current brand `active = false`. Don't delete them; old responses reference them.
- then inserts or reactivates these, **in this display order**.

Where the code already exists, reactivate it and update the name.

| order | code | name |
|---|---|---|
| 1 | `NKYD` | NKYD |
| 2 | `ENAMOR` | Enamor |
| 3 | `JOCKEY` | Jockey |
| 4 | `AMANTE` | Amante |
| 5 | `SONARI` | Sonari |
| 6 | `JULIET` | Juliet |
| 7 | `PARIS_BEAUTY` | Paris Beauty |
| 8 | `FLORET` | Floret |
| 9 | `KALYANI` | Kalyani |
| 10 | `LIBRA` | Libra |
| 11 | `RIZA` | Riza |
| 12 | `CALIBRA` | Calibra |
| 13 | `HEMALI` | Hemali |
| 14 | `LITTLE_LACY` | Little Lacy |
| 15 | `LADY_CARE` | Ladycare |
| 16 | `RED_ROSE` | Red Rose |
| 17 | `BODYCARE` | Bodycare |
| 18 | `INCARE` | InCare |
| 19 | `LAVOS` | Lavos |
| 20 | `ESSA` | ESSA |
| 21 | `RANJIT` | Ranjit |
| 22 | `HINT` | Hint |
| 23 | `VIP` | VIP |
| 24 | `DOLLAR` | Dollar |
| 25 | `JAMES_AND_HARPER` | James & Harper |
| 26 | `V_STAR` | V-Star |
| 27 | `SUKANYA` | Sukanya |
| 28 | `L_AND_M` | L&M |
| 29 | `LANGO` | Lango |
| 30 | `LADY_BEAUTY` | Lady Beauty |
| 31 | `ARCHOO` | Archoo |
| 32 | `SMARTY_PANTY` | Smarty Panty |
| 33 | `COMFORT` | Comfort |
| 34 | `JINAL` | Jinal |
| 35 | `LOBSTER` | Lobster |
| 36 | `DERMAWEAR` | Dermawear |
| 37 | `LYCOT` | Lycot |
| 38 | `OCEANIC` | Oceanic |
| 39 | `LACTRA` | Lactra |

`GET /config` keeps its shape and returns only active brands, in this order. `OTHER` still isn't listed; the page shows it as "Other / local brands".

## 3. `POST /events`
Same body. The journey is now one welcome screen plus form steps, so the page sends only `OPENED`, `FORM_STEP` and `SUBMITTED`:
- `FORM_STEP` step range becomes **1–12** (9 are used today: 1 welcome … 9 review).
- `STORY_CARD` stays valid, so old clients don't break, but it is no longer sent.

## 4. Admin endpoints (intiq-web uses these; field names must match exactly)

**Row** (`GET /responses` items, `GET /responses/{id}`): add
- `storeType`
- `purchaseMethods` (array)
- `otherBrands`, `suggestedBrands` (string or null)
- `rewardInterest`, `joinInterest`
- `updatesConsent`

`preferredReward` and `mainTrouble` become nullable.

**Filters** (`GET /responses` and `/export`): add `storeType`, `purchaseMethod` (rows that include it), `rewardInterest`, `joinInterest`, and `updatesConsent` (true/false). Keep the existing ones.

**`GET /summary`:** add these, in the same `{key, count}` shape, biggest first:
- `byStoreType`
- `byPurchaseMethod`: one row can count towards several
- `byRewardInterest`
- `byJoinInterest`
- `updatesConsent`: `{ "yes": n, "no": n }`

`byMonthlyPurchase` includes `PREFER_NOT_TO_SAY`. `byPreferredReward` and `byMainTrouble` can stay; they'll only count old rows.

`funnel` becomes:
- `OPENED`
- `FORM_STEP` 1–9
- `SUBMITTED`

That's 11 stages in this order. Drop the STORY_CARD stages from the funnel output.

**`GET /brands/{code}/report`:** combined numbers only, never names or mobiles. Replace `byPreferredReward` and `byMainTrouble` with `byStoreType`, `byPurchaseMethod` and `byRewardInterest`. Keep `shops`, `byState` and `byMonthlyPurchase`.

**`GET /responses/export` (CSV):** add the columns *Store type, Purchase methods* (separated by "; "), *Other brands, Suggested brands, Reward interest, Join interest* and *Updates consent*. Keep the BOM, IST times and formula escaping.

## Tests
- validation for each new field, including max lengths, the enum values and the 1–40 brands limit
- `preferredReward` and `mainTrouble` absent: accepted
- upsert replaces the new fields and keeps the founding number
- the brand migration: the old brands are inactive, `/config` returns the 39 in order, and an old brand code is refused on submit
- the new summary breakdowns, and the 11-stage funnel
- the brand report contains no personal data
- CSV includes the new columns

## Deliverables
1. The LLD for my OK.
2. The code, the migration and the tests.
3. An updated `docs/early-access/02-api.md`, with exact JSON for every changed endpoint. The frontend is built from it.
4. A local end-to-end check: submit v2, update, then summary, report and export.
