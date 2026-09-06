/**
 * Κατεβάζει φωτογραφίες από το Wikimedia Commons για οδηγούς και περιοχές.
 *
 * Το Commons επιλέχθηκε επειδή η άδεια κάθε αρχείου είναι ρητή και
 * μηχαναγνώσιμη. Οι περισσότερες εικόνες είναι CC BY-SA, που επιτρέπει
 * εμπορική χρήση ΜΕ αναφορά στον δημιουργό — γι' αυτό η απόδοση
 * αποθηκεύεται στο πεδίο «Πηγή / φωτογράφος» και εμφανίζεται στο site.
 *
 * Χωρίς την αναφορά η χρήση παραβιάζει την άδεια. Μη την αφαιρέσεις.
 *
 *   SEED_PASSWORD="..." node scripts/photos.mjs
 */

const BASE = process.env.SEED_BASE_URL || 'http://localhost:3000'
const EMAIL = process.env.SEED_EMAIL || 'plevedogiannis@gmail.com'
const PASSWORD = process.env.SEED_PASSWORD
const UA = 'ArgolidaStay/1.0 (https://argolidastay.gr; contact via site)'

if (!PASSWORD) {
  console.error('Λείπει το SEED_PASSWORD.')
  process.exit(1)
}

// Άδειες που επιτρέπουν εμπορική χρήση. Ό,τι δεν είναι εδώ, απορρίπτεται.
const ALLOWED = [/^CC BY/i, /^CC0/i, /^Public domain/i, /^PD/i]

const ARTICLE_PHOTOS = {
  'paralies-argolidas': 'Karathona beach Nafplio',
  'ti-na-deis-sto-nafplio': 'Bourtzi Nafplio',
  'epidavros-arxaio-theatro': 'Theatre of Epidaurus',
  'mykines-odigos': 'Lion Gate Mycenae',
}

const AREA_PHOTOS = {
  nafplio: 'Nafplio panorama Greece',
  tolo: 'Tolo Argolis Greece',
  epidavros: 'Palaia Epidavros',
  'porto-cheli': 'Hinitsa Beach Porto Heli',
  ermioni: 'Ermioni Greece',
  drepano: 'Vivari Argolis',
  kranidi: 'Kranidi Greece',
  astros: 'Paralio Astros',
}

/**
 * Μόνο αυτές οι περιοχές/οδηγοί ενημερώνονται σε αυτή την εκτέλεση.
 * Χωρίς φίλτρο θα ξανακατέβαιναν όλες οι εικόνες κάθε φορά.
 */
const ONLY = (process.env.ONLY || '').split(',').filter(Boolean)
const wanted = (slug) => ONLY.length === 0 || ONLY.includes(slug)

