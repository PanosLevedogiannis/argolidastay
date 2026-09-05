import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'

import { LOCALES, href } from '@/lib/i18n'

export const dynamic = 'force-dynamic'

const SITE = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

/**
 * Χάρτης του site για τις μηχανές αναζήτησης.
 *
 * Κάθε σελίδα δηλώνεται μία φορά, με τις εκδόσεις της σε κάθε γλώσσα
 * συνδεδεμένες μεταξύ τους (`alternates.languages`). Χωρίς αυτή τη σύνδεση
 * το Google βλέπει δύο άσχετες σελίδες με παρόμοιο περιεχόμενο και μπορεί
 * να θεωρήσει τη μία διπλότυπη — δηλαδή να αγνοήσει τη μισή δουλειά της
 * μετάφρασης.
 *
 * Παράγεται δυναμικά ώστε κάθε νέο κατάλυμα να μπαίνει αυτόματα, χωρίς να
 * θυμηθεί κανείς τίποτα.
 */
function alternates(path: string) {
  return {
    languages: Object.fromEntries(
      LOCALES.map((l) => [l, `${SITE}${href(l, path)}`]),
    ) as Record<string, string>,
  }
}

function entry(path: string, changeFrequency: 'daily' | 'weekly' | 'monthly', priority: number) {
  return {
    url: `${SITE}${href('el', path)}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
    alternates: alternates(path),
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config })

  const [properties, areas, articles] = await Promise.all([
    payload.find({
      collection: 'properties',
      where: { _status: { equals: 'published' } },
      limit: 1000,
      depth: 0,
      select: { slug: true, updatedAt: true },
    }),
    payload.find({ collection: 'areas', limit: 200, depth: 0, select: { slug: true } }),
    payload.find({
      collection: 'articles',
      where: { _status: { equals: 'published' } },
      limit: 500,
      depth: 0,
      select: { slug: true, updatedAt: true },
    }),
  ])

  return [
    entry('/', 'daily', 1),
    entry('/katalymata', 'daily', 0.9),
    entry('/perioches', 'weekly', 0.8),
    entry('/odigoi', 'weekly', 0.7),
    entry('/kataxorisi', 'monthly', 0.6),

    // Οι σελίδες περιοχών έχουν υψηλή προτεραιότητα: είναι αυτές που πιάνουν
    // αναζητήσεις τύπου «διαμονή Ναύπλιο».
    ...areas.docs.map((a) => entry(`/perioches/${a.slug}`, 'weekly', 0.8)),

    ...properties.docs.map((p) => ({
      ...entry(`/katalymata/${p.slug}`, 'weekly' as const, 0.7),
      lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
    })),

    ...articles.docs.map((a) => ({
      ...entry(`/odigoi/${a.slug}`, 'monthly' as const, 0.6),
      lastModified: a.updatedAt ? new Date(a.updatedAt) : new Date(),
    })),
  ]
}
