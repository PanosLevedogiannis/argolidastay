import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'

import { Container, Section, Stat } from '@/components/ui'
import { OwnerForm } from '@/components/OwnerForm'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Καταχώρησε το κατάλυμά σου',
  description:
    'Πρόβαλε το κατάλυμά σου στην Αργολίδα και δέξου τηλεφωνήματα απευθείας από τους επισκέπτες, χωρίς προμήθεια ανά κράτηση.',
}

export default async function OwnerLandingPage() {
  const payload = await getPayload({ config })

  const [properties, areas] = await Promise.all([
    payload.count({ collection: 'properties', where: { _status: { equals: 'published' } } }),
    payload.count({ collection: 'areas' }),
  ])

  return (
    <>
      <section className="bg-gradient-to-b from-ochre-100 via-sand-100 to-sand-50">
        <Container className="py-14 sm:py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-clay-600">Για ιδιοκτήτες</p>
            <h1 className="mt-3 text-h1 text-balance sm:text-display">
              Οι επισκέπτες σε παίρνουν κατευθείαν τηλέφωνο
            </h1>
            <p className="mt-4 text-lg text-ink-700 text-pretty">
              Καμία προμήθεια ανά κράτηση. Καμία μεσολάβηση στις τιμές. Πληρώνεις μία ετήσια
              συνδρομή και τα υπόλοιπα τα κανονίζεις εσύ με τον πελάτη.
            </p>
          </div>

          <dl className="mt-10 flex flex-wrap gap-x-12 gap-y-6">
            <Stat value={`${properties.totalDocs}`} label="καταλύματα στον κατάλογο" />
            <Stat value={`${areas.totalDocs}`} label="περιοχές" />
            <Stat value="0%" label="προμήθεια ανά κράτηση" />
          </dl>
        </Container>
      </section>

      <Section title="Πώς λειτουργεί για σένα">
        <ol className="grid gap-6 sm:grid-cols-3">
          {[
            {
              n: '1',
              t: 'Στέλνεις τα στοιχεία',
              d: 'Συμπληρώνεις τη φόρμα παρακάτω. Σε παίρνουμε τηλέφωνο για φωτογραφίες και λεπτομέρειες.',
            },
            {
              n: '2',
              t: 'Ανεβάζουμε εμείς την καταχώρηση',
              d: 'Δεν χρειάζεται να μάθεις κανένα σύστημα. Τη φτιάχνουμε και σου τη δείχνουμε πριν δημοσιευτεί.',
            },
            {
              n: '3',
              t: 'Δέχεσαι κλήσεις',
              d: 'Όποιος ενδιαφέρεται βλέπει το τηλέφωνό σου ή αφήνει το δικό του και σου έρχεται SMS.',
            },
          ].map((s) => (
            <li key={s.n} className="rounded-card bg-white p-6 shadow-card">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-clay-100 font-semibold text-clay-700">
                {s.n}
              </span>
              <h3 className="mt-4 text-lg font-semibold">{s.t}</h3>
              <p className="mt-1.5 text-sm text-ink-500">{s.d}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section className="bg-white" title="Στείλε μας τα στοιχεία σου">
        <div className="max-w-xl">
          <OwnerForm />
        </div>
      </Section>
    </>
  )
}
