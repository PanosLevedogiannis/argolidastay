'use client'

import { useEffect } from 'react'

/**
 * Ήπια εμφάνιση των ενοτήτων καθώς κυλάει η σελίδα.
 *
 * Σκόπιμα δεν χρησιμοποιείται βιβλιοθήκη animation: ένας IntersectionObserver
 * με μια κλάση CSS κάνει την ίδια δουλειά χωρίς να προσθέσει τίποτα στο
 * bundle. Το κοινό είναι σε κινητό με δεδομένα, όχι σε γρήγορο δίκτυο.
 */
export function Reveal() {
  useEffect(() => {
    const targets = document.querySelectorAll('.reveal')
    if (!targets.length) return

    // Αν ο χρήστης έχει ζητήσει λιγότερη κίνηση, τα δείχνουμε αμέσως.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      targets.forEach((el) => el.classList.add('reveal-in'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-in')
            observer.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
    )

    targets.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return null
}