const strip = (s) => (s || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()

/** Βρίσκει την καλύτερη εικόνα: οριζόντια, επαρκούς ανάλυσης, με ελεύθερη άδεια. */
async function findPhoto(term) {
  const url =
    'https://commons.wikimedia.org/w/api.php?action=query&format=json' +
    '&generator=search&gsrnamespace=6&gsrlimit=12' +
    `&gsrsearch=${encodeURIComponent(term)}` +
    '&prop=imageinfo&iiprop=url|extmetadata|size&iiurlwidth=1800'

  const res = await fetch(url, { headers: { 'User-Agent': UA } })
  const data = await res.json()
  const pages = Object.values(data?.query?.pages ?? {})

  const candidates = pages
    .map((p) => {
      const ii = p.imageinfo?.[0]
      if (!ii) return null
      const md = ii.extmetadata ?? {}
      const license = strip(md.LicenseShortName?.value)
      const author = strip(md.Artist?.value)
      const ratio = ii.width && ii.height ? ii.width / ii.height : 0
      return {
        title: p.title.replace(/^File:/, ''),
        url: ii.thumburl || ii.url,
        license,
        author,
        descriptionUrl: ii.descriptionurl,
        width: ii.width,
        ratio,
      }
    })
    .filter(
      (c) =>
        c &&
        c.url &&
        /\.(jpe?g|png)$/i.test(c.title) &&
        ALLOWED.some((re) => re.test(c.license)) &&
        c.width >= 1200 &&
        c.ratio >= 1.2, // οριζόντιες — οι κάθετες κόβονται άσχημα σε hero
    )

  // Προτιμούμε αναλογία κοντά στο 16:9.
  candidates.sort((a, b) => Math.abs(a.ratio - 1.78) - Math.abs(b.ratio - 1.78))
  return candidates[0] ?? null
}

async function api(path, { method = 'GET', token, body, locale } = {}) {
  const url = new URL(`${BASE}${path}`)
  if (locale) url.searchParams.set('locale', locale)
  const res = await fetch(url, {
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
    return { ok: res.ok, json: { raw: text.slice(0, 160) } }
  }
}

async function uploadPhoto(photo, alt, slug, token) {
  const img = await fetch(photo.url, { headers: { 'User-Agent': UA } })
  if (!img.ok) return null
  const buf = Buffer.from(await img.arrayBuffer())

  const credit = `${photo.author || 'Wikimedia Commons'} — ${photo.license}, μέσω Wikimedia Commons`

  // Ο τύπος MIME είναι απαραίτητος: το Payload δέχεται μόνο image/*, και
  // ένα Blob χωρίς τύπο απορρίπτεται σιωπηλά.
  const isPng = /\.png$/i.test(photo.title)
  const ext = isPng ? 'png' : 'jpg'
  const mime = isPng ? 'image/png' : 'image/jpeg'

  // Το όνομα αρχείου βγαίνει από το slug και όχι από τον τίτλο: οι
  // ελληνικοί χαρακτήρες θα κόβονταν και όλα τα αρχεία θα λέγονταν το ίδιο.
  const form = new FormData()
  form.append('file', new Blob([buf], { type: mime }), `${slug}.${ext}`)
  form.append('_payload', JSON.stringify({ alt, credit }))

  const res = await fetch(`${BASE}/api/media`, {
    method: 'POST',
    headers: { Authorization: `JWT ${token}` },
    body: form,
  })
  const json = await res.json()
  if (!json?.doc?.id) {
    console.log(`      σφάλμα ανεβάσματος: ${JSON.stringify(json).slice(0, 120)}`)
    return null
  }
  return json.doc.id
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

  console.log('── Οδηγοί ──')
  const articles = await api('/api/articles?limit=100&depth=0', { token })
  const artBySlug = Object.fromEntries((articles.json.docs ?? []).map((a) => [a.slug, a]))

  for (const [slug, term] of Object.entries(ARTICLE_PHOTOS)) {
    if (!wanted(slug)) continue
    const article = artBySlug[slug]
    if (!article) {
      console.log(`  – ${slug}: δεν υπάρχει`)
      continue
    }
    const photo = await findPhoto(term)
    if (!photo) {
      console.log(`  ✗ ${slug}: καμία εικόνα με κατάλληλη άδεια`)
      continue
    }
    const mediaId = await uploadPhoto(photo, String(article.title || slug), slug, token)
    if (!mediaId) {
      console.log(`  ✗ ${slug}: αποτυχία λήψης`)
      continue
    }
    const res = await api(`/api/articles/${article.id}`, {
      method: 'PATCH',
      token,
      body: { coverImage: mediaId },
    })
    console.log(
      res.ok
        ? `  ✓ ${slug} ← ${photo.title.slice(0, 42)} [${photo.license}]`
        : `  ✗ ${slug}: ${JSON.stringify(res.json).slice(0, 90)}`,
    )
  }

  console.log('\n── Περιοχές ──')
  const areas = await api('/api/areas?limit=100&depth=0', { token })
  const areaBySlug = Object.fromEntries((areas.json.docs ?? []).map((a) => [a.slug, a]))

  for (const [slug, term] of Object.entries(AREA_PHOTOS)) {
    if (!wanted(slug)) continue
    const area = areaBySlug[slug]
    if (!area) continue
    const photo = await findPhoto(term)
    if (!photo) {
      console.log(`  ✗ ${slug}: καμία εικόνα με κατάλληλη άδεια`)
      continue
    }
    const mediaId = await uploadPhoto(photo, String(area.name || slug), `perioxi-${slug}`, token)
    if (!mediaId) continue
    const res = await api(`/api/areas/${area.id}`, {
      method: 'PATCH',
      token,
      body: { image: mediaId },
    })
    console.log(
      res.ok
        ? `  ✓ ${slug} ← ${photo.title.slice(0, 42)} [${photo.license}]`
        : `  ✗ ${slug}`,
    )
  }
}

main().catch((e) => {
  console.error('✗', e.message)
  process.exit(1)
})
