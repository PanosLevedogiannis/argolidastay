import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { headers } from 'next/headers'

import { Container } from '@/components/ui'
import { Reveal } from '@/components/Reveal'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { href, t, type Locale } from '@/lib/i18n'
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
    'Δωμάτια, διαμερίσματα και βίλες στην Αργολίδα — Ναύπλιο, Τολό, Επίδαυρος, Πόρτο Χέλι, Ερμιόνη.',
}

function Header({ locale }: { locale: Locale }) {
  const links = [
    { href: href(locale, '/katalymata'), label: t(locale, 'nav.properties') },
    { href: href(locale, '/perioches'), label: t(locale, 'nav.areas') },
    { href: href(locale, '/odigoi'), label: t(locale, 'nav.guides') },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-sand-200 bg-sand-50/85 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          href={href(locale, '/')}
          className="flex items-center gap-2 font-semibold tracking-tight"
        >
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

        <div className="flex items-center gap-1">
          <LanguageSwitcher locale={locale} />
          <Link
            href={href(locale, '/kataxorisi')}
            className="hidden rounded-full bg-ink-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-ink-700 sm:inline-block"
          >
            {t(locale, 'nav.listYours')}
          </Link>
        </div>
      </Container>

      {/* Πλοήγηση για κινητό — κάτω από το λογότυπο ώστε να μη στριμώχνεται. */}
      <nav className="flex gap-1 overflow-x-auto border-t border-sand-200 px-5 py-2 sm:hidden">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="shrink-0 rounded-full px-3 py-1.5 text-sm text-ink-700 hover:bg-sand-100"
          >
            {l.label}
          </Link>
        ))}
        <Link
          href={href(locale, '/kataxorisi')}
          className="shrink-0 rounded-full px-3 py-1.5 text-sm font-medium text-clay-600"
        >
          {t(locale, 'nav.listYours')}
        </Link>
      </nav>
    </header>
  )
}

function Footer({ locale }: { locale: Locale }) {
  return (
    <footer className="mt-auto border-t border-sand-200 bg-sand-100">
      <Container className="py-12">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <div className="font-semibold">
              Argolida<span className="text-clay-500">Stay</span>
            </div>
            <p className="mt-2 max-w-xs text-sm text-ink-500">{t(locale, 'footer.tagline')}</p>
          </div>

          <div>
            <div className="text-sm font-medium">{t(locale, 'footer.browse')}</div>
            <ul className="mt-3 space-y-2 text-sm text-ink-500">
              <li>
                <Link href={href(locale, '/katalymata')} className="hover:text-ink-900">
                  {t(locale, 'footer.allProperties')}
                </Link>
              </li>
              <li>
                <Link href={href(locale, '/perioches')} className="hover:text-ink-900">
                  {t(locale, 'nav.areas')}
                </Link>
              </li>
              <li>
                <Link href={href(locale, '/odigoi')} className="hover:text-ink-900">
                  {t(locale, 'nav.guides')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-medium">{t(locale, 'footer.forOwners')}</div>
            <ul className="mt-3 space-y-2 text-sm text-ink-500">
              <li>
                <Link href={href(locale, '/kataxorisi')} className="hover:text-ink-900">
                  {t(locale, 'footer.listing')}
                </Link>
              </li>
              <li>
                <Link href={href(locale, '/epikoinonia')} className="hover:text-ink-900">
                  {t(locale, 'footer.contact')}
                </Link>
              </li>
              <li>
                <Link href={href(locale, '/oroi-chrisis')} className="hover:text-ink-900">
                  {t(locale, 'footer.terms')}
                </Link>
              </li>
              <li>
                <Link href={href(locale, '/prosopika-dedomena')} className="hover:text-ink-900">
                  {t(locale, 'footer.privacy')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-sand-200 pt-6 text-xs text-ink-300">
          © {new Date().getFullYear()} ArgolidaStay. {t(locale, 'footer.legal')}
        </div>
      </Container>
    </footer>
  )
}

export default async function RootLayout({ children }: LayoutProps<'/'>) {
  // Η γλώσσα προκύπτει από τη διαδρομή, που δίνει το middleware σε κεφαλίδα.
  const pathname = (await headers()).get('x-pathname') ?? '/'
  const locale: Locale = pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'el'

  return (
    <html lang={locale} className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Header locale={locale} />
        <main className="flex-1">{children}</main>
        <Footer locale={locale} />
        <Reveal />
      </body>
    </html>
  )
}
