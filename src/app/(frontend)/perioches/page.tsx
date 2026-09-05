import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'

import { Container } from '@/components/ui'
import { href, t } from '@/lib/i18n'
import { getLocale } from '@/lib/server-locale'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Περιοχές της Αργολίδας',
  description:
    'Ναύπλιο, Τολό, Επίδαυρος, Πόρτο Χέλι, Ερμιόνη και οι υπόλοιπες περιοχές της Αργολίδας.',
}

export default async function AreasPage() {
  const locale = await getLocale()
  const payload = await getPayload({ config })

  const areas = await payload.find({ collection: 'areas', limit: 100, sort: 'name', depth: 1, locale })

  // Πόσα καταλύματα έχει η καθεμιά — ο επισκέπτης θέλει να ξέρει αν αξίζει
  // να μπει πριν κάνει το κλικ.
  const counts = await Promise.all(
    areas.docs.map(async (area) => {
      const res = await payload.count({
        collection: 'properties',
        where: { and: [{ area: { equals: area.id } }, { _status: { equals: 'published' } }] },
      })
      return [area.id, res.totalDocs] as const
    }),
  )
  const countBy = Object.fromEntries(counts)

  return (
    <Container className="py-10">
      <h1 className="text-h1 text-balance">{t(locale, 'areas.title')}</h1>
      <p className="mt-2 max-w-2xl text-ink-500 text-pretty">
        {t(locale, 'areas.subtitle')}
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {areas.docs.map((area) => {
          const img = typeof area.image === 'object' ? area.image : null
          const src = img?.sizes?.card?.url || img?.url
          const n = countBy[area.id] ?? 0

          return (
            <Link
              key={area.id}
              href={href(locale, `/perioches/${area.slug}`)}
              className="group overflow-hidden rounded-card bg-white shadow-card transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-lift"
            >
              <div className="relative aspect-[16/10] bg-sand-200">
                {src && (
                  <Image
                    src={src}
                    alt={img?.alt || String(area.name)}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="p-4">
                <h2 className="font-semibold group-hover:text-clay-600">{area.name}</h2>
                <p className="mt-0.5 text-sm text-ink-500">
                  {n === 0
                    ? t(locale, 'areas.empty')
                    : `${n} ${t(locale, n === 1 ? 'list.one' : 'list.many')}`}
                </p>
                {area.description && (
                  <p className="mt-2 line-clamp-2 text-sm text-ink-500">{area.description}</p>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </Container>
  )
}
