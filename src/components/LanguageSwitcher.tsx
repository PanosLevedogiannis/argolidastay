'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { switchPath, type Locale } from '@/lib/i18n'

/**
 * Επιλογέας γλώσσας.
 *
 * Είναι σύνδεσμος και όχι κουμπί με JavaScript, για δύο λόγους: το Google
 * ακολουθεί συνδέσμους και έτσι βρίσκει την άλλη έκδοση, και ο επισκέπτης
 * μπορεί να ανοίξει την αγγλική σε νέα καρτέλα.
 *
 * Οδηγεί στην ΙΔΙΑ σελίδα στην άλλη γλώσσα, όχι στην αρχική — όποιος
 * διαβάζει ένα κατάλυμα και αλλάζει γλώσσα θέλει το ίδιο κατάλυμα.
 */
export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname() || '/'
  const other: Locale = locale === 'el' ? 'en' : 'el'
  const label = other === 'en' ? 'English' : 'Ελληνικά'

  return (
    <Link
      href={switchPath(pathname, other)}
      hrefLang={other}
      title={label}
      aria-label={label}
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-2 text-ink-700 transition-colors hover:bg-sand-100 hover:text-ink-900"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        className="h-[18px] w-[18px]"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M3.6 9h16.8M3.6 15h16.8" />
        <path d="M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18" />
      </svg>
      <span className="text-sm font-medium uppercase">{other}</span>
    </Link>
  )
}
