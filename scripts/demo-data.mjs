/**
 * Δοκιμαστικά καταλύματα για να βλέπουμε πώς δείχνει η σχεδίαση.
 *
 * ΜΟΝΟ για τοπική ανάπτυξη — μη το τρέξεις σε πραγματική βάση. Οι
 * φωτογραφίες είναι χρωματικές διαβαθμίσεις, όχι πραγματικά σπίτια, και
 * υπάρχουν απλώς για να κρίνουμε τη διάταξη.
 *
 *   SEED_PASSWORD="..." node scripts/demo-data.mjs
 */

import { Buffer } from 'node:buffer'
import zlib from 'node:zlib'

const BASE = process.env.SEED_BASE_URL || 'http://localhost:3000'
const EMAIL = process.env.SEED_EMAIL || 'plevedogiannis@gmail.com'
const PASSWORD = process.env.SEED_PASSWORD

if (!PASSWORD) {
  console.error('Λείπει το SEED_PASSWORD.')
  process.exit(1)
}

const DEMO = [
  { name: 'Βίλα Ελένη', slug: 'villa-eleni', area: 'tolo', type: 'villa', guests: 8,
    bedrooms: 4, bathrooms: 3, from: 140, to: 260, featured: true, beach: 120,
    lat: 37.5197, lng: 22.8619, address: 'Ακτή Τολού 24, Τολό',
    short: 'Ανεξάρτητη βίλα με πισίνα και θέα στον κόλπο του Τολού.' },
  { name: 'Διαμέρισμα Ακροναυπλία', slug: 'diamerisma-akronafplia', area: 'nafplio',
    type: 'apartment', guests: 4, bedrooms: 2, bathrooms: 1, from: 65, to: 110,
    featured: true, beach: 400, lat: 37.5675, lng: 22.8003,
    address: 'Σταϊκοπούλου 18, Παλιά Πόλη, Ναύπλιο',
    short: 'Στην Παλιά Πόλη, δύο βήματα από την πλατεία Συντάγματος.' },
  { name: 'Στούντιο Θαλασσινό', slug: 'studio-thalassino', area: 'drepano',
    type: 'studio', guests: 2, bedrooms: 1, bathrooms: 1, from: 45, to: 70, beach: 50,
    lat: 37.5340, lng: 22.8845, address: 'Παραλία Βιβαρίου 7, Δρέπανο',
    short: 'Μικρό και φωτεινό, με βεράντα πάνω στη θάλασσα.' },
  { name: 'Πέτρινη Κατοικία Επιδαύρου', slug: 'petrini-katoikia-epidavrou',
    area: 'epidavros', type: 'house', guests: 6, bedrooms: 3, bathrooms: 2,
    from: 95, to: 150, featured: true, beach: 900, lat: 37.6301, lng: 23.1553,
    address: 'Οδός Ασκληπιού 12, Παλαιά Επίδαυρος',
    short: 'Παραδοσιακή πέτρινη κατοικία μέσα σε ελαιώνα.' },
  { name: 'Μεζονέτα Πόρτο Χέλι', slug: 'mezoneta-porto-cheli', area: 'porto-cheli',
    type: 'maisonette', guests: 5, bedrooms: 2, bathrooms: 2, from: 110, to: 190, beach: 250,
    lat: 37.3241, lng: 23.1461, address: 'Λιμάνι Πόρτο Χελίου 5',
    short: 'Σύγχρονη μεζονέτα με ιδιωτικό κήπο, κοντά στο λιμάνι.' },
  { name: 'Ξενώνας Ερμιόνη', slug: 'xenonas-ermioni', area: 'ermioni',
    type: 'guesthouse', guests: 3, bedrooms: 1, bathrooms: 1, from: 55, to: 85, beach: 300,
    lat: 37.3881, lng: 23.2494, address: 'Μιαούλη 33, Ερμιόνη',
    short: 'Οικογενειακός ξενώνας με πρωινό, στο κέντρο της Ερμιόνης.' },
  { name: 'Σοφίτα Παλαμήδι', slug: 'sofita-palamidi', area: 'nafplio',
    type: 'studio', guests: 2, bedrooms: 1, bathrooms: 1, from: 55, to: 90, beach: 550,
    lat: 37.5651, lng: 22.8041, address: 'Ποταμιάνου 6, Ναύπλιο',
    short: 'Σοφίτα με θέα στο κάστρο, για δύο.' },
  { name: 'Παραθαλάσσιο Διαμέρισμα Τολό', slug: 'diamerisma-tolo', area: 'tolo',
    type: 'apartment', guests: 4, bedrooms: 2, bathrooms: 1, from: 70, to: 120, beach: 40,
    lat: 37.5211, lng: 22.8583, address: 'Μπουμπουλίνας 11, Τολό',
    short: 'Πρώτη σειρά στη θάλασσα, με μεγάλο μπαλκόνι.' },
]

// Κάθε κατάλυμα παίρνει και δύο επιπλέον φωτογραφίες για τη γκαλερί.
const GALLERY_TINTS = [
  [0x9a, 0xa8, 0x8c], [0xc4, 0xa4, 0x7a], [0x7f, 0x94, 0x9e],
  [0xb8, 0x8c, 0x6e], [0x8c, 0x9d, 0x86], [0xa9, 0x93, 0x84],
]

const COLORS = [
  [0xc8, 0x86, 0x3c], [0x6b, 0x70, 0x48], [0xb5, 0x56, 0x3a],
  [0x8d, 0xa3, 0xa6], [0xa8, 0x8f, 0x6a], [0x7d, 0x8c, 0x6f],
]

