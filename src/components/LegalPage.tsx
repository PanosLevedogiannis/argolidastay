import type { ReactNode } from 'react'

import { Container } from './ui'

/**
 * Κοινή διάταξη για τις σελίδες κειμένου (όροι, απόρρητο, επικοινωνία).
 *
 * Στενή στήλη: μεγάλα μπλοκ κειμένου σε πλήρες πλάτος οθόνης δεν
 * διαβάζονται. Περίπου 70 χαρακτήρες ανά γραμμή είναι το άνετο όριο.
 */
export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string
  updated?: string
  children: ReactNode
}) {
  return (
    <Container className="py-12">
      <div
        className="mx-auto max-w-2xl
          [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-h2
          [&_p]:mb-4 [&_p]:leading-relaxed [&_p]:text-ink-700
          [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5 [&_ul]:text-ink-700
          [&_a]:text-clay-600 [&_a]:underline [&_a]:underline-offset-4
          [&_strong]:font-semibold [&_strong]:text-ink-900"
      >
        <h1 className="text-h1 text-balance">{title}</h1>
        {updated && <p className="mt-2 text-sm text-ink-300">{updated}</p>}
        <div className="mt-8">{children}</div>
      </div>
    </Container>
  )
}
