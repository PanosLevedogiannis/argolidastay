'use client'

import { usePathname } from 'next/navigation'

import { switchPath, type Locale } from '@/lib/i18n'

/**
 * Επιλογέας γλώσσας.
 *
 * Χρησιμοποιείται κανονικό `<a>` και όχι το `<Link>` του Next: η αλλαγή
 * γλώσσας φορτώνει τη σελίδα από την αρχή. Είναι σκόπιμο — η γλώσσα
 * καθορίζεται από τον server, οπότε η πλήρης φόρτωση εγγυάται ότι όλα
 * (κείμενα, μεταδεδομένα, `<html lang>`) έρχονται στη νέα γλώσσα, χωρίς να
 * μείνει τίποτα από την προηγούμενη στη μνήμη του browser.
 *
 * Το κόστος είναι μια κανονική φόρτωση αντί για άμεση εναλλαγή, αλλά η
 * αλλαγή γλώσσας γίνεται μία φορά ανά επίσκεψη. Ο browser δείχνει τον δικό
 * του δείκτη φόρτωσης, οπότε ο χρήστης βλέπει αμέσως ότι κάτι συμβαίνει.
 *
 * Είναι επίσης σύνδεσμος και όχι κουμπί, ώστε το Google να τον ακολουθεί
 * και να βρίσκει την άλλη έκδοση.
 */
export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname() || '/'
  const other: Locale = locale === 'el' ? 'en' : 'el'
  const label = other === 'en' ? 'English' : 'Ελληνικά'

  return (
    <a
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
    </a>
  )
}
