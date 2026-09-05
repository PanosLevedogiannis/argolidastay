import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

// Η Inter καλύπτει σωστά το ελληνικό αλφάβητο· η Geist όχι πλήρως.
const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin', 'greek'],
})

export const metadata: Metadata = {
  title: {
    default: 'ArgolidaStay — Καταλύματα στην Αργολίδα',
    template: '%s | ArgolidaStay',
  },
  description:
    'Κατάλογος καταλυμάτων στην Αργολίδα: Ναύπλιο, Τολό, Επίδαυρος, Πόρτο Χέλι, Ερμιόνη.',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="el" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-slate-900">
        {children}
      </body>
    </html>
  )
}