/** Ελάχιστο έγκυρο PNG με κάθετη διαβάθμιση — χωρίς εξαρτήσεις. */
function gradientPng(width, height, [r, g, b]) {
  const chunks = []
  const crcTable = Array.from({ length: 256 }, (_, n) => {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    return c >>> 0
  })
  const crc = (buf) => {
    let c = 0xffffffff
    for (const byte of buf) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8)
    return (c ^ 0xffffffff) >>> 0
  }
  const chunk = (type, data) => {
    const len = Buffer.alloc(4)
    len.writeUInt32BE(data.length)
    const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
    const crcBuf = Buffer.alloc(4)
    crcBuf.writeUInt32BE(crc(body))
    return Buffer.concat([len, body, crcBuf])
  }

  chunks.push(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8
  ihdr[9] = 2 // truecolour
  chunks.push(chunk('IHDR', ihdr))

  const raw = Buffer.alloc((width * 3 + 1) * height)
  let o = 0
  for (let y = 0; y < height; y++) {
    raw[o++] = 0
    const t = y / height
    for (let x = 0; x < width; x++) {
      const s = 0.55 + 0.45 * (1 - t) + 0.1 * Math.sin((x / width) * Math.PI)
      raw[o++] = Math.min(255, Math.round(r * s))
      raw[o++] = Math.min(255, Math.round(g * s))
      raw[o++] = Math.min(255, Math.round(b * s))
    }
  }
  const { deflateSync } = zlib
  chunks.push(chunk('IDAT', deflateSync(raw, { level: 6 })))
  chunks.push(chunk('IEND', Buffer.alloc(0)))
  return Buffer.concat(chunks)
}

async function api(path, { method = 'GET', token, body } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `JWT ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
  const text = await res.text()
  try {
    return { ok: res.ok, json: JSON.parse(text) }
  } catch {
    return { ok: res.ok, json: { raw: text.slice(0, 200) } }
  }
}

async function main() {
  const login = await api('/api/users/login', {
    method: 'POST',
    body: { email: EMAIL, password: PASSWORD },
  })
  if (!login.ok) {
    console.error('✗ αποτυχία σύνδεσης')
    process.exit(1)
  }
  const token = login.json.token

  const areasRes = await api('/api/areas?limit=100', { token })
  const areaBySlug = Object.fromEntries(areasRes.json.docs.map((a) => [a.slug, a.id]))

  const amenRes = await api('/api/amenities?limit=100', { token })
  const amenityIds = amenRes.json.docs.map((a) => a.id)

  async function upload(name, slug, tint, suffix = '') {
    const png = gradientPng(1200, 900, tint)
    const form = new FormData()
    form.append('file', new Blob([png], { type: 'image/png' }), `${slug}${suffix}.png`)
    form.append('_payload', JSON.stringify({ alt: name }))
    const res = await fetch(`${BASE}/api/media`, {
      method: 'POST',
      headers: { Authorization: `JWT ${token}` },
      body: form,
    })
    return (await res.json())?.doc?.id
  }

  // Ποια υπάρχουν ήδη — τα ενημερώνουμε αντί να σκάσουμε σε διπλό slug.
  const existing = await api('/api/properties?limit=200&depth=0', { token })
  const idBySlug = Object.fromEntries(
    (existing.json.docs ?? []).map((d) => [d.slug, d.id]),
  )

  let made = 0
  for (const [i, d] of DEMO.entries()) {
    const coverId = await upload(d.name, d.slug, COLORS[i % COLORS.length])
    if (!coverId) {
      console.log(`  ✗ ${d.name}: αποτυχία εικόνας`)
      continue
    }

    // Δύο επιπλέον για τη γκαλερί.
    const gallery = []
    for (let g = 1; g <= 2; g++) {
      const tint = GALLERY_TINTS[(i + g * 2) % GALLERY_TINTS.length]
      const id = await upload(`${d.name} — φωτογραφία ${g + 1}`, d.slug, tint, `-${g}`)
      if (id) gallery.push({ image: id })
    }

    const picked = amenityIds
      .slice()
      .sort(() => Math.random() - 0.5)
      .slice(0, 5)

    const body = {
      name: d.name,
      slug: d.slug,
      type: d.type,
      area: areaBySlug[d.area],
      guests: d.guests,
      bedrooms: d.bedrooms,
      bathrooms: d.bathrooms,
      beds: d.guests,
      shortDescription: d.short,
      coverImage: coverId,
      gallery,
      amenities: picked,
      address: d.address,
      latitude: d.lat,
      longitude: d.lng,
      distanceToBeach: d.beach,
      priceFrom: d.from,
      priceTo: d.to,
      featured: Boolean(d.featured),
      contactName: 'Ιδιοκτήτης δοκιμής',
      contactPhone: '+306940000000',
      mite: `00001234${i}`,
      _status: 'published',
    }

    const id = idBySlug[d.slug]
    const res = id
      ? await api(`/api/properties/${id}`, { method: 'PATCH', token, body })
      : await api('/api/properties', { method: 'POST', token, body })

    if (res.ok) {
      made++
      console.log(`  ✓ ${d.name}${id ? ' (ενημερώθηκε)' : ''} — ${gallery.length + 1} φωτογραφίες`)
    } else {
      console.log(`  ✗ ${d.name}: ${JSON.stringify(res.json).slice(0, 140)}`)
    }
  }

  console.log(`\n${made}/${DEMO.length} δοκιμαστικά καταλύματα`)
}

main().catch((e) => {
  console.error('✗', e.message)
  process.exit(1)
})
