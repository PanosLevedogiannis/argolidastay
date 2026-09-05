/**
 * Γεμίζει μια άδεια βάση με τα βασικά: λογαριασμό διαχειριστή, περιοχές
 * της Αργολίδας και τις συνηθισμένες παροχές.
 *
 * Το τρέχουμε μετά από κάθε σβήσιμο της τοπικής βάσης, ώστε να μη
 * ξαναχτίζεται ο κατάλογος με το χέρι.
 *
 *   node scripts/seed.mjs
 *
 * Θέλει τον dev server ανοιχτό σε άλλο τερματικό.
 */

const BASE = process.env.SEED_BASE_URL || 'http://localhost:3000'
const EMAIL = process.env.SEED_EMAIL || 'plevedogiannis@gmail.com'
const PASSWORD = process.env.SEED_PASSWORD

if (!PASSWORD) {
  console.error('Λείπει το SEED_PASSWORD. Παράδειγμα:')
  console.error('  SEED_PASSWORD="..." node scripts/seed.mjs')
  process.exit(1)
}

const AREAS = [
  { name: 'Ναύπλιο', slug: 'nafplio', featured: true },
  { name: 'Τολό', slug: 'tolo', featured: true },
  { name: 'Επίδαυρος', slug: 'epidavros', featured: true },
  { name: 'Πόρτο Χέλι', slug: 'porto-cheli' },
  { name: 'Ερμιόνη', slug: 'ermioni' },
  { name: 'Κρανίδι', slug: 'kranidi' },
  { name: 'Δρέπανο', slug: 'drepano' },
  { name: 'Άστρος', slug: 'astros' },
]

const AMENITIES = [
  { name: 'WiFi', category: 'general', icon: 'wifi' },
  { name: 'Κλιματισμός', category: 'general', icon: 'ac' },
  { name: 'Πάρκινγκ', category: 'general', icon: 'parking' },
  { name: 'Τηλεόραση', category: 'general', icon: 'tv' },
  { name: 'Πλυντήριο ρούχων', category: 'general', icon: 'washer' },
  { name: 'Κουζίνα πλήρως εξοπλισμένη', category: 'kitchen', icon: 'kitchen' },
  { name: 'Ψυγείο', category: 'kitchen', icon: 'fridge' },
  { name: 'Πισίνα', category: 'outdoor', icon: 'pool' },
  { name: 'Θέα θάλασσα', category: 'outdoor', icon: 'sea-view' },
  { name: 'Κήπος / βεράντα', category: 'outdoor', icon: 'garden' },
  { name: 'BBQ', category: 'outdoor', icon: 'bbq' },
  { name: 'Κατάλληλο για ΑμεΑ', category: 'accessibility', icon: 'accessible' },
  { name: 'Ασανσέρ', category: 'accessibility', icon: 'elevator' },
  { name: 'Παιδική κούνια', category: 'family', icon: 'crib' },
  { name: 'Δεκτά κατοικίδια', category: 'family', icon: 'pets' },
]

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
  let json
  try {
    json = JSON.parse(text)
  } catch {
    json = { raw: text.slice(0, 200) }
  }
  return { ok: res.ok, status: res.status, json }
}

async function main() {
  // Ο πρώτος λογαριασμός φτιάχνεται μόνο σε εντελώς άδεια βάση· αν υπάρχει
  // ήδη, απλώς συνδεόμαστε.
  let token
  const first = await api('/api/users/first-register', {
    method: 'POST',
    body: { name: 'Παναγιώτης Λεβεντογιάννης', email: EMAIL, password: PASSWORD, role: 'admin' },
  })

  if (first.ok) {
    token = first.json.token
    console.log('✓ δημιουργήθηκε ο πρώτος λογαριασμός')
  } else {
    const login = await api('/api/users/login', {
      method: 'POST',
      body: { email: EMAIL, password: PASSWORD },
    })
    if (!login.ok) {
      console.error('✗ αποτυχία σύνδεσης:', JSON.stringify(login.json).slice(0, 200))
      process.exit(1)
    }
    token = login.json.token
    console.log('✓ σύνδεση (ο λογαριασμός υπήρχε ήδη)')
  }

  for (const [label, path, items] of [
    ['περιοχές', '/api/areas', AREAS],
    ['παροχές', '/api/amenities', AMENITIES],
  ]) {
    let created = 0
    let skipped = 0
    for (const item of items) {
      const res = await api(path, { method: 'POST', token, body: item })
      if (res.ok) created++
      else skipped++
    }
    console.log(`✓ ${label}: ${created} νέες, ${skipped} υπήρχαν ήδη`)
  }

  console.log(`\nΈτοιμο. Πάνελ: ${BASE}/admin`)
}

main().catch((err) => {
  console.error('✗', err.message)
  console.error('  Τρέχει ο dev server;')
  process.exit(1)
})
