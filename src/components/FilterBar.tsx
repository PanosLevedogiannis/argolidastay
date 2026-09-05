'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

import { Button } from './ui'

type Option = { value: string; label: string }

const TYPES: Option[] = [
  { value: 'apartment', label: 'Διαμέρισμα' },
  { value: 'studio', label: 'Στούντιο' },
  { value: 'maisonette', label: 'Μεζονέτα' },
  { value: 'villa', label: 'Βίλα' },
  { value: 'house', label: 'Μονοκατοικία' },
  { value: 'room', label: 'Δωμάτιο' },
  { value: 'hotel', label: 'Ξενοδοχείο' },
  { value: 'guesthouse', label: 'Ξενώνας' },
]

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
}: {
  areas: Option[]
  amenities: Option[]
}) {
  const router = useRouter()
  const params = useSearchParams()
  const [open, setOpen] = useState(false)

  const current = {
    area: params.get('area') ?? '',
    guests: params.get('guests') ?? '',
    type: params.get('type') ?? '',
    amenities: params.getAll('amenity'),
  }

  const activeCount =
    (current.area ? 1 : 0) +
    (current.guests ? 1 : 0) +
    (current.type ? 1 : 0) +
    current.amenities.length

  function apply(next: Partial<typeof current>) {
    const p = new URLSearchParams()
    const merged = { ...current, ...next }
    if (merged.area) p.set('area', merged.area)
    if (merged.guests) p.set('guests', merged.guests)
    if (merged.type) p.set('type', merged.type)
    merged.amenities.forEach((a) => p.append('amenity', a))
    router.push(`/katalymata${p.size ? `?${p}` : ''}`, { scroll: false })
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
      <div className="flex flex-wrap items-center gap-2.5">
        <select
          className={select}
          value={current.area}
          onChange={(e) => apply({ area: e.target.value })}
          aria-label="Περιοχή"
        >
          <option value="">Όλη η Αργολίδα</option>
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
          aria-label="Άτομα"
        >
          <option value="">Οποιαδήποτε άτομα</option>
          {[1, 2, 3, 4, 5, 6, 8, 10].map((n) => (
            <option key={n} value={n}>
              {n}+ άτομα
            </option>
          ))}
        </select>

        <select
          className={select}
          value={current.type}
          onChange={(e) => apply({ type: e.target.value })}
          aria-label="Τύπος"
        >
          <option value="">Κάθε τύπος</option>
          {TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="h-11 rounded-xl bg-white px-4 text-[15px] ring-1 ring-inset ring-sand-200 hover:bg-sand-50"
          aria-expanded={open}
        >
          Παροχές
          {current.amenities.length > 0 && (
            <span className="ml-2 rounded-full bg-clay-500 px-1.5 py-0.5 text-xs text-white">
              {current.amenities.length}
            </span>
          )}
        </button>

        {activeCount > 0 && (
          <Button variant="ghost" size="sm" onClick={() => router.push('/katalymata')}>
            Καθαρισμός ({activeCount})
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
