import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'

import { ContactBox } from '@/components/ContactBox'
import { Container } from '@/components/ui'
import { RichText } from '@/components/RichText'
import type { Amenity, Media, Property } from '@/payload-types'
import { href as localeHref, PROPERTY_TYPES, t, type Locale } from '@/lib/i18n'
import { getLocale } from '@/lib/server-locale'

export const dynamic = 'force-dynamic'

async function getProperty(slug: string, locale?: Locale): Promise<Property | null> {
  const payload = await getPayload({ config })
  const res = await payload.find({
    collection: 'properties',
    where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
    depth: 2,
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
  const property = await getProperty(slug)
  if (!property) return { title: 'Το κατάλυμα δεν βρέθηκε' }

  const area = typeof property.area === 'object' ? property.area : null
  const cover = typeof property.coverImage === 'object' ? property.coverImage : null

  return {
    title: `${property.name}${area ? ` — ${area.name}` : ''}`,
    description: property.shortDescription ?? undefined,
    openGraph: {
      title: String(property.name),
      description: property.shortDescription ?? undefined,
      images: cover?.url ? [{ url: cover.url }] : undefined,
    },
  }
}

/** Απλή στατιστική γραμμή — άτομα, δωμάτια, μπάνια. */
function Facts({ property, locale }: { property: Property; locale: Locale }) {
  const items = [
    { label: t(locale, property.guests === 1 ? 'prop.guest' : 'prop.guests'), value: property.guests },
    { label: t(locale, property.bedrooms === 1 ? 'prop.bedroom' : 'prop.bedrooms'), value: property.bedrooms },
    { label: t(locale, property.beds === 1 ? 'prop.bed' : 'prop.beds'), value: property.beds },
    { label: t(locale, property.bathrooms === 1 ? 'prop.bathroom' : 'prop.bathrooms'), value: property.bathrooms },
    { label: t(locale, 'prop.sqm'), value: property.sizeSqm },
  ].filter((i) => typeof i.value === 'number' && i.value > 0)

  return (
    <dl className="flex flex-wrap gap-x-8 gap-y-3">
      {items.map((i) => (
        <div key={i.label}>
          <dt className="sr-only">{i.label}</dt>
          <dd className="text-lg font-semibold">
            {i.value} <span className="text-sm font-normal text-ink-500">{i.label}</span>
          </dd>
        </div>
      ))}
    </dl>
  )
}

export default async function PropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const locale = await getLocale()
  const property = await getProperty(slug, locale)
  if (!property) notFound()

  const area = typeof property.area === 'object' ? property.area : null
  const cover = typeof property.coverImage === 'object' ? property.coverImage : null
  const gallery = (property.gallery ?? [])
    .map((g) => (typeof g.image === 'object' ? (g.image as Media) : null))
    .filter((m): m is Media => Boolean(m))
  const amenities = (property.amenities ?? []).filter(
    (a): a is Amenity => typeof a === 'object',
  )

  const hasMap = typeof property.latitude === 'number' && typeof property.longitude === 'number'

  return (
    <>
      {/* ── Γκαλερί ───────────────────────────────────────────── */}
      <Container className="pt-6">
        <nav className="mb-4 flex flex-wrap items-center gap-1.5 text-sm text-ink-500">
          <Link href={localeHref(locale, '/katalymata')} className="hover:text-ink-900">
            {t(locale, 'nav.properties')}
          </Link>
          {area && (
            <>
              <span aria-hidden="true">/</span>
              <Link href={localeHref(locale, `/perioches/${area.slug}`)} className="hover:text-ink-900">
                {area.name}
              </Link>
            </>
          )}
        </nav>

        <div className="grid gap-2 sm:grid-cols-4 sm:grid-rows-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-sand-200 sm:col-span-2 sm:row-span-2 sm:aspect-auto">
            {cover?.url && (
              <Image
                src={cover.sizes?.hero?.url || cover.url}
                alt={cover.alt || String(property.name)}
                fill
                priority
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover"
              />
            )}
          </div>

          {gallery.slice(0, 4).map((img) => (
            <div
              key={img.id}
              className="relative hidden aspect-[4/3] overflow-hidden rounded-card bg-sand-200 sm:block"
            >
              <Image
                src={img.sizes?.card?.url || img.url || ''}
                alt={img.alt || String(property.name)}
                fill
                sizes="25vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </Container>

      {/* ── Περιεχόμενο + κουτί επικοινωνίας ──────────────────── */}
      <Container className="py-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          <div>
            <div className="text-sm text-ink-500">
              {PROPERTY_TYPES[locale][property.type] ?? property.type}
              {area && ` ${t(locale, 'prop.inArea')} ${area.name}`}
            </div>
            <h1 className="mt-1 text-h1 text-balance">{property.name}</h1>

            {property.shortDescription && (
              <p className="mt-3 text-lg text-ink-700 text-pretty">{property.shortDescription}</p>
            )}

            <div className="mt-6 border-y border-sand-200 py-5">
              <Facts property={property} locale={locale} />
            </div>

            {property.description && (
              <div className="mt-8">
                <h2 className="text-h2">{t(locale, 'prop.description')}</h2>
                <RichText content={property.description} className="mt-3" />
              </div>
            )}

            {amenities.length > 0 && (
              <div className="mt-10">
                <h2 className="text-h2">{t(locale, 'prop.amenities')}</h2>
                <ul className="mt-4 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                  {amenities.map((a) => (
                    <li key={a.id} className="flex items-center gap-2.5 text-ink-700">
                      <span
                        aria-hidden="true"
                        className="h-1.5 w-1.5 shrink-0 rounded-full bg-olive-500"
                      />
                      {a.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-10">
              <h2 className="text-h2">{t(locale, 'prop.location')}</h2>
              {property.address && <p className="mt-2 text-ink-700">{property.address}</p>}
              {typeof property.distanceToBeach === 'number' && (
                <p className="mt-1 text-sm text-ink-500">
                  {property.distanceToBeach} {t(locale, 'prop.toBeach')}
                </p>
              )}

              {hasMap ? (
                <div className="mt-4 overflow-hidden rounded-card border border-sand-200">
                  {/*
                    OpenStreetMap μέσω ενσωματωμένου πλαισίου: χωρίς κλειδί,
                    χωρίς χρέωση, χωρίς βιβλιοθήκη στο bundle.
                  */}
                  <iframe
                    title={`Χάρτης — ${property.name}`}
                    loading="lazy"
                    className="block h-[320px] w-full border-0"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                      property.longitude! - 0.008
                    },${property.latitude! - 0.005},${property.longitude! + 0.008},${
                      property.latitude! + 0.005
                    }&layer=mapnik&marker=${property.latitude},${property.longitude}`}
                  />
                </div>
              ) : (
                <p className="mt-3 text-sm text-ink-500">
                  {t(locale, 'prop.noMap')}
                </p>
              )}
            </div>

            {property.mite && (
              <p className="mt-10 text-xs text-ink-300">{t(locale, 'prop.mite')}: {property.mite}</p>
            )}
          </div>

          {/* Το κουτί ακολουθεί το σκρολ σε μεγάλες οθόνες ώστε η
              επικοινωνία να είναι πάντα ένα κλικ μακριά. */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <ContactBox
              locale={locale}
              propertyId={property.id}
              priceFrom={property.priceFrom}
              priceTo={property.priceTo}
              priceNote={property.priceNote}
            />
          </aside>
        </div>
      </Container>
    </>
  )
}
