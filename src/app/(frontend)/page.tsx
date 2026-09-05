import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * Προσωρινή αρχική σελίδα.
 *
 * Δεν είναι σχεδιασμένη — υπάρχει για να επιβεβαιώνει ότι το frontend
 * διαβάζει πραγματικά από τη βάση, και για να βλέπεις τι έχει καταχωρηθεί
 * από το πάνελ. Θα αντικατασταθεί όταν αποφασίσουμε τη σχεδίαση.
 */
export default async function HomePage() {
  const payload = await getPayload({ config })

  const [areas, properties] = await Promise.all([
    payload.find({ collection: 'areas', limit: 20, sort: 'name' }),
    payload.find({
      collection: 'properties',
      limit: 12,
      where: { _status: { equals: 'published' } },
    }),
  ])

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-16">
      <header className="mb-12">
        <h1 className="text-4xl font-semibold tracking-tight">ArgolidaStay</h1>
        <p className="mt-2 text-slate-600">
          Καταλύματα στην Αργολίδα — το site είναι υπό κατασκευή.
        </p>
      </header>

      <section className="mb-12">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-slate-500">
          Περιοχές ({areas.totalDocs})
        </h2>
        {areas.docs.length === 0 ? (
          <p className="text-slate-500">Δεν έχουν καταχωρηθεί περιοχές ακόμα.</p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {areas.docs.map((area) => (
              <li
                key={area.id}
                className="rounded-full border border-slate-200 px-4 py-1.5 text-sm"
              >
                {area.name}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-slate-500">
          Καταλύματα ({properties.totalDocs})
        </h2>
        {properties.docs.length === 0 ? (
          <p className="text-slate-500">
            Δεν έχουν καταχωρηθεί καταλύματα ακόμα. Πρόσθεσε το πρώτο από το
            πάνελ διαχείρισης.
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {properties.docs.map((property) => (
              <li key={property.id} className="rounded-lg border border-slate-200 p-4">
                <h3 className="font-medium">{property.name}</h3>
                {property.shortDescription && (
                  <p className="mt-1 text-sm text-slate-600">
                    {property.shortDescription}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <footer className="border-t border-slate-200 pt-6 text-sm text-slate-500">
        Διαχείριση:{' '}
        <a className="underline underline-offset-4 hover:text-slate-900" href="/admin">
          /admin
        </a>
      </footer>
    </main>
  )
}
