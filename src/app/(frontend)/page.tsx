import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'

import { PropertyCard } from '@/components/PropertyCard'
import { SearchBar } from '@/components/SearchBar'
import { ButtonLink, Container, Section, Stat } from '@/components/ui'

export default async function HomePage() {
  const payload = await getPayload({ config })

  const [areas, featured, latest] = await Promise.all([
    payload.find({ collection: 'areas', limit: 20, sort: 'name', depth: 1 }),
    payload.find({
      collection: 'properties',
      limit: 6,
      depth: 1,
      where: { and: [{ _status: { equals: 'published' } }, { featured: { equals: true } }] },
    }),
    payload.find({
      collection: 'properties',
      limit: 6,
      depth: 1,
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
            <p className="text-sm font-medium text-clay-600">Αργολίδα</p>
            <h1 className="mt-3 text-h1 text-balance sm:text-display">
              Βρες πού θα μείνεις, μίλα κατευθείαν με τον ιδιοκτήτη
            </h1>
            <p className="mt-4 max-w-xl text-lg text-ink-700 text-pretty">
              Δωμάτια, διαμερίσματα και βίλες σε Ναύπλιο, Τολό, Επίδαυρο και όλη την Αργολίδα.
              Χωρίς μεσάζοντες, χωρίς προμήθειες.
            </p>
          </div>

          <div className="mt-8 max-w-4xl">
            <SearchBar areas={areaOptions} />
          </div>

          <dl className="mt-10 flex flex-wrap gap-x-12 gap-y-6">
            <Stat value={`${latest.totalDocs}`} label="καταλύματα" />
            <Stat value={`${areas.totalDocs}`} label="περιοχές" />
            <Stat value="0%" label="προμήθεια" />
          </dl>
        </Container>
      </section>

      {/* ── Καταλύματα ────────────────────────────────────────── */}
      {showcase.length > 0 && (
        <Section
          title={featured.docs.length > 0 ? 'Προτεινόμενα καταλύματα' : 'Πρόσφατες καταχωρήσεις'}
          subtitle="Διαλεγμένα από όλη την Αργολίδα."
          action={
            <ButtonLink href="/katalymata" variant="secondary" size="sm">
              Δες όλα
            </ButtonLink>
          }
        >
          <div className="reveal grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {showcase.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </Section>
      )}

      {/* ── Περιοχές ──────────────────────────────────────────── */}
      {featuredAreas.length > 0 && (
        <Section
          className="bg-white"
          title="Πού θέλεις να μείνεις;"
          subtitle="Κάθε γωνιά της Αργολίδας έχει τον δικό της χαρακτήρα."
        >
          <div className="reveal grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredAreas.map((area) => {
              const img = typeof area.image === 'object' ? area.image : null
              const src = img?.sizes?.card?.url || img?.url
              return (
                <Link
                  key={area.id}
                  href={`/perioches/${area.slug}`}
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
      <Section title="Πώς δουλεύει" className="bg-sand-100">
        <ol className="reveal grid gap-6 sm:grid-cols-3">
          {[
            {
              n: '1',
              t: 'Ψάξε',
              d: 'Φιλτράρισε με περιοχή, άτομα και τύπο καταλύματος μέχρι να βρεις κάτι που σου ταιριάζει.',
            },
            {
              n: '2',
              t: 'Επικοινώνησε',
              d: 'Δες το τηλέφωνο του ιδιοκτήτη ή άφησε το δικό σου για να σε καλέσει εκείνος.',
            },
            {
              n: '3',
              t: 'Κλείσε απευθείας',
              d: 'Συμφωνείτε τιμή και ημερομηνίες μεταξύ σας. Το site δεν παίρνει προμήθεια.',
            },
          ].map((step) => (
            <li key={step.n} className="rounded-card bg-white p-6 shadow-card">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-clay-100 font-semibold text-clay-700">
                {step.n}
              </span>
              <h3 className="mt-4 text-lg font-semibold">{step.t}</h3>
              <p className="mt-1.5 text-sm text-ink-500">{step.d}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* ── Κάλεσμα προς ιδιοκτήτες ───────────────────────────── */}
      <Section className="bg-white">
        <div className="reveal overflow-hidden rounded-card bg-ink-900 px-6 py-12 text-center sm:px-12 sm:py-16">
          <h2 className="text-h2 text-balance text-white sm:text-h1">
            Έχεις κατάλυμα στην Αργολίδα;
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-pretty text-sand-300">
            Καταχώρησέ το και δέξου τηλεφωνήματα απευθείας από τους επισκέπτες. Χωρίς
            προμήθεια ανά κράτηση.
          </p>
          <ButtonLink href="/kataxorisi" size="lg" className="mt-7">
            Καταχώρησε το κατάλυμά σου
          </ButtonLink>
        </div>
      </Section>
    </>
  )
}
