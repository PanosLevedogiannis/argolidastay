import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'

import { PropertyCard } from '@/components/PropertyCard'
import { SearchBar } from '@/components/SearchBar'
import { ButtonLink, Container, Section, Stat } from '@/components/ui'
import { href, t } from '@/lib/i18n'
import { getLocale } from '@/lib/server-locale'
import { pageAlternates } from '@/lib/seo'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  return {
    title: t(locale, 'home.title'),
    description: t(locale, 'home.subtitle'),
    alternates: pageAlternates('/', locale),
  }
}

export default async function HomePage() {
  const locale = await getLocale()
  const payload = await getPayload({ config })

  const [areas, featured, latest] = await Promise.all([
    payload.find({ collection: 'areas', limit: 20, sort: 'name', depth: 1, locale }),
    payload.find({
      collection: 'properties',
      limit: 6,
      depth: 1,
      locale,
      where: { and: [{ _status: { equals: 'published' } }, { featured: { equals: true } }] },
    }),
    payload.find({
      collection: 'properties',
      limit: 6,
      depth: 1,
      locale,
      sort: '-createdAt',
      where: { _status: { equals: 'published' } },
    }),
  ])

  // Όσο δεν υπάρχουν προβεβλημένα, δείχνουμε τα πιο πρόσφατα — καλύτερα από
  // μια άδεια ενότητα στην αρχική.
  const showcase = featured.docs.length > 0 ? featured.docs : latest.docs
  const areaOptions = areas.docs.map((a) => ({ id: a.id, name: String(a.name), slug: a.slug }))
  const featuredAreas = areas.docs.filter((a) => a.featured).slice(0, 4)

  return (
    <>
      {/* ── Ήρωας ─────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ochre-100 via-sand-100 to-sand-50" />

        <Container className="py-14 sm:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-clay-600">{t(locale, 'home.eyebrow')}</p>
            <h1 className="mt-3 text-h1 text-balance sm:text-display">
              {t(locale, 'home.title')}
            </h1>
            <p className="mt-4 max-w-xl text-lg text-ink-700 text-pretty">
              {t(locale, 'home.subtitle')}
            </p>
          </div>

          <div className="mt-8 max-w-4xl">
            <SearchBar areas={areaOptions} locale={locale} />
          </div>

          <dl className="mt-10 flex flex-wrap gap-x-12 gap-y-6">
            <Stat value={`${latest.totalDocs}`} label={t(locale, 'home.stat.properties')} />
            <Stat value={`${areas.totalDocs}`} label={t(locale, 'home.stat.areas')} />
            <Stat value="0%" label={t(locale, 'home.stat.commission')} />
          </dl>
        </Container>
      </section>

      {/* ── Καταλύματα ────────────────────────────────────────── */}
      {showcase.length > 0 && (
        <Section
          title={t(locale, featured.docs.length > 0 ? 'home.featured' : 'home.recent')}
          subtitle={t(locale, 'home.featuredSub')}
          action={
            <ButtonLink href={href(locale, '/katalymata')} variant="secondary" size="sm">
              {t(locale, 'home.seeAll')}
            </ButtonLink>
          }
        >
          <div className="reveal grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {showcase.map((p) => (
              <PropertyCard key={p.id} property={p} locale={locale} />
            ))}
          </div>
        </Section>
      )}

      {/* ── Περιοχές ──────────────────────────────────────────── */}
      {featuredAreas.length > 0 && (
        <Section
          className="bg-white"
          title={t(locale, 'home.areasTitle')}
          subtitle={t(locale, 'home.areasSub')}
        >
          <div className="reveal grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredAreas.map((area) => {
              const img = typeof area.image === 'object' ? area.image : null
              const src = img?.sizes?.card?.url || img?.url
              return (
                <Link
                  key={area.id}
                  href={href(locale, `/perioches/${area.slug}`)}
                  className="group relative aspect-[3/4] overflow-hidden rounded-card bg-sand-200 shadow-card transition-shadow hover:shadow-lift"
                >
                  {src && (
                    <Image
                      src={src}
                      alt={img?.alt || String(area.name)}
                      fill
                      sizes="(max-width: 640px) 100vw, 25vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-900/75 via-ink-900/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <div className="text-lg font-semibold text-white">{area.name}</div>
                  </div>
                </Link>
              )
            })}
          </div>
        </Section>
      )}

      {/* ── Πώς δουλεύει ──────────────────────────────────────── */}
      <Section title={t(locale, 'home.howTitle')} className="bg-sand-100">
        <ol className="reveal grid gap-6 sm:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <li key={n} className="rounded-card bg-white p-6 shadow-card">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-clay-100 font-semibold text-clay-700">
                {n}
              </span>
              <h3 className="mt-4 text-lg font-semibold">{t(locale, `home.how${n}`)}</h3>
              <p className="mt-1.5 text-sm text-ink-500">{t(locale, `home.how${n}d`)}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* ── Κάλεσμα προς ιδιοκτήτες ───────────────────────────── */}
      <Section className="bg-white">
        <div className="reveal overflow-hidden rounded-card bg-ink-900 px-6 py-12 text-center sm:px-12 sm:py-16">
          <h2 className="text-h2 text-balance text-white sm:text-h1">
            {t(locale, 'home.ownerCta')}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-pretty text-sand-300">
            {t(locale, 'home.ownerCtaSub')}
          </p>
          <ButtonLink href={href(locale, '/kataxorisi')} size="lg" className="mt-7">
            {t(locale, 'nav.listYours')}
          </ButtonLink>
        </div>
      </Section>
    </>
  )
}
