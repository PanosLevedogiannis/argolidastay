/**
 * Ειδοποίηση ιδιοκτήτη όταν κάποιος ζητήσει να τον καλέσουν.
 *
 * Ο πάροχος SMS επιλέγεται από μεταβλητή περιβάλλοντος, ώστε να μπορεί να
 * αλλάξει χωρίς να πειραχτεί ο υπόλοιπος κώδικας. Αν δεν έχει ρυθμιστεί
 * πάροχος, το μήνυμα απλώς καταγράφεται στην κονσόλα — έτσι το σύστημα
 * δουλεύει από την πρώτη μέρα και τα SMS μπαίνουν όταν είναι έτοιμος ο
 * λογαριασμός, χωρίς αλλαγή στη βάση.
 */

export type SmsResult = {
  ok: boolean
  provider: string
  detail: string
}

export type EnquiryNotification = {
  ownerPhone: string
  ownerName?: string | null
  propertyName: string
  visitorName: string
  visitorPhone: string
  checkIn?: string | null
  checkOut?: string | null
  guests?: number | null
}

function formatDate(value?: string | null): string | null {
  if (!value) return null
  const d = new Date(value)
  return Number.isNaN(d.getTime())
    ? null
    : `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`
}

/**
 * Τα SMS χρεώνονται ανά 160 χαρακτήρες (70 αν περιέχουν ελληνικά, λόγω
 * κωδικοποίησης UCS-2). Κρατάμε το μήνυμα σφιχτό: όνομα, τηλέφωνο,
 * ημερομηνίες. Ο ιδιοκτήτης δεν χρειάζεται περισσότερα για να τηλεφωνήσει.
 */
export function buildSmsText(n: EnquiryNotification): string {
  const parts = [`ArgolidaStay: ${n.visitorName} ${n.visitorPhone}`]

  const from = formatDate(n.checkIn)
  const to = formatDate(n.checkOut)
  if (from && to) parts.push(`${from}-${to}`)
  else if (from) parts.push(`απο ${from}`)

  if (n.guests) parts.push(`${n.guests} ατ.`)
  parts.push(`για ${n.propertyName}`)

  return parts.join(' ')
}

export function buildEmailBody(n: EnquiryNotification): string {
  const lines = [
    `Νέο αίτημα επικοινωνίας για το κατάλυμα «${n.propertyName}».`,
    '',
    `Όνομα:     ${n.visitorName}`,
    `Τηλέφωνο:  ${n.visitorPhone}`,
  ]
  if (n.checkIn) lines.push(`Άφιξη:     ${formatDate(n.checkIn)}`)
  if (n.checkOut) lines.push(`Αναχώρηση: ${formatDate(n.checkOut)}`)
  if (n.guests) lines.push(`Άτομα:     ${n.guests}`)
  lines.push('', 'Παρακαλούμε επικοινωνήστε απευθείας μαζί του.', '', 'ArgolidaStay')
  return lines.join('\n')
}

/**
 * Yuboto — ελληνικός πάροχος. Το API δέχεται JSON με basic auth.
 * Τα στοιχεία μπαίνουν στο .env· δες README.
 */
async function sendViaYuboto(to: string, text: string): Promise<SmsResult> {
  const apiKey = process.env.SMS_API_KEY
  const sender = process.env.SMS_SENDER || 'ArgolidaStay'
  if (!apiKey) return { ok: false, provider: 'yuboto', detail: 'λείπει το SMS_API_KEY' }

  try {
    const res = await fetch('https://services.yuboto.com/omni/v1/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`,
      },
      body: JSON.stringify({
        phone: to,
        channel: 'sms',
        sms: { sender, text, typesms: 'sms', validity: 4320 },
      }),
    })
    const body = await res.text()
    return {
      ok: res.ok,
      provider: 'yuboto',
      detail: res.ok ? 'στάλθηκε' : `HTTP ${res.status}: ${body.slice(0, 200)}`,
    }
  } catch (err) {
    return { ok: false, provider: 'yuboto', detail: String(err).slice(0, 200) }
  }
}

export async function sendSms(to: string, text: string): Promise<SmsResult> {
  const provider = (process.env.SMS_PROVIDER || 'none').toLowerCase()

  switch (provider) {
    case 'yuboto':
      return sendViaYuboto(to, text)
    case 'none':
    default:
      // Χωρίς ρυθμισμένο πάροχο δεν σπάμε τη ροή — καταγράφουμε και συνεχίζουμε.
      console.info(`[SMS απενεργοποιημένο] προς ${to}: ${text}`)
      return { ok: false, provider: 'none', detail: 'δεν έχει ρυθμιστεί πάροχος SMS' }
  }
}
