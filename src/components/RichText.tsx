import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'

/**
 * Απόδοση του κειμένου που γράφτηκε στον επεξεργαστή του πάνελ.
 *
 * Το Payload αποθηκεύει δομημένο περιεχόμενο, όχι HTML — έτσι ένας
 * διαχειριστής δεν μπορεί κατά λάθος (ή σκόπιμα) να περάσει script μέσα
 * στη σελίδα. Η μετατροπή σε στοιχεία γίνεται εδώ.
 */
export function RichText({
  content,
  className,
}: {
  content: unknown
  className?: string
}) {
  if (!content) return null

  return (
    <div
      className={[
        'max-w-none leading-relaxed text-ink-700',
        '[&_p]:mb-4 [&_p:last-child]:mb-0',
        '[&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-h2 [&_h2]:text-ink-900',
        '[&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-ink-900',
        '[&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5',
        '[&_li]:mb-1',
        '[&_a]:text-clay-600 [&_a]:underline [&_a]:underline-offset-4',
        '[&_strong]:font-semibold [&_strong]:text-ink-900',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <LexicalRichText data={content as SerializedEditorState} />
    </div>
  )
}
