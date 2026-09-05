'use client'

import { useState } from 'react'

import { Button } from './ui'

/**
 * Φόρμα ιδιοκτήτη.
 *
 * Ζητάει το ελάχιστο: όνομα και τηλέφωνο. Τα υπόλοιπα συμπληρώνονται στην
 * τηλεφωνική συνομιλία που ακολουθεί. Μια μακριά φόρμα με δεκαπέντε πεδία
 * θα διώξει τους μισούς — και ο στόχος εδώ δεν είναι πλήρης καταχώρηση,
 * είναι να πιάσουμε την επαφή.
 */
export function OwnerForm() {
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSending(true)
    setError(null)

    const data = new FormData(e.currentTarget)
    try {
      const res = await fetch('/api/owner-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ownerName: data.get('ownerName'),
          phone: data.get('phone'),
          email: data.get('email') || undefined,
          propertyName: data.get('propertyName') || undefined,
          areaName: data.get('areaName') || undefined,
          propertyType: data.get('propertyType') || undefined,
          message: data.get('message') || undefined,
        }),
      })
      if (!res.ok) throw new Error()
      setSent(true)
    } catch {
      setError('Δεν στάλθηκε. Δοκίμασε ξανά ή πάρε μας τηλέφωνο.')
    } finally {
      setSending(false)
    }
  }

  if (sent) {
    return (
      <div className="rounded-card bg-olive-100 p-8 text-center">
        <div className="text-lg font-semibold">Το λάβαμε</div>
        <p className="mt-2 text-ink-700">
          Θα σε πάρουμε τηλέφωνο τις επόμενες μέρες για τις φωτογραφίες και τις λεπτομέρειες
          του καταλύματος.
        </p>
      </div>
    )
  }

  const field =
    'h-11 w-full rounded-xl border-0 bg-sand-50 px-3.5 text-[15px] ' +
    'ring-1 ring-inset ring-sand-200 focus:ring-2 focus:ring-clay-500'

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Ονοματεπώνυμο *</span>
          <input name="ownerName" required className={field} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Τηλέφωνο *</span>
          <input name="phone" required type="tel" className={field} />
        </label>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Email</span>
        <input name="email" type="email" className={field} />
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Ονομασία καταλύματος</span>
          <input name="propertyName" className={field} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Περιοχή</span>
          <input name="areaName" placeholder="π.χ. Τολό" className={field} />
        </label>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Τύπος</span>
        <select name="propertyType" className={field} defaultValue="">
          <option value="">Διάλεξε…</option>
          {[
            'Διαμέρισμα',
            'Στούντιο',
            'Μεζονέτα',
            'Βίλα',
            'Μονοκατοικία',
            'Δωμάτιο',
            'Ξενοδοχείο',
            'Ξενώνας',
          ].map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Μήνυμα</span>
        <textarea
          name="message"
          rows={3}
          className="w-full rounded-xl border-0 bg-sand-50 p-3.5 text-[15px] ring-1 ring-inset ring-sand-200 focus:ring-2 focus:ring-clay-500"
        />
      </label>

      <Button type="submit" size="lg" disabled={sending} className="w-full sm:w-auto">
        {sending ? 'Αποστολή…' : 'Στείλε τα στοιχεία'}
      </Button>

      {error && <p className="text-sm text-clay-600">{error}</p>}

      <p className="text-xs text-ink-300">
        Τα στοιχεία σου χρησιμοποιούνται μόνο για να επικοινωνήσουμε μαζί σου σχετικά με την
        καταχώρηση.
      </p>
    </form>
  )
}
