import type { MetadataRoute } from 'next'

const SITE = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

/**
 * Οδηγίες προς τις μηχανές αναζήτησης.
 *
 * Το πάνελ και το API αποκλείονται: δεν έχουν λόγο να ευρετηριαστούν και
 * το `/admin` δεν πρέπει καν να εμφανίζεται σε αποτελέσματα.
 *
 * Τα φιλτραρισμένα αποτελέσματα (`/katalymata?area=...`) ΕΠΙΤΡΕΠΟΝΤΑΙ,
 * γιατί ακριβώς αυτές οι σελίδες πιάνουν αναζητήσεις τύπου «βίλα Τολό».
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api/'],
    },
    sitemap: `${SITE}/sitemap.xml`,
  }
}
