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
    short: 'Ανεξάρτητη βίλα με πισίνα και θέα στον κόλπο του Τολού.' },
  { name: 'Διαμέρισμα Ακροναυπλία', slug: 'diamerisma-akronafplia', area: 'nafplio',
    type: 'apartment', guests: 4, bedrooms: 2, bathrooms: 1, from: 65, to: 110,
    featured: true, beach: 400,
    short: 'Στην Παλιά Πόλη, δύο βήματα από την πλατεία Συντάγματος.' },
  { name: 'Στούντιο Θαλασσινό', slug: 'studio-thalassino', area: 'drepano',
    type: 'studio', guests: 2, bedrooms: 1, bathrooms: 1, from: 45, to: 70, beach: 50,
    short: 'Μικρό και φωτεινό, με βεράντα πάνω στη θάλασσα.' },
  { name: 'Πέτρινη Κατοικία Επιδαύρου', slug: 'petrini-katoikia-epidavrou',
    area: 'epidavros', type: 'house', guests: 6, bedrooms: 3, bathrooms: 2,
    from: 95, to: 150, featured: true, beach: 900,
    short: 'Παραδοσιακή πέτρινη κατοικία μέσα σε ελαιώνα.' },
  { name: 'Μεζονέτα Πόρτο Χέλι', slug: 'mezoneta-porto-cheli', area: 'porto-cheli',
    type: 'maisonette', guests: 5, bedrooms: 2, bathrooms: 2, from: 110, to: 190, beach: 250,
    short: 'Σύγχρονη μεζονέτα με ιδιωτικό κήπο, κοντά στο λιμάνι.' },
  { name: 'Ξενώνας Ερμιόνη', slug: 'xenonas-ermioni', area: 'ermioni',
    type: 'guesthouse', guests: 3, bedrooms: 1, bathrooms: 1, from: 55, to: 85, beach: 300,
    short: 'Οικογενειακός ξενώνας με πρωινό, στο κέντρο της Ερμιόνης.' },
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

  let made = 0
  for (const [i, d] of DEMO.entries()) {
    const png = await gradientPng(1200, 900, COLORS[i % COLORS.length])

    const form = new FormData()
    form.append('file', new Blob([png], { type: 'image/png' }), `${d.slug}.png`)
    form.append('_payload', JSON.stringify({ alt: d.name }))

    const upload = await fetch(`${BASE}/api/media`, {
      method: 'POST',
      headers: { Authorization: `JWT ${token}` },
      body: form,
    })
    const uploaded = await upload.json()
    const mediaId = uploaded?.doc?.id
    if (!mediaId) {
      console.log(`  ✗ ${d.name}: αποτυχία εικόνας`)
      continue
    }

    const picked = amenityIds
      .slice()
      .sort(() => Math.random() - 0.5)
      .slice(0, 5)

    const res = await api('/api/properties', {
      method: 'POST',
      token,
      body: {
        name: d.name,
        slug: d.slug,
        type: d.type,
        area: areaBySlug[d.area],
        guests: d.guests,
        bedrooms: d.bedrooms,
        bathrooms: d.bathrooms,
        beds: d.guests,
        shortDescription: d.short,
        coverImage: mediaId,
        amenities: picked,
        distanceToBeach: d.beach,
        priceFrom: d.from,
        priceTo: d.to,
        featured: Boolean(d.featured),
        contactName: 'Ιδιοκτήτης δοκιμής',
        contactPhone: '+306940000000',
        mite: `00001234${i}`,
        _status: 'published',
      },
    })
    if (res.ok) {
      made++
      console.log(`  ✓ ${d.name}`)
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
