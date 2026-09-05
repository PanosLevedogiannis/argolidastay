import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'

import { PropertyCard } from '@/components/PropertyCard'
import { ButtonLink, Container } from '@/components/ui'
import { href as localeHref, t } from '@/lib/i18n'
import { getLocale } from '@/lib/server-locale'
import { pageAlternates } from '@/lib/seo'
import type { Area } from '@/payload-types'

export const dynamic = 'force-dynamic'

async function getArea(slug: string, locale?: 'el' | 'en'): Promise<Area | null> {
  const payload = await getPayload({ config })
  const res = await payload.find({
    collection: 'areas',
    where: { slug: { equals: slug } },
    depth: 1,
    locale,
    limit: 1,
  })
  return res.docs[0] ?? null
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const locale = await getLocale()
  const area = await getArea(slug, locale)
  if (!area) return { title: locale === 'en' ? 'Area not found' : 'Η περιοχή δεν βρέθηκε' }

  return {
    title: `${t(locale, 'nav.properties')} — ${area.name}`,
    alternates: pageAlternates(`/perioches/${slug}`, locale),
    description:
      area.description ||
      (locale === 'en'
        ? `Rooms, apartments and villas in ${area.name}, Argolida.`
        : `Δωμάτια, διαμερίσματα και βίλες στην περιοχή ${area.name} της Αργολίδας.`),
  }
}

/**
 * Σελίδα προορισμού ανά περιοχή.
 *
 * Υπάρχει κυρίως για το Google: κάποιος που ψάχνει «διαμονή Τολό» πρέπει να
 * βρίσκει σελίδα αφιερωμένη στο Τολό, όχι τη γενική λίστα με φίλτρο. Γι'
 * αυτό οι περιοχές είναι ξεχωριστό collection με δικό τους κείμενο.
 */
export default async function AreaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const locale = await getLocale()
  const area = await getArea(slug, locale)
  if (!area) notFound()
  const payload = await getPayload({ config })

  const [properties, articles] = await Promise.all([
    payload.find({
      collection: 'properties',
      where: { and: [{ area: { equals: area.id } }, { _status: { equals: 'published' } }] },
      depth: 1,
      locale,
      limit: 12,
      sort: ['-featured', '-createdAt'],
    }),
    payload.find({
      collection: 'articles',
      where: { and: [{ area: { equals: area.id } }, { _status: { equals: 'published' } }] },
      depth: 1,
      locale,
      limit: 3,
    }),
  ])

  const img = typeof area.image === 'object' ? area.image : null
  const heroSrc = img?.sizes?.hero?.url || img?.url

  return (
    <>
      {heroSrc && (
        <div className="relative h-56 w-full sm:h-80">
          <Image
            src={heroSrc}
            alt={img?.alt || String(area.name)}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900/60 to-transparent" />
        </div>
      )}

      <Container className="py-10">
        <nav className="mb-3 text-sm text-ink-500">
          <Link href={localeHref(locale, '/perioches')} className="hover:text-ink-900">
            {t(locale, 'nav.areas')}
          </Link>
        </nav>

        <h1 className="text-h1 text-balance">{area.name}</h1>

        {area.description && (
          <p className="mt-3 max-w-2xl text-lg text-ink-700 text-pretty">{area.description}</p>
        )}

        <p className="mt-4 text-ink-500">
          {properties.totalDocs === 0
            ? t(locale, 'areas.noneHere')
            : `${properties.totalDocs} ${t(
                locale,
                properties.totalDocs === 1 ? 'list.one' : 'list.many',
              )}`}
        </p>

        {properties.docs.length > 0 && (
          <>
            <div className="reveal-stagger mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {properties.docs.map((p) => (
                <PropertyCard key={p.id} property={p} locale={locale} />
              ))}
            </div>

            {properties.totalDocs > properties.docs.length && (
              <div className="mt-8 text-center">
                <ButtonLink
                  href={localeHref(locale, `/katalymata?area=${area.slug}`)}
                  variant="secondary"
                >
                  {t(locale, 'areas.seeAllIn', { n: properties.totalDocs })}
                </ButtonLink>
              </div>
            )}
          </>
        )}

        {articles.docs.length > 0 && (
          <section className="mt-16">
            <h2 className="text-h2">{t(locale, 'areas.guidesFor', { name: String(area.name) })}</h2>
            <ul className="mt-4 space-y-3">
              {articles.docs.map((a) => (
                <li key={a.id}>
                  <Link
                    href={localeHref(locale, `/odigoi/${a.slug}`)}
                    className="block rounded-card bg-white p-4 shadow-card transition-shadow hover:shadow-lift"
                  >
                    <div className="font-medium">{a.title}</div>
                    {a.excerpt && (
                      <p className="mt-1 line-clamp-2 text-sm text-ink-500">{a.excerpt}</p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </Container>
    </>
  )
}
