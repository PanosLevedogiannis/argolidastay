import Link from 'next/link'
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import type { Where } from 'payload'
import config from '@payload-config'

import { FilterBar } from '@/components/FilterBar'
import { PropertyCard } from '@/components/PropertyCard'
import { ButtonLink, Container } from '@/components/ui'

export const dynamic = 'force-dynamic'

const PER_PAGE = 12

export const metadata: Metadata = {
  title: 'Καταλύματα στην Αργολίδα',
  description:
    'Δωμάτια, διαμερίσματα και βίλες σε Ναύπλιο, Τολό, Επίδαυρο, Πόρτο Χέλι και Ερμιόνη.',
}

type Params = Promise<{ [k: string]: string | string[] | undefined }>

function one(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v
}

function many(v: string | string[] | undefined): string[] {
  if (!v) return []
  return Array.isArray(v) ? v : [v]
}

export default async function PropertiesPage({ searchParams }: { searchParams: Params }) {
  const sp = await searchParams
  const payload = await getPayload({ config })

  const areaSlug = one(sp.area)
  const guests = one(sp.guests)
  const type = one(sp.type)
  const amenitySlugs = many(sp.amenity)
  const page = Number(one(sp.page) ?? 1) || 1

  const [areas, amenities] = await Promise.all([
    payload.find({ collection: 'areas', limit: 100, sort: 'name' }),
    payload.find({ collection: 'amenities', limit: 100, sort: 'name' }),
  ])

  // Τα φίλτρα ταξιδεύουν στη διεύθυνση ως ονόματα, όχι ως αριθμοί, ώστε ο
  // σύνδεσμος να διαβάζεται και να αντέχει σε αλλαγή βάσης. Εδώ γίνεται η
  // μετάφραση σε αναγνωριστικά.
  const areaId = areas.docs.find((a) => a.slug === areaSlug)?.id
  const amenityIds = amenities.docs
    .filter((a) => amenitySlugs.includes(String(a.id)))
    .map((a) => a.id)

  const conditions: Where[] = [{ _status: { equals: 'published' } }]
  if (areaId) conditions.push({ area: { equals: areaId } })
  if (guests) conditions.push({ guests: { greater_than_equal: Number(guests) } })
  if (type) conditions.push({ type: { equals: type } })
  // Κάθε επιλεγμένη παροχή είναι χωριστός όρος: ζητάμε καταλύματα που τις
  // έχουν ΟΛΕΣ, όχι όποιο έχει έστω μία.
  amenityIds.forEach((id) => conditions.push({ amenities: { contains: id } }))

  const results = await payload.find({
    collection: 'properties',
    where: { and: conditions },
    depth: 1,
    limit: PER_PAGE,
    page,
    sort: ['-featured', '-createdAt'],
  })

  const areaOptions = areas.docs.map((a) => ({ value: a.slug, label: String(a.name) }))
  const amenityOptions = amenities.docs.map((a) => ({
    value: String(a.id),
    label: String(a.name),
  }))

  const activeArea = areas.docs.find((a) => a.slug === areaSlug)

  function pageHref(n: number) {
    const p = new URLSearchParams()
    if (areaSlug) p.set('area', areaSlug)
    if (guests) p.set('guests', guests)
    if (type) p.set('type', type)
    amenitySlugs.forEach((a) => p.append('amenity', a))
    if (n > 1) p.set('page', String(n))
    return `/katalymata${p.size ? `?${p}` : ''}`
  }

  return (
    <Container className="py-10">
      <h1 className="text-h1 text-balance">
        {activeArea ? `Καταλύματα — ${activeArea.name}` : 'Καταλύματα στην Αργολίδα'}
      </h1>
      <p className="mt-2 text-ink-500">
        {results.totalDocs === 0
          ? 'Κανένα αποτέλεσμα'
          : `${results.totalDocs} ${results.totalDocs === 1 ? 'κατάλυμα' : 'καταλύματα'}`}
      </p>

      <div className="mt-6">
        <FilterBar areas={areaOptions} amenities={amenityOptions} />
      </div>

      {results.docs.length === 0 ? (
        <div className="mt-10 rounded-card bg-white p-10 text-center shadow-card">
          <p className="text-lg font-medium">Δεν βρέθηκε κατάλυμα με αυτά τα κριτήρια</p>
          <p className="mx-auto mt-2 max-w-md text-ink-500">
            Δοκίμασε λιγότερα φίλτρα — για παράδειγμα χωρίς συγκεκριμένη περιοχή ή με
            μικρότερο αριθμό ατόμων.
          </p>
          <ButtonLink href="/katalymata" variant="secondary" className="mt-6">
            Δες όλα τα καταλύματα
          </ButtonLink>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.docs.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}

      {results.totalPages > 1 && (
        <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Σελίδες">
          {results.hasPrevPage && (
            <Link
              href={pageHref(page - 1)}
              className="rounded-full bg-white px-4 py-2 text-sm ring-1 ring-sand-300 hover:bg-sand-100"
            >
              Προηγούμενη
            </Link>
          )}
          <span className="px-3 text-sm text-ink-500">
            Σελίδα {page} από {results.totalPages}
          </span>
          {results.hasNextPage && (
            <Link
              href={pageHref(page + 1)}
              className="rounded-full bg-white px-4 py-2 text-sm ring-1 ring-sand-300 hover:bg-sand-100"
            >
              Επόμενη
            </Link>
          )}
        </nav>
      )}
    </Container>
  )
}
