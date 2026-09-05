'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Button } from './ui'
import { DEFAULT_LOCALE, href, PROPERTY_TYPES, t, type Locale } from '@/lib/i18n'

type AreaOption = { id: number | string; name: string; slug: string }

/**
 * Μπάρα αναζήτησης.
 *
 * Δεν υπάρχουν ημερομηνίες: ο κατάλογος δεν κρατά διαθεσιμότητα, οπότε ένα
 * πεδίο ημερομηνιών θα υπόσχονταν κάτι που δεν μπορεί να τηρήσει. Ο
 * επισκέπτης φιλτράρει σε περιοχή, άτομα και τύπο, και συνεννοείται για
 * ημερομηνίες στο τηλέφωνο.
 */
export function SearchBar({
  areas,
  locale = DEFAULT_LOCALE,
  compact = false,
  defaults,
}: {
  areas: AreaOption[]
  locale?: Locale
  compact?: boolean
  defaults?: { area?: string; guests?: string; type?: string }
}) {
  const router = useRouter()
  const [area, setArea] = useState(defaults?.area ?? '')
  const [guests, setGuests] = useState(defaults?.guests ?? '')
  const [type, setType] = useState(defaults?.type ?? '')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (area) params.set('area', area)
    if (guests) params.set('guests', guests)
    if (type) params.set('type', type)
    router.push(href(locale, `/katalymata${params.size ? `?${params}` : ''}`))
  }

  const field =
    'h-12 w-full rounded-xl border-0 bg-sand-50 px-4 text-[15px] text-ink-900 ' +
    'ring-1 ring-inset ring-sand-200 focus:ring-2 focus:ring-clay-500'

  return (
    <form
      onSubmit={submit}
      className={
        compact
          ? 'flex flex-col gap-3 sm:flex-row sm:items-end'
          : 'rounded-2xl bg-white p-3 shadow-panel sm:p-4'
      }
    >
      <div className="grid w-full gap-3 sm:grid-cols-[1.4fr_1fr_1.2fr_auto] sm:items-end">
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-ink-500">{t(locale, 'search.area')}</span>
          <select
            className={field}
            value={area}
            onChange={(e) => setArea(e.target.value)}
            aria-label={t(locale, 'search.area')}
          >
            <option value="">{t(locale, 'search.allAreas')}</option>
            {areas.map((a) => (
              <option key={a.id} value={a.slug}>
                {a.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-ink-500">{t(locale, 'search.guests')}</span>
          <select
            className={field}
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            aria-label={t(locale, 'search.guests')}
          >
            <option value="">{t(locale, 'search.anyGuests')}</option>
            {[1, 2, 3, 4, 5, 6, 8, 10].map((n) => (
              <option key={n} value={n}>
                {n}+
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-ink-500">{t(locale, 'search.type')}</span>
          <select
            className={field}
            value={type}
            onChange={(e) => setType(e.target.value)}
            aria-label={t(locale, 'search.type')}
          >
            <option value="">{t(locale, 'search.anyType')}</option>
            {Object.entries(PROPERTY_TYPES[locale]).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <Button type="submit" size="lg" className="h-12 w-full sm:w-auto">
          {t(locale, 'search.submit')}
        </Button>
      </div>
    </form>
  )
}
