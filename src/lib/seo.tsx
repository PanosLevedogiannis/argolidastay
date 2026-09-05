import type { Metadata } from 'next'

import { href, LOCALES, type Locale } from './i18n'

export const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

/**
 * Κανονική διεύθυνση και εναλλακτικές γλώσσες για μια σελίδα.
 *
 * Το `canonical` λέει στο Google ποια είναι η επίσημη διεύθυνση αυτής της
 * σελίδας — χωρίς αυτό, τα φιλτραρισμένα αποτελέσματα (`?area=tolo&page=2`)
 * μπορεί να θεωρηθούν ξεχωριστές σελίδες με διπλότυπο περιεχόμενο.
 *
 * Το `languages` συνδέει την ελληνική με την αγγλική έκδοση. Αν λείπει, το
 * Google βλέπει δύο άσχετες σελίδες και συχνά αγνοεί τη μία.
 */
export function pageAlternates(path: string, locale: Locale): Metadata['alternates'] {
  return {
    canonical: `${SITE_URL}${href(locale, path)}`,
    languages: Object.fromEntries([
      ...LOCALES.map((l) => [l, `${SITE_URL}${href(l, path)}`]),
      // Ο ίδιος ο κατάλογος αφορά την Ελλάδα, οπότε η ελληνική έκδοση είναι
      // η λογική προεπιλογή για όποιον δεν ταιριάζει σε καμία γλώσσα.
      ['x-default', `${SITE_URL}${href('el', path)}`],
    ]),
  }
}

type PropertyLd = {
  name: string
  description?: string | null
  slug: string
  locale: Locale
  image?: string | null
  areaName?: string | null
  address?: string | null
  latitude?: number | null
  longitude?: number | null
  priceFrom?: number | null
  guests?: number | null
  amenities?: string[]
}

/**
 * Δομημένα δεδομένα για κατάλυμα (schema.org).
 *
 * Επιτρέπουν στο Google να καταλάβει ότι η σελίδα περιγράφει κατάλυμα και
 * όχι οποιοδήποτε κείμενο — και να δείξει πλούσιο αποτέλεσμα με τιμή,
 * τοποθεσία και εικόνα. Για κατάλογο διαμονής είναι από τα λίγα πράγματα
 * που ξεχωρίζουν οπτικά στα αποτελέσματα αναζήτησης.
 */
export function propertyJsonLd(p: PropertyLd) {
  const url = `${SITE_URL}${href(p.locale, `/katalymata/${p.slug}`)}`

  return {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    '@id': url,
    url,
    name: p.name,
    ...(p.description ? { description: p.description } : {}),
    ...(p.image ? { image: p.image.startsWith('http') ? p.image : `${SITE_URL}${p.image}` } : {}),
    address: {
      '@type': 'PostalAddress',
      ...(p.address ? { streetAddress: p.address } : {}),
      ...(p.areaName ? { addressLocality: p.areaName } : {}),
      addressRegion: 'Argolida',
      addressCountry: 'GR',
    },
    ...(typeof p.latitude === 'number' && typeof p.longitude === 'number'
      ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: p.latitude,
            longitude: p.longitude,
          },
        }
      : {}),
    ...(p.priceFrom
      ? { priceRange: `από ${p.priceFrom}€`, makesOffer: {
          '@type': 'Offer',
          priceCurrency: 'EUR',
          price: p.priceFrom,
        } }
      : {}),
    ...(p.guests ? { maximumAttendeeCapacity: p.guests } : {}),
    ...(p.amenities?.length
      ? {
          amenityFeature: p.amenities.map((name) => ({
            '@type': 'LocationFeatureSpecification',
            name,
            value: true,
          })),
        }
      : {}),
  }
}

export function articleJsonLd(a: {
  title: string
  excerpt?: string | null
  slug: string
  locale: Locale
  image?: string | null
  publishedAt?: string | null
  updatedAt?: string | null
}) {
  const url = `${SITE_URL}${href(a.locale, `/odigoi/${a.slug}`)}`
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': url,
    url,
    headline: a.title,
    ...(a.excerpt ? { description: a.excerpt } : {}),
    ...(a.image ? { image: a.image.startsWith('http') ? a.image : `${SITE_URL}${a.image}` } : {}),
    ...(a.publishedAt ? { datePublished: a.publishedAt } : {}),
    ...(a.updatedAt ? { dateModified: a.updatedAt } : {}),
    inLanguage: a.locale,
    publisher: {
      '@type': 'Organization',
      name: 'ArgolidaStay',
      url: SITE_URL,
    },
  }
}

/** Ενσωμάτωση δομημένων δεδομένων στη σελίδα. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // Τα δεδομένα παράγονται από εμάς, όχι από τον χρήστη.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
