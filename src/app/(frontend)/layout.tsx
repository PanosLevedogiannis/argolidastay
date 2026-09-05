import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'

import { Container } from '@/components/ui'
import { Reveal } from '@/components/Reveal'
import './globals.css'

// Η Inter καλύπτει σωστά το ελληνικό αλφάβητο· η Geist όχι πλήρως.
const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin', 'greek'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'ArgolidaStay — Καταλύματα στην Αργολίδα',
    template: '%s | ArgolidaStay',
  },
  description:
    'Δωμάτια, διαμερίσματα και βίλες στην Αργολίδα — Ναύπλιο, Τολό, Επίδαυρος, Πόρτο Χέλι, Ερμιόνη. Επικοινωνήστε απευθείας με τον ιδιοκτήτη.',
}

function Header() {
  const links = [
    { href: '/katalymata', label: 'Καταλύματα' },
    { href: '/perioches', label: 'Περιοχές' },
    { href: '/odigoi', label: 'Οδηγοί' },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-sand-200 bg-sand-50/85 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span
            aria-hidden="true"
            className="grid h-8 w-8 place-items-center rounded-lg bg-clay-500 text-sm font-bold text-white"
          >
            A
          </span>
          <span className="text-[17px]">
            Argolida<span className="text-clay-500">Stay</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full px-3.5 py-2 text-[15px] text-ink-700 transition-colors hover:bg-sand-100 hover:text-ink-900"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/kataxorisi"
          className="rounded-full bg-ink-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-ink-700"
        >
          Καταχώρησε το κατάλυμά σου
        </Link>
      </Container>

      {/* Πλοήγηση για κινητό — κάτω από το λογότυπο ώστε να μη στριμώχνεται. */}
      <nav className="flex gap-1 border-t border-sand-200 px-5 py-2 sm:hidden">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="rounded-full px-3 py-1.5 text-sm text-ink-700 hover:bg-sand-100"
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}

function Footer() {
  return (
    <footer className="mt-auto border-t border-sand-200 bg-sand-100">
      <Container className="py-12">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <div className="font-semibold">
              Argolida<span className="text-clay-500">Stay</span>
            </div>
            <p className="mt-2 max-w-xs text-sm text-ink-500">
              Καταλύματα στην Αργολίδα. Επικοινωνείτε απευθείας με τον ιδιοκτήτη — χωρίς
              μεσάζοντες και χωρίς προμήθειες.
            </p>
          </div>

          <div>
            <div className="text-sm font-medium">Περιήγηση</div>
            <ul className="mt-3 space-y-2 text-sm text-ink-500">
              <li>
                <Link href="/katalymata" className="hover:text-ink-900">
                  Όλα τα καταλύματα
                </Link>
              </li>
              <li>
                <Link href="/perioches" className="hover:text-ink-900">
                  Περιοχές
                </Link>
              </li>
              <li>
                <Link href="/odigoi" className="hover:text-ink-900">
                  Οδηγοί για την Αργολίδα
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-medium">Για ιδιοκτήτες</div>
            <ul className="mt-3 space-y-2 text-sm text-ink-500">
              <li>
                <Link href="/kataxorisi" className="hover:text-ink-900">
                  Καταχώρηση καταλύματος
                </Link>
              </li>
              <li>
                <Link href="/epikoinonia" className="hover:text-ink-900">
                  Επικοινωνία
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-sand-200 pt-6 text-xs text-ink-300">
          © {new Date().getFullYear()} ArgolidaStay. Οι τιμές και η διαθεσιμότητα
          συμφωνούνται απευθείας με τον ιδιοκτήτη κάθε καταλύματος.
        </div>
      </Container>
    </footer>
  )
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="el" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Reveal />
      </body>
    </html>
  )
}
