/**
 * Οδηγοί για την Αργολίδα.
 *
 * Δεν είναι γεμιστικό κείμενο. Για κατάλογο καταλυμάτων, αυτά τα άρθρα
 * είναι ο κύριος τρόπος να έρθει κόσμος από το Google: κάποιος ψάχνει
 * «παραλίες Ναύπλιο», διαβάζει τον οδηγό, και από εκεί περνάει στα
 * καταλύματα της περιοχής.
 *
 * Γι' αυτό κάθε άρθρο συνδέεται με περιοχή και με συγκεκριμένα καταλύματα.
 *
 *   SEED_PASSWORD="..." node scripts/articles.mjs
 */

import { Buffer } from 'node:buffer'
import zlib from 'node:zlib'

import { richText } from './lib/lexical.mjs'

const BASE = process.env.SEED_BASE_URL || 'http://localhost:3000'
const EMAIL = process.env.SEED_EMAIL || 'plevedogiannis@gmail.com'
const PASSWORD = process.env.SEED_PASSWORD

if (!PASSWORD) {
  console.error('Λείπει το SEED_PASSWORD.')
  process.exit(1)
}

const ARTICLES = [
  {
    slug: 'paralies-argolidas',
    area: 'nafplio',
    tint: [0x6f, 0x9d, 0xa8],
    el: {
      title: 'Οι παραλίες της Αργολίδας',
      excerpt:
        'Από την Καραθώνα και την Αρβανιτιά μέχρι το Τολό και το Πόρτο Χέλι — ποια παραλία ταιριάζει σε ποιον.',
      body: `
Η Αργολίδα έχει το σπάνιο πλεονέκτημα ότι η θάλασσα είναι πάντα κοντά, όποια κι αν είναι η βάση σου. Από το Ναύπλιο φτάνεις σε αμμουδιά σε δέκα λεπτά, και στα περισσότερα χωριά της περιοχής η παραλία είναι στο τέλος του δρόμου.

## Κοντά στο Ναύπλιο

**Καραθώνα.** Η μεγάλη αμμουδιά του Ναυπλίου, τρία χιλιόμετρα από την πόλη. Ρηχά νερά και πεύκα που φτάνουν σχεδόν ως το κύμα, οπότε βρίσκεις σκιά χωρίς ομπρέλα. Είναι η προφανής επιλογή αν έχεις μικρά παιδιά.

**Αρβανιτιά.** Μικρή παραλία με βότσαλα, ακριβώς κάτω από την Ακροναυπλία. Δεν είναι για ολοήμερη παραμονή — είναι για μπάνιο πριν το δείπνο, και για το ηλιοβασίλεμα. Πηγαίνεις με τα πόδια από την Παλιά Πόλη.

Ανάμεσα στις δύο υπάρχει το **μονοπάτι της Αρβανιτιάς**, μια διαδρομή πάνω από τη θάλασσα που αξίζει και μόνο για τη θέα.

## Τολό και Δρέπανο

**Τολό.** Μακρύς κόλπος με ψιλή άμμο και ρηχά νερά, οργανωμένος σε όλο του το μήκος. Είναι το πιο τουριστικό σημείο της περιοχής, με ό,τι αυτό σημαίνει: εύκολη πρόσβαση σε ξαπλώστρες και ταβέρνες, αλλά και κόσμο τον Αύγουστο.

**Βιβάρι και Δρέπανο.** Λίγα χιλιόμετρα πιο πέρα, με ψαροταβέρνες πάνω στο νερό και σαφώς λιγότερη κίνηση. Καλή επιλογή αν θέλεις τη θάλασσα χωρίς τη φασαρία.

## Νότια — Ερμιονίδα

**Πόρτο Χέλι.** Κλειστός κόλπος με ήσυχα νερά, δημοφιλής σε όσους έχουν σκάφος. Γύρω του υπάρχουν αρκετοί μικροί όρμοι που γεμίζουν μόνο τον Αύγουστο.

**Κόστα.** Απέναντι από τις Σπέτσες, με τακτικά καραβάκια για το νησί. Βολικό αν θέλεις μια μέρα στις Σπέτσες χωρίς να μείνεις εκεί.

**Ερμιόνη.** Η πόλη είναι χτισμένη σε χερσόνησο, οπότε έχει θάλασσα και στις δύο πλευρές. Το πευκόφυτο Μπίστι στην άκρη είναι από τα ωραιότερα σημεία για μπάνιο στην Αργολίδα.

## Πρακτικά

- Οι περισσότερες παραλίες είναι προσβάσιμες με αυτοκίνητο, αλλά τα δρομολόγια των λεωφορείων είναι αραιά. Αν σκοπεύεις να αλλάζεις παραλίες, το αυτοκίνητο βοηθά πολύ.
- Ο μελτέμι φυσάει κυρίως Ιούλιο και Αύγουστο. Οι κλειστοί κόλποι — Τολό, Πόρτο Χέλι, Βιβάρι — μένουν προστατευμένοι.
- Τον Ιούνιο και τον Σεπτέμβριο η θάλασσα είναι εξίσου ζεστή και οι παραλίες μισοάδειες.
      `,
    },
    en: {
      title: 'The beaches of Argolida',
      excerpt:
        'From Karathona and Arvanitia to Tolo and Porto Cheli — which beach suits whom.',
      body: `
Argolida has the rare advantage that the sea is never far, whichever village you stay in. From Nafplio you reach a sandy beach in ten minutes, and in most of the surrounding villages the beach is simply at the end of the road.

## Near Nafplio

**Karathona.** Nafplio's long sandy beach, three kilometres from town. Shallow water and pine trees that reach almost to the waterline, so you find shade without renting an umbrella. The obvious choice with small children.

**Arvanitia.** A small pebble beach directly below the Akronafplia fortress. Not a place to spend the whole day — it is for a swim before dinner, and for the sunset. You can walk there from the Old Town.

Between the two runs the **Arvanitia footpath**, a walk above the sea that is worth it for the view alone.

## Tolo and Drepano

**Tolo.** A long bay with fine sand and shallow water, organised along its whole length. It is the most touristy spot in the area, with everything that implies: easy access to sunbeds and tavernas, but also crowds in August.

**Vivari and Drepano.** A few kilometres further on, with fish tavernas at the water's edge and noticeably less traffic. A good choice if you want the sea without the bustle.

## South — Ermionida

**Porto Cheli.** An enclosed bay with calm water, popular with sailors. Around it are several small coves that only fill up in August.

**Kosta.** Directly opposite Spetses, with regular boats to the island. Convenient if you want a day on Spetses without staying there.

**Ermioni.** The town is built on a peninsula, so it has sea on both sides. The pine-covered Bisti headland at its tip is one of the finest places to swim in Argolida.

## Practical notes

- Most beaches are reachable by car, but bus services are infrequent. If you plan to move between beaches, a car helps a great deal.
- The meltemi wind blows mainly in July and August. The enclosed bays — Tolo, Porto Cheli, Vivari — stay sheltered.
- In June and September the sea is just as warm and the beaches are half empty.
      `,
    },
  },

  {
    slug: 'ti-na-deis-sto-nafplio',
    area: 'nafplio',
    tint: [0xc4, 0x8f, 0x5a],
    el: {
      title: 'Τι να δεις στο Ναύπλιο',
      excerpt:
        'Παλαμήδι, Μπούρτζι, Παλιά Πόλη — τι αξίζει τον χρόνο σου και πώς να το οργανώσεις.',
      body: `
Το Ναύπλιο ήταν η πρώτη πρωτεύουσα του ελληνικού κράτους και φαίνεται. Ενετικά κτίρια, νεοκλασικά, τρία κάστρα και μια παλιά πόλη που περπατιέται ολόκληρη σε ένα απόγευμα.

## Παλαμήδι

Το ενετικό φρούριο πάνω από την πόλη είναι το πρώτο που θα δεις και το πρώτο που πρέπει να ανέβεις. Η σκάλα λέγεται ότι έχει 999 σκαλιά — στην πραγματικότητα είναι λιγότερα, αλλά θα το νιώσεις ούτως ή άλλως.

Ανέβα νωρίς το πρωί ή αργά το απόγευμα· το μεσημέρι του Ιουλίου η σκάλα είναι εντελώς ακάλυπτη. Υπάρχει και δρόμος με αυτοκίνητο ως την κορυφή, αν προτιμάς.

## Μπούρτζι

Το μικρό φρούριο στο νησάκι μέσα στο λιμάνι είναι το σήμα κατατεθέν της πόλης. Καραβάκια φεύγουν συνεχώς από την προκυμαία. Ακόμα κι αν δεν πας, η θέα του από την παραλιακή το βράδυ φωτισμένο αξίζει.

## Η Παλιά Πόλη

Δεν χρειάζεσαι πρόγραμμα. Η Σταϊκοπούλου και οι κάθετοι δρομάκοι είναι γεμάτοι ταβέρνες και μαγαζιά, και η **Πλατεία Συντάγματος** με το μαρμάρινο δάπεδο είναι από τις ωραιότερες πλατείες στην Ελλάδα.

- **Αρχαιολογικό Μουσείο**, στην ίδια πλατεία — μικρό και καλά οργανωμένο, με ευρήματα από τις Μυκήνες.
- **Μουσείο Κομπολογιού**, ιδιόρρυθμο και ενδιαφέρον.
- **Ακροναυπλία**, το παλαιότερο κάστρο της πόλης, με θέα στον κόλπο.

## Πόσο χρόνο θέλει

Μία μέρα φτάνει για να δεις τα βασικά. Δύο σου επιτρέπουν να τα δεις με την ησυχία σου και να προσθέσεις μια παραλία. Αν χρησιμοποιήσεις το Ναύπλιο ως βάση, οι Μυκήνες και η Επίδαυρος είναι μισή ώρα δρόμος η καθεμιά.

## Πότε

Ο Απρίλιος και ο Μάιος είναι ιδανικοί: ζεστά, ανθισμένα, χωρίς κόσμο. Τον Αύγουστο η πόλη γεμίζει και τα βράδια είναι δύσκολο να βρεις τραπέζι χωρίς κράτηση.
      `,
    },
    en: {
      title: 'What to see in Nafplio',
      excerpt:
        'Palamidi, Bourtzi, the Old Town — what is worth your time and how to plan it.',
      body: `
Nafplio was the first capital of the modern Greek state, and it shows. Venetian buildings, neoclassical mansions, three castles and an old town you can walk end to end in an afternoon.

## Palamidi

The Venetian fortress above the town is the first thing you will see and the first thing you should climb. The staircase is said to have 999 steps — in fact there are fewer, but you will feel it either way.

Go early in the morning or late in the afternoon; at midday in July the stairs are completely exposed. There is also a road to the top if you prefer to drive.

## Bourtzi

The small fortress on the islet in the harbour is the town's emblem. Boats leave for it continuously from the waterfront. Even if you do not go across, seeing it lit up at night from the promenade is worth the walk.

## The Old Town

You do not need a plan. Staikopoulou street and the lanes running off it are full of tavernas and shops, and **Syntagma Square** with its marble paving is one of the finest squares in Greece.

- **Archaeological Museum**, on the same square — small and well arranged, with finds from Mycenae.
- **Worry Bead Museum**, eccentric and genuinely interesting.
- **Akronafplia**, the oldest of the town's castles, overlooking the bay.

## How long you need

One day covers the essentials. Two let you see them unhurried and add a beach. If you use Nafplio as a base, Mycenae and Epidavros are each about half an hour away.

## When to come

April and May are ideal: warm, in flower, and uncrowded. In August the town fills up and finding a table in the evening without booking is difficult.
      `,
    },
  },

  {
    slug: 'epidavros-arxaio-theatro',
    area: 'epidavros',
    tint: [0x8f, 0x9c, 0x72],
    el: {
      title: 'Επίδαυρος: το αρχαίο θέατρο και η γύρω περιοχή',
      excerpt:
        'Το θέατρο με την καλύτερη ακουστική του αρχαίου κόσμου, το Ασκληπιείο, και η βυθισμένη πόλη.',
      body: `
Το αρχαίο θέατρο της Επιδαύρου είναι από τα ελάχιστα μνημεία που δεν απογοητεύουν όσο κι αν έχεις ακούσει γι' αυτά.

## Το θέατρο

Χτίστηκε τον 4ο αιώνα π.Χ. και χωρά περίπου 14.000 θεατές. Αυτό που το κάνει διάσημο είναι η ακουστική: ένας ψίθυρος στην ορχήστρα ακούγεται στην τελευταία σειρά. Θα δεις επισκέπτες να το δοκιμάζουν με κέρματα και σπίρτα — δοκίμασέ το κι εσύ, δουλεύει.

Το θέατρο ήταν μέρος του **Ασκληπιείου**, του μεγάλου θεραπευτικού κέντρου της αρχαιότητας. Ο αρχαιολογικός χώρος γύρω του είναι εκτεταμένος και συχνά αγνοείται από όσους έρχονται μόνο για το θέατρο· αξίζει η επιπλέον ώρα.

## Παραστάσεις

Κάθε καλοκαίρι, συνήθως Ιούλιο και Αύγουστο, δίνονται παραστάσεις αρχαίου δράματος στο πλαίσιο του Φεστιβάλ Αθηνών–Επιδαύρου. Το να παρακολουθήσεις τραγωδία εκεί, με τα πεύκα γύρω και τον ουρανό από πάνω, είναι διαφορετική εμπειρία από το να επισκεφθείς τον χώρο την ημέρα.

Τα εισιτήρια εξαντλούνται νωρίς. Αν σε ενδιαφέρει, κοίτα το πρόγραμμα την άνοιξη.

## Παλαιά Επίδαυρος

Το παραθαλάσσιο χωριό, περίπου δεκαπέντε λεπτά από τον αρχαιολογικό χώρο, είναι ήσυχο και βολικό ως βάση. Έχει δικό του **μικρό θέατρο**, το Μικρό Θέατρο Αρχαίας Επιδαύρου, μέσα στον οικισμό.

Στα ρηχά του κόλπου υπάρχει **βυθισμένη αρχαία πόλη**, ορατή με μάσκα σε μικρό βάθος — ασυνήθιστο πράγμα να το πετύχεις κολυμπώντας.

## Πρακτικά

- Από το Ναύπλιο η διαδρομή είναι περίπου 40 λεπτά.
- Ο χώρος έχει ελάχιστη σκιά. Καπέλο και νερό είναι απαραίτητα το καλοκαίρι.
- Νωρίς το πρωί ο χώρος είναι σχεδόν άδειος και η ακουστική δοκιμάζεται καλύτερα στην ησυχία.
      `,
    },
    en: {
      title: 'Epidavros: the ancient theatre and around',
      excerpt:
        'The theatre with the finest acoustics of the ancient world, the Asklepieion, and a sunken city.',
      body: `
The ancient theatre of Epidavros is one of the few monuments that does not disappoint, however much you have heard about it.

## The theatre

Built in the 4th century BC, it seats roughly 14,000. What makes it famous is the acoustics: a whisper in the orchestra carries to the back row. You will see visitors testing it with coins and matches — try it yourself, it works.

The theatre was part of the **Asklepieion**, the great healing sanctuary of antiquity. The archaeological site around it is extensive and often skipped by those who come only for the theatre; it repays the extra hour.

## Performances

Every summer, usually in July and August, ancient drama is staged here as part of the Athens–Epidaurus Festival. Watching a tragedy in that theatre, with the pines around and the open sky above, is a different experience from visiting the site by day.

Tickets sell out early. If you are interested, check the programme in spring.

## Palaia Epidavros

The seaside village, about fifteen minutes from the archaeological site, is quiet and convenient as a base. It has its own **small theatre**, the Little Theatre of Ancient Epidauros, within the village itself.

In the shallows of the bay lies a **sunken ancient town**, visible with a mask at slight depth — an unusual thing to come across while swimming.

## Practical notes

- From Nafplio the drive is about 40 minutes.
- The site has very little shade. A hat and water are essential in summer.
- Early in the morning the site is almost empty, and the acoustics are better tested in the quiet.
      `,
    },
  },

  {
    slug: 'mykines-odigos',
    area: 'nafplio',
    tint: [0xa8, 0x8a, 0x6c],
    el: {
      title: 'Μυκήνες: οδηγός επίσκεψης',
      excerpt: 'Η Πύλη των Λεόντων, ο θολωτός τάφος και τι αξίζει να ξέρεις πριν πας.',
      body: `
Οι Μυκήνες έδωσαν το όνομά τους σε έναν ολόκληρο πολιτισμό. Ο χώρος είναι μνημείο παγκόσμιας κληρονομιάς της UNESCO και βρίσκεται περίπου μισή ώρα από το Ναύπλιο.

## Τι θα δεις

**Η Πύλη των Λεόντων.** Η κύρια είσοδος της ακρόπολης, με το ανάγλυφο των δύο λεονταριών από πάνω. Είναι το πιο φωτογραφημένο σημείο και δικαίως.

**Ο Ταφικός Κύκλος Α.** Εδώ βρέθηκαν οι χρυσές μάσκες που εκτίθενται σήμερα στο Εθνικό Αρχαιολογικό Μουσείο της Αθήνας — ανάμεσά τους η λεγόμενη «μάσκα του Αγαμέμνονα».

**Ο Θησαυρός του Ατρέως.** Λίγο πριν την ακρόπολη, ένας τεράστιος θολωτός τάφος. Μπαίνεις μέσα και το μέγεθος του θόλου είναι που εντυπωσιάζει, όχι τα ευρήματα.

**Το μουσείο** στον χώρο βοηθά να καταλάβεις τι βλέπεις. Μην το προσπεράσεις.

## Πρακτικά

- Ο χώρος είναι σε λόφο, με ανηφόρα και ανώμαλο έδαφος. Άνετα παπούτσια.
- Σκιά σχεδόν καθόλου. Το καλοκαίρι πήγαινε πρώτο πρωί.
- Δύο με τρεις ώρες αρκούν για ακρόπολη, τάφο και μουσείο.

## Συνδυασμοί

Μυκήνες και Επίδαυρος γίνονται την ίδια μέρα από το Ναύπλιο, αλλά είναι κουραστικό και θα βιαστείς. Αν έχεις τον χρόνο, χώρισέ τα.

Κοντά στις Μυκήνες βρίσκεται και το **Ηραίο του Άργους**, πολύ λιγότερο επισκέψιμο και συνήθως εντελώς ήσυχο.
      `,
    },
    en: {
      title: 'Mycenae: a visitor’s guide',
      excerpt: 'The Lion Gate, the beehive tomb, and what is worth knowing before you go.',
      body: `
Mycenae gave its name to an entire civilisation. The site is a UNESCO World Heritage monument, about half an hour from Nafplio.

## What you will see

**The Lion Gate.** The main entrance to the citadel, with the relief of two lions above it. It is the most photographed spot, and deservedly so.

**Grave Circle A.** This is where the gold masks now displayed in the National Archaeological Museum in Athens were found — among them the so-called Mask of Agamemnon.

**The Treasury of Atreus.** Just before the citadel, an enormous beehive tomb. You walk inside, and it is the scale of the dome that impresses rather than any finds.

**The site museum** helps you make sense of what you are looking at. Do not skip it.

## Practical notes

- The site is on a hill, with a climb and uneven ground. Wear proper shoes.
- There is almost no shade. In summer, go first thing in the morning.
- Two to three hours covers the citadel, the tomb and the museum.

## Combining visits

Mycenae and Epidavros can be done in one day from Nafplio, but it makes for a tiring day and you will rush. If you have the time, split them.

Near Mycenae is also the **Heraion of Argos**, far less visited and usually completely quiet.
      `,
    },
  },
]

