import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'

import { Container } from '@/components/ui'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Οδηγοί για την Αργολίδα',
  description:
    'Παραλίες, αξιοθέατα και πρακτικές συμβουλές για το Ναύπλιο, την Επίδαυρο και όλη την Αργολίδα.',
}

export default async function ArticlesPage() {
  const payload = await getPayload({ config })

  const articles = await payload.find({
    collection: 'articles',
    where: { _status: { equals: 'published' } },
    depth: 1,
    limit: 24,
    sort: '-publishedAt',
  })

  return (
    <Container className="py-10">
      <h1 className="text-h1 text-balance">Οδηγοί για την Αργολίδα</h1>
      <p className="mt-2 max-w-2xl text-ink-500 text-pretty">
        Τι να δεις, πού να κολυμπήσεις και πώς να κινηθείς.
      </p>

      {articles.docs.length === 0 ? (
        <p className="mt-10 rounded-card bg-white p-10 text-center text-ink-500 shadow-card">
          Δεν έχουν δημοσιευτεί οδηγοί ακόμα.
        </p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.docs.map((a) => {
            const img = typeof a.coverImage === 'object' ? a.coverImage : null
            const src = img?.sizes?.card?.url || img?.url
            const area = typeof a.area === 'object' ? a.area : null

            return (
              <Link
                key={a.id}
                href={`/odigoi/${a.slug}`}
                className="group overflow-hidden rounded-card bg-white shadow-card transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-lift"
              >
                <div className="relative aspect-[16/10] bg-sand-200">
                  {src && (
                    <Image
                      src={src}
                      alt={img?.alt || String(a.title)}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="p-4">
                  {area && <div className="text-xs text-ink-500">{area.name}</div>}
                  <h2 className="mt-1 font-semibold leading-snug group-hover:text-clay-600">
                    {a.title}
                  </h2>
                  {a.excerpt && (
                    <p className="mt-1.5 line-clamp-2 text-sm text-ink-500">{a.excerpt}</p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </Container>
  )
}
