'use client'

import { useEffect } from 'react'

/**
 * Ήπια εμφάνιση καθώς κυλάει η σελίδα.
 *
 * Δύο επίπεδα: ένα στοιχείο με `.reveal` εμφανίζεται μόνο του, ενώ ένα με
 * `.reveal-stagger` εμφανίζει τα παιδιά του διαδοχικά. Η κλιμάκωση έχει
 * σημασία — έξι κάρτες που εμφανίζονται ταυτόχρονα μοιάζουν με αναλαμπή,
 * ενώ με μικρή διαφορά φαίνεται ότι η σελίδα χτίζεται.
 *
 * Σκόπιμα δεν χρησιμοποιείται βιβλιοθήκη animation: ένας IntersectionObserver
 * με κλάσεις CSS κάνει την ίδια δουλειά χωρίς να προσθέσει τίποτα στο
 * bundle. Το κοινό είναι τουρίστες σε κινητό με δεδομένα.
 *
 * Η καθυστέρηση ανά παιδί είναι φραγμένη ώστε ένα μεγάλο πλέγμα να μην
 * αργεί δευτερόλεπτα να ολοκληρωθεί.
 */
const STEP_MS = 70
const MAX_DELAY_MS = 400

export function Reveal() {
  useEffect(() => {
    const solo = Array.from(document.querySelectorAll<HTMLElement>('.reveal'))
    const groups = Array.from(document.querySelectorAll<HTMLElement>('.reveal-stagger'))
    if (!solo.length && !groups.length) return

    const showAll = () => {
      solo.forEach((el) => el.classList.add('reveal-in'))
      groups.forEach((g) =>
        Array.from(g.children).forEach((c) => c.classList.add('reveal-in')),
      )
    }

    // Όποιος έχει ζητήσει λιγότερη κίνηση τα βλέπει αμέσως.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      showAll()
      return
    }

    // Τα παιδιά ομάδας ξεκινούν κρυμμένα· τα κρύβουμε εδώ και όχι στο CSS
    // ώστε χωρίς JavaScript να παραμένουν ορατά.
    groups.forEach((g) =>
      Array.from(g.children).forEach((c) => c.classList.add('reveal')),
    )

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const el = entry.target as HTMLElement

          if (el.classList.contains('reveal-stagger')) {
            Array.from(el.children).forEach((child, i) => {
              const delay = Math.min(i * STEP_MS, MAX_DELAY_MS)
              ;(child as HTMLElement).style.transitionDelay = `${delay}ms`
              child.classList.add('reveal-in')
            })
          } else {
            el.classList.add('reveal-in')
          }

          observer.unobserve(el)
        })
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    )

    solo.forEach((el) => observer.observe(el))
    groups.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return null
}
