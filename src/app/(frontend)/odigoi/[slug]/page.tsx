import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'

import { PropertyCard } from '@/components/PropertyCard'
import { RichText } from '@/components/RichText'
import { Container } from '@/components/ui'
import { href as localeHref, t } from '@/lib/i18n'
import { getLocale } from '@/lib/server-locale'
import type { Article, Property } from '@/payload-types'

export const dynamic = 'force-dynamic'

async function getArticle(slug: string): Promise<Article | null> {
  const payload = await getPayload({ config })
  const res = await payload.find({
    collection: 'articles',
    where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
    depth: 2,
    limit: 1,
  })
  return res.docs[0] ?? null
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) return { title: 'Ο οδηγός δεν βρέθηκε' }

  const cover = typeof article.coverImage === 'object' ? article.coverImage : null
  return {
    title: String(article.title),
    description: article.excerpt ?? undefined,
    openGraph: {
      title: String(article.title),
      description: article.excerpt ?? undefined,
      images: cover?.url ? [{ url: cover.url }] : undefined,
      type: 'article',
    },
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) notFound()

  const locale = await getLocale()
  const cover = typeof article.coverImage === 'object' ? article.coverImage : null
  const area = typeof article.area === 'object' ? article.area : null
  const related = (article.relatedProperties ?? []).filter(
    (p): p is Property => typeof p === 'object',
  )

  return (
    <article>
      {cover?.url && (
        <div className="relative h-56 w-full sm:h-96">
          <Image
            src={cover.sizes?.hero?.url || cover.url}
            alt={cover.alt || String(article.title)}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      )}

      <Container className="py-10">
        <div className="mx-auto max-w-2xl">
          <nav className="mb-3 flex flex-wrap gap-1.5 text-sm text-ink-500">
            <Link href={localeHref(locale, '/odigoi')} className="hover:text-ink-900">
              {t(locale, 'nav.guides')}
            </Link>
            {area && (
              <>
                <span aria-hidden="true">/</span>
                <Link href={localeHref(locale, `/perioches/${area.slug}`)} className="hover:text-ink-900">
                  {area.name}
                </Link>
              </>
            )}
          </nav>

          <h1 className="text-h1 text-balance">{article.title}</h1>

          {article.excerpt && (
            <p className="mt-3 text-lg text-ink-700 text-pretty">{article.excerpt}</p>
          )}

          {article.body && <RichText content={article.body} className="mt-8" />}
        </div>

        {related.length > 0 && (
          <section className="mt-16 border-t border-sand-200 pt-10">
            <h2 className="text-h2">{t(locale, 'guides.related')}</h2>
            <p className="mt-1 text-ink-500">{t(locale, 'guides.relatedSub')}</p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <PropertyCard key={p.id} property={p} locale={locale} />
              ))}
            </div>
          </section>
        )}
      </Container>
    </article>
  )
}
