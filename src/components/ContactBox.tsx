'use client'

import { useState } from 'react'

import { Button } from './ui'

type Revealed = { phone: string; viber: string; name: string | null }

function priceLabel(from?: number | null, to?: number | null) {
  if (from && to && from !== to) return `${from}–${to}€`
  if (from) return `από ${from}€`
  if (to) return `έως ${to}€`
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
}: {
  propertyId: number | string
  priceFrom?: number | null
  priceTo?: number | null
  priceNote?: string | null
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
      setError('Κάτι πήγε στραβά. Δοκίμασε ξανά ή στείλε αίτημα να σε καλέσουν.')
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
          locale: 'el',
        }),
      })
      if (!res.ok) throw new Error()
      setSent(true)
    } catch {
      setError('Δεν στάλθηκε το αίτημα. Δοκίμασε το τηλέφωνο παραπάνω.')
    } finally {
      setSending(false)
    }
  }

  const price = priceLabel(priceFrom, priceTo)
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
              {priceNote || 'ενδεικτικά, ανά διανυκτέρευση'}
            </div>
          </>
        ) : (
          <div className="text-lg font-semibold">Επικοινωνήστε για τιμές</div>
        )}
      </div>

      <div className="pt-4">
        {revealed ? (
          <div className="rounded-xl bg-olive-100 p-4 text-center">
            <div className="text-xs text-ink-500">
              {revealed.name ? `Επικοινωνία — ${revealed.name}` : 'Τηλέφωνο επικοινωνίας'}
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
              Μήνυμα στο Viber
            </a>
          </div>
        ) : (
          <Button onClick={reveal} disabled={revealing} className="w-full" size="lg">
            {revealing ? 'Φόρτωση…' : 'Δες τηλέφωνο'}
          </Button>
        )}

        {!sent && (
          <>
            <div className="my-3 text-center text-xs text-ink-300">ή</div>

            {!showForm ? (
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => setShowForm(true)}
              >
                Να με καλέσουν
              </Button>
            ) : (
              <form onSubmit={submit} className="space-y-2.5">
                <input name="name" required placeholder="Το όνομά σου" className={field} />
                <input
                  name="phone"
                  required
                  type="tel"
                  placeholder="Το τηλέφωνό σου"
                  className={field}
                />
                <div className="grid grid-cols-2 gap-2.5">
                  <input name="checkIn" type="date" aria-label="Άφιξη" className={field} />
                  <input name="checkOut" type="date" aria-label="Αναχώρηση" className={field} />
                </div>
                <input
                  name="guests"
                  type="number"
                  min={1}
                  placeholder="Άτομα"
                  className={field}
                />
                <textarea
                  name="message"
                  rows={2}
                  placeholder="Μήνυμα (προαιρετικό)"
                  className="w-full rounded-xl border-0 bg-sand-50 p-3.5 text-[15px] ring-1 ring-inset ring-sand-200 focus:ring-2 focus:ring-clay-500"
                />
                <Button type="submit" disabled={sending} className="w-full">
                  {sending ? 'Αποστολή…' : 'Στείλε το αίτημα'}
                </Button>
                <p className="text-center text-xs text-ink-300">
                  Το τηλέφωνό σου πάει μόνο στον ιδιοκτήτη αυτού του καταλύματος.
                </p>
              </form>
            )}
          </>
        )}

        {sent && (
          <div className="rounded-xl bg-olive-100 p-4 text-center">
            <div className="font-medium">Το αίτημα στάλθηκε</div>
            <p className="mt-1 text-sm text-ink-500">
              Ο ιδιοκτήτης ειδοποιήθηκε και θα σε καλέσει.
            </p>
          </div>
        )}

        {error && <p className="mt-3 text-center text-sm text-clay-600">{error}</p>}
      </div>
    </div>
  )
}
