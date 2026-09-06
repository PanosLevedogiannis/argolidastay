'use client'

import { useEffect } from 'react'

import { Button, ButtonLink, Container } from '@/components/ui'

/**
 * Όριο σφάλματος του δημόσιου site.
 *
 * Χωρίς αυτό, ένα σφάλμα στον server δείχνει λευκή σελίδα ή τεχνικό μήνυμα.
 * Ο επισκέπτης φεύγει και δεν επιστρέφει.
 *
 * Δεν δείχνουμε τη λεπτομέρεια του σφάλματος: δεν λέει τίποτα στον χρήστη
 * και μπορεί να αποκαλύψει εσωτερικές λεπτομέρειες. Καταγράφεται όμως στην
 * κονσόλα, ώστε να φαίνεται στα logs του server.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Σφάλμα σελίδας:', error)
  }, [error])

  return (
    <Container className="py-24 text-center">
      <h1 className="text-h2">Κάτι πήγε στραβά</h1>
      <p className="mt-2 text-ink-500">Something went wrong on our side.</p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button onClick={reset}>Δοκίμασε ξανά</Button>
        <ButtonLink href="/katalymata" variant="secondary">
          Δες τα καταλύματα
        </ButtonLink>
      </div>

      {error.digest && (
        <p className="mt-8 text-xs text-ink-300">Κωδικός σφάλματος: {error.digest}</p>
      )}
    </Container>
  )
}
