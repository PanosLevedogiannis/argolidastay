'use client'

import Image from 'next/image'
import { useState } from 'react'

import type { Media } from '@/payload-types'
import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n'

/**
 * Γκαλερί φωτογραφιών καταλύματος.
 *
 * Η επιλεγμένη φωτογραφία αλλάζει με ομαλό σβήσιμο αντί για απότομη
 * αντικατάσταση, και οι μικρογραφίες δείχνουν ποια είναι ενεργή. Δεν
 * ανοίγει προβολή πλήρους οθόνης: σε κινητό — που είναι το κύριο κοινό —
 * ένα lightbox συνήθως μπερδεύει περισσότερο απ' όσο βοηθά.
 *
 * Οι μικρογραφίες είναι κουμπιά και όχι εικόνες με onClick, ώστε να
 * δουλεύουν με πληκτρολόγιο.
 */
export function Gallery({
  images,
  alt,
  locale = DEFAULT_LOCALE,
}: {
  images: Media[]
  alt: string
  locale?: Locale
}) {
  const [active, setActive] = useState(0)
  const current = images[active] ?? images[0]

  if (!current) return null

  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden rounded-card bg-sand-200 sm:aspect-[2/1]">
        {images.map((img, i) => (
          <Image
            key={img.id}
            src={img.sizes?.hero?.url || img.url || ''}
            alt={img.alt || alt}
            fill
            priority={i === 0}
            sizes="(max-width: 1024px) 100vw, 1200px"
            className={
              'object-cover transition-opacity duration-500 ' +
              (i === active ? 'opacity-100' : 'opacity-0')
            }
          />
        ))}

        {images.length > 1 && (
          <div className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-ink-900/70 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
            {active + 1} / {images.length}
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActive(i)}
              aria-label={
                locale === 'en' ? `Photo ${i + 1}` : `Φωτογραφία ${i + 1}`
              }
              aria-current={i === active}
              className={
                'relative h-16 w-24 shrink-0 overflow-hidden rounded-lg transition-all duration-200 sm:h-20 sm:w-32 ' +
                (i === active
                  ? 'ring-2 ring-clay-500 ring-offset-2 ring-offset-sand-50'
                  : 'opacity-65 hover:opacity-100')
              }
            >
              <Image
                src={img.sizes?.thumbnail?.url || img.url || ''}
                alt=""
                fill
                sizes="128px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
