import Image from 'next/image'
import Link from 'next/link'

import type { Property } from '@/payload-types'

const TYPE_LABELS: Record<string, string> = {
  apartment: 'Διαμέρισμα',
  studio: 'Στούντιο',
  maisonette: 'Μεζονέτα',
  villa: 'Βίλα',
  house: 'Μονοκατοικία',
  room: 'Δωμάτιο',
  hotel: 'Ξενοδοχείο',
  guesthouse: 'Ξενώνας',
}

/**
 * Μορφοποίηση τιμής.
 *
 * Ο κατάλογος δεν κλείνει κρατήσεις, οπότε η τιμή είναι ενδεικτική και
 * μπορεί να λείπει εντελώς. Όταν λείπει, γράφουμε κάτι που καλεί σε
 * επικοινωνία αντί για κενό — ένα κενό μοιάζει με σφάλμα.
 */
function priceLabel(from?: number | null, to?: number | null): string {
  if (from && to && from !== to) return `${from}–${to}€`
  if (from) return `από ${from}€`
  if (to) return `έως ${to}€`
  return 'Ρωτήστε τιμή'
}

export function PropertyCard({ property }: { property: Property }) {
  const cover = typeof property.coverImage === 'object' ? property.coverImage : null
  const area = typeof property.area === 'object' ? property.area : null
  const src = cover?.sizes?.card?.url || cover?.url

  return (
    <Link
      href={`/katalymata/${property.slug}`}
      className="group block overflow-hidden rounded-card bg-white shadow-card transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-sand-200">
        {src ? (
          <Image
            src={src}
            alt={cover?.alt || String(property.name)}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          />
        ) : null}

        {property.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-medium text-clay-700 shadow-sm backdrop-blur">
            Προτεινόμενο
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 text-xs text-ink-500">
          <span>{TYPE_LABELS[property.type] ?? property.type}</span>
          {area?.name && (
            <>
              <span aria-hidden="true">·</span>
              <span>{area.name}</span>
            </>
          )}
        </div>

        <h3 className="mt-1.5 font-semibold leading-snug text-ink-900 group-hover:text-clay-600">
          {property.name}
        </h3>

        {property.shortDescription && (
          <p className="mt-1.5 line-clamp-2 text-sm text-ink-500">{property.shortDescription}</p>
        )}

        <div className="mt-3 flex items-baseline justify-between border-t border-sand-200 pt-3">
          <span className="font-semibold text-ink-900">
            {priceLabel(property.priceFrom, property.priceTo)}
          </span>
          <span className="text-sm text-ink-500">
            {property.guests} {property.guests === 1 ? 'άτομο' : 'άτομα'}
          </span>
        </div>
      </div>
    </Link>
  )
}
