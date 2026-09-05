import Link from 'next/link'

import { ButtonLink, Container } from '@/components/ui'

/**
 * Σελίδα «δεν βρέθηκε».
 *
 * Δεν ξέρουμε τη γλώσσα εδώ — το Next αποδίδει αυτή τη σελίδα εκτός της
 * κανονικής ροής, χωρίς τις κεφαλίδες του middleware. Γι' αυτό εμφανίζονται
 * και οι δύο γλώσσες: καλύτερο από το να δει ένας ξένος επισκέπτης μόνο
 * ελληνικά και να φύγει.
 */
export default function NotFound() {
  return (
    <Container className="py-24 text-center">
      <p className="text-h1 text-clay-500">404</p>
      <h1 className="mt-3 text-h2">Η σελίδα δεν βρέθηκε</h1>
      <p className="mt-1 text-ink-500">This page could not be found.</p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/katalymata">Δες τα καταλύματα</ButtonLink>
        <ButtonLink href="/en/katalymata" variant="secondary">
          Browse in English
        </ButtonLink>
      </div>

      <p className="mt-6 text-sm text-ink-500">
        <Link href="/" className="underline underline-offset-4 hover:text-ink-900">
          Αρχική
        </Link>
      </p>
    </Container>
  )
}
