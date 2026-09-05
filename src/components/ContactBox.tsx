'use client'

import { useState } from 'react'

import { Button } from './ui'
import { DEFAULT_LOCALE, t, type Locale } from '@/lib/i18n'

type Revealed = { phone: string; viber: string; name: string | null }

function priceLabel(locale: Locale, from?: number | null, to?: number | null) {
  if (from && to && from !== to) return `${from}–${to}€`
  if (from) return locale === 'en' ? `from ${from}€` : `από ${from}€`
  if (to) return locale === 'en' ? `up to ${to}€` : `έως ${to}€`
  return null
}

/**
 * Το κουτί επικοινωνίας της σελίδας καταλύματος.
 *
 * Δύο δρόμοι, σκόπιμα και οι δύο:
 *  - «Δες τηλέφωνο» για όποιον θέλει να πάρει τώρα,
 *  - φόρμα για όποιον προτιμά να τον καλέσουν.
 *
 * Και οι δύο καταγράφονται, ώστε ο ιδιοκτήτης να βλέπει πόσο ενδιαφέρον
 * έφερε η καταχώρησή του.
 */
export function ContactBox({
  propertyId,
  priceFrom,
  priceTo,
  priceNote,
  locale = DEFAULT_LOCALE,
}: {
  propertyId: number | string
  priceFrom?: number | null
  priceTo?: number | null
  priceNote?: string | null
  locale?: Locale
}) {
  const [revealed, setRevealed] = useState<Revealed | null>(null)
  const [revealing, setRevealing] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function reveal() {
    setRevealing(true)
    setError(null)
    try {
      const res = await fetch(`/api/properties/${propertyId}/reveal-phone`, { method: 'POST' })
      if (!res.ok) throw new Error()
      setRevealed(await res.json())
    } catch {
      setError(t(locale, 'contact.error'))
    } finally {
      setRevealing(false)
    }
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSending(true)
    setError(null)

    const data = new FormData(e.currentTarget)
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          property: propertyId,
          type: 'callback',
          visitorName: data.get('name'),
          visitorPhone: data.get('phone'),
          checkIn: data.get('checkIn') || undefined,
          checkOut: data.get('checkOut') || undefined,
          guests: data.get('guests') ? Number(data.get('guests')) : undefined,
          message: data.get('message') || undefined,
          locale,
        }),
      })
      if (!res.ok) throw new Error()
      setSent(true)
    } catch {
      setError(t(locale, 'contact.error'))
    } finally {
      setSending(false)
    }
  }

  const price = priceLabel(locale, priceFrom, priceTo)
  const field =
    'h-11 w-full rounded-xl border-0 bg-sand-50 px-3.5 text-[15px] ' +
    'ring-1 ring-inset ring-sand-200 focus:ring-2 focus:ring-clay-500'

  return (
    <div className="rounded-card bg-white p-5 shadow-panel">
      <div className="border-b border-sand-200 pb-4">
        {price ? (
          <>
            <div className="text-2xl font-semibold">{price}</div>
            <div className="mt-0.5 text-sm text-ink-500">
              {priceNote || t(locale, 'contact.priceNote')}
            </div>
          </>
        ) : (
          <div className="text-lg font-semibold">{t(locale, 'contact.askPrice')}</div>
        )}
      </div>

      <div className="pt-4">
        {revealed ? (
          <div className="rounded-xl bg-olive-100 p-4 text-center">
            <div className="text-xs text-ink-500">
              {revealed.name
                ? `${t(locale, 'contact.phoneOf')} — ${revealed.name}`
                : t(locale, 'contact.phone')}
            </div>
            <a
              href={`tel:${revealed.phone.replace(/\s/g, '')}`}
              className="mt-1 block text-xl font-semibold tracking-tight text-ink-900 underline-offset-4 hover:underline"
            >
              {revealed.phone}
            </a>
            <a
              href={`viber://chat?number=${encodeURIComponent(revealed.viber.replace(/\s/g, ''))}`}
              className="mt-2 inline-block text-sm text-clay-600 underline underline-offset-4"
            >
              {t(locale, 'contact.viber')}
            </a>
          </div>
        ) : (
          <Button onClick={reveal} disabled={revealing} className="w-full" size="lg">
            {revealing ? t(locale, 'contact.loading') : t(locale, 'contact.showPhone')}
          </Button>
        )}

        {!sent && (
          <>
            <div className="my-3 text-center text-xs text-ink-300">{t(locale, 'contact.or')}</div>

            {!showForm ? (
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => setShowForm(true)}
              >
                {t(locale, 'contact.callMe')}
              </Button>
            ) : (
              <form onSubmit={submit} className="space-y-2.5">
                <input name="name" required placeholder={t(locale, 'contact.yourName')} className={field} />
                <input
                  name="phone"
                  required
                  type="tel"
                  placeholder={t(locale, 'contact.yourPhone')}
                  className={field}
                />
                <div className="grid grid-cols-2 gap-2.5">
                  <input name="checkIn" type="date" aria-label={t(locale, 'contact.checkIn')} className={field} />
                  <input name="checkOut" type="date" aria-label={t(locale, 'contact.checkOut')} className={field} />
                </div>
                <input
                  name="guests"
                  type="number"
                  min={1}
                  placeholder={t(locale, 'search.guests')}
                  className={field}
                />
                <textarea
                  name="message"
                  rows={2}
                  placeholder={t(locale, 'contact.message')}
                  className="w-full rounded-xl border-0 bg-sand-50 p-3.5 text-[15px] ring-1 ring-inset ring-sand-200 focus:ring-2 focus:ring-clay-500"
                />
                <Button type="submit" disabled={sending} className="w-full">
                  {sending ? t(locale, 'contact.sending') : t(locale, 'contact.send')}
                </Button>
                <p className="text-center text-xs text-ink-300">
                  {t(locale, 'contact.privacy')}
                </p>
              </form>
            )}
          </>
        )}

        {sent && (
          <div className="rounded-xl bg-olive-100 p-4 text-center">
            <div className="font-medium">{t(locale, 'contact.sentTitle')}</div>
            <p className="mt-1 text-sm text-ink-500">
              {t(locale, 'contact.sentBody')}
            </p>
          </div>
        )}

        {error && <p className="mt-3 text-center text-sm text-clay-600">{error}</p>}
      </div>
    </div>
  )
}