function gradientPng(width, height, [r, g, b]) {
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

  const chunks = [Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])]
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8
  ihdr[9] = 2
  chunks.push(chunk('IHDR', ihdr))

  const raw = Buffer.alloc((width * 3 + 1) * height)
  let o = 0
  for (let y = 0; y < height; y++) {
    raw[o++] = 0
    const t = y / height
    for (let x = 0; x < width; x++) {
      const s = 0.6 + 0.4 * (1 - t) + 0.08 * Math.sin((x / width) * Math.PI * 2)
      raw[o++] = Math.min(255, Math.round(r * s))
      raw[o++] = Math.min(255, Math.round(g * s))
      raw[o++] = Math.min(255, Math.round(b * s))
    }
  }
  chunks.push(chunk('IDAT', zlib.deflateSync(raw, { level: 6 })))
  chunks.push(chunk('IEND', Buffer.alloc(0)))
  return Buffer.concat(chunks)
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

  const areas = await api('/api/areas?limit=100', { token })
  const areaBySlug = Object.fromEntries(areas.json.docs.map((a) => [a.slug, a.id]))

  const props = await api('/api/properties?limit=200&depth=1', { token })
  const propsByArea = {}
  for (const p of props.json.docs ?? []) {
    const areaId = typeof p.area === 'object' ? p.area?.id : p.area
    if (!areaId) continue
    ;(propsByArea[areaId] ??= []).push(p.id)
  }

  const existing = await api('/api/articles?limit=100&depth=0', { token })
  const idBySlug = Object.fromEntries((existing.json.docs ?? []).map((d) => [d.slug, d.id]))

  let made = 0
  for (const a of ARTICLES) {
    const png = gradientPng(1600, 900, a.tint)
    const form = new FormData()
    form.append('file', new Blob([png], { type: 'image/png' }), `${a.slug}.png`)
    form.append('_payload', JSON.stringify({ alt: a.el.title }))
    const up = await fetch(`${BASE}/api/media`, {
      method: 'POST',
      headers: { Authorization: `JWT ${token}` },
      body: form,
    })
    const coverImage = (await up.json())?.doc?.id

    const areaId = areaBySlug[a.area]
    const related = (propsByArea[areaId] ?? []).slice(0, 3)

    const greek = {
      title: a.el.title,
      slug: a.slug,
      excerpt: a.el.excerpt,
      body: richText(a.el.body),
      area: areaId,
      coverImage,
      relatedProperties: related,
      publishedAt: new Date().toISOString(),
      _status: 'published',
    }

    const id = idBySlug[a.slug]
    const res = id
      ? await api(`/api/articles/${id}`, { method: 'PATCH', token, body: greek, locale: 'el' })
      : await api('/api/articles', { method: 'POST', token, body: greek, locale: 'el' })

    if (!res.ok) {
      console.log(`  ✗ ${a.el.title}: ${JSON.stringify(res.json).slice(0, 140)}`)
      continue
    }

    // Η αγγλική έκδοση γράφεται χωριστά, στο ίδιο έγγραφο.
    const newId = id ?? res.json?.doc?.id
    const english = await api(`/api/articles/${newId}`, {
      method: 'PATCH',
      token,
      locale: 'en',
      body: {
        title: a.en.title,
        excerpt: a.en.excerpt,
        body: richText(a.en.body),
      },
    })

    made++
    console.log(`  ✓ ${a.el.title}${english.ok ? ' + EN' : ' (χωρίς EN)'} — ${related.length} σχετικά`)
  }

  console.log(`\n${made}/${ARTICLES.length} οδηγοί`)
}

main().catch((e) => {
  console.error('✗', e.message)
  process.exit(1)
})
