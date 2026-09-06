'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

import { Button } from './ui'
import { DEFAULT_LOCALE, href, PROPERTY_TYPES, t, type Locale } from '@/lib/i18n'

type Option = { value: string; label: string }

/**
 * Φίλτρα αναζήτησης.
 *
 * Η κατάσταση ζει στη διεύθυνση και όχι σε μεταβλητή του component. Έτσι ο
 * επισκέπτης μπορεί να στείλει τον σύνδεσμο σε φίλο, να τον βάλει στα
 * αγαπημένα, και το κουμπί «πίσω» δουλεύει όπως περιμένει. Είναι επίσης ο
 * μόνος τρόπος να ευρετηριάσει το Google τα φιλτραρισμένα αποτελέσματα.
 */
export function FilterBar({
  areas,
  amenities,
  locale = DEFAULT_LOCALE,
}: {
  areas: Option[]
  amenities: Option[]
  locale?: Locale
}) {
  const router = useRouter()
  const params = useSearchParams()
  const [open, setOpen] = useState(false)

  const current = {
    q: params.get('q') ?? '',
    area: params.get('area') ?? '',
    guests: params.get('guests') ?? '',
    type: params.get('type') ?? '',
    sort: params.get('sort') ?? '',
    amenities: params.getAll('amenity'),
  }

  // Ξεχωριστή κατάσταση για το πεδίο κειμένου: δεν θέλουμε αίτημα σε κάθε
  // πλήκτρο, μόνο όταν πατηθεί Enter ή το κουμπί.
  const [text, setText] = useState(current.q)

  const activeCount =
    (current.q ? 1 : 0) +
    (current.area ? 1 : 0) +
    (current.guests ? 1 : 0) +
    (current.type ? 1 : 0) +
    current.amenities.length

  function apply(next: Partial<typeof current>) {
    const p = new URLSearchParams()
    const merged = { ...current, ...next }
    if (merged.q) p.set('q', merged.q)
    if (merged.area) p.set('area', merged.area)
    if (merged.guests) p.set('guests', merged.guests)
    if (merged.type) p.set('type', merged.type)
    if (merged.sort) p.set('sort', merged.sort)
    merged.amenities.forEach((a) => p.append('amenity', a))
    router.push(href(locale, `/katalymata${p.size ? `?${p}` : ''}`), { scroll: false })
  }

  function toggleAmenity(value: string) {
    const next = current.amenities.includes(value)
      ? current.amenities.filter((a) => a !== value)
      : [...current.amenities, value]
    apply({ amenities: next })
  }

  const select =
    'h-11 rounded-xl border-0 bg-white px-3.5 text-[15px] ring-1 ring-inset ' +
    'ring-sand-200 focus:ring-2 focus:ring-clay-500'

  return (
    <div className="rounded-card bg-sand-100 p-4">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          apply({ q: text.trim() })
        }}
        className="mb-3 flex gap-2"
      >
        <input
          type="search"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t(locale, 'search.text')}
          aria-label={t(locale, 'search.text')}
          className="h-11 flex-1 rounded-xl border-0 bg-white px-4 text-[15px] ring-1 ring-inset ring-sand-200 focus:ring-2 focus:ring-clay-500"
        />
        <Button type="submit" size="sm" className="h-11 px-5">
          {t(locale, 'search.submit')}
        </Button>
      </form>

      <div className="flex flex-wrap items-center gap-2.5">
        <select
          className={select}
          value={current.area}
          onChange={(e) => apply({ area: e.target.value })}
          aria-label={t(locale, 'search.area')}
        >
          <option value="">{t(locale, 'search.allAreas')}</option>
          {areas.map((a) => (
            <option key={a.value} value={a.value}>
              {a.label}
            </option>
          ))}
        </select>

        <select
          className={select}
          value={current.guests}
          onChange={(e) => apply({ guests: e.target.value })}
          aria-label={t(locale, 'search.guests')}
        >
          <option value="">{t(locale, 'search.anyGuests')}</option>
          {[1, 2, 3, 4, 5, 6, 8, 10].map((n) => (
            <option key={n} value={n}>
              {n}+ {t(locale, 'search.guests')}
            </option>
          ))}
        </select>

        <select
          className={select}
          value={current.type}
          onChange={(e) => apply({ type: e.target.value })}
          aria-label={t(locale, 'search.type')}
        >
          <option value="">{t(locale, 'search.anyType')}</option>
          {Object.entries(PROPERTY_TYPES[locale]).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="h-11 rounded-xl bg-white px-4 text-[15px] ring-1 ring-inset ring-sand-200 hover:bg-sand-50"
          aria-expanded={open}
        >
          {t(locale, 'search.amenities')}
          {current.amenities.length > 0 && (
            <span className="ml-2 rounded-full bg-clay-500 px-1.5 py-0.5 text-xs text-white">
              {current.amenities.length}
            </span>
          )}
        </button>

        <select
          className={select}
          value={current.sort}
          onChange={(e) => apply({ sort: e.target.value })}
          aria-label={t(locale, 'sort.label')}
        >
          <option value="">{t(locale, 'sort.featured')}</option>
          <option value="price-asc">{t(locale, 'sort.priceAsc')}</option>
          <option value="price-desc">{t(locale, 'sort.priceDesc')}</option>
          <option value="guests">{t(locale, 'sort.guests')}</option>
          <option value="newest">{t(locale, 'sort.newest')}</option>
        </select>

        {activeCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setText('')
              router.push(href(locale, '/katalymata'))
            }}
          >
            {t(locale, 'search.clear')} ({activeCount})
          </Button>
        )}
      </div>

      {open && (
        <div className="mt-4 flex flex-wrap gap-2 border-t border-sand-200 pt-4">
          {amenities.map((a) => {
            const on = current.amenities.includes(a.value)
            return (
              <button
                key={a.value}
                type="button"
                onClick={() => toggleAmenity(a.value)}
                aria-pressed={on}
                className={
                  'rounded-full px-3.5 py-1.5 text-sm transition-colors ' +
                  (on
                    ? 'bg-clay-500 text-white'
                    : 'bg-white text-ink-700 ring-1 ring-inset ring-sand-200 hover:bg-sand-50')
                }
              >
                {a.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
