/**
 * Διγλωσσία του δημόσιου site.
 *
 * Τα ελληνικά είναι η προεπιλογή και ΔΕΝ έχουν πρόθεμα στη διεύθυνση
 * (`/katalymata`), τα αγγλικά έχουν (`/en/katalymata`). Η επιλογή είναι
 * συνειδητή: το κύριο κοινό είναι ελληνικό, και οι καθαρές διευθύνσεις
 * μετράνε — ενώ το πρόθεμα για τα αγγλικά δίνει στο Google δύο ξεχωριστές
 * σελίδες να ευρετηριάσει, που είναι όλος ο λόγος ύπαρξης της μετάφρασης.
 *
 * Το περιεχόμενο (ονόματα καταλυμάτων, περιγραφές) μεταφράζεται από το
 * Payload — αρκεί να του περάσουμε το locale. Εδώ ζουν μόνο τα σταθερά
 * κείμενα της διεπαφής.
 */

export const LOCALES = ['el', 'en'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'el'

/** Το πρόθεμα διαδρομής για κάθε γλώσσα. Τα ελληνικά δεν έχουν. */
export function prefix(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? '' : `/${locale}`
}

/** Φτιάχνει διαδρομή στη σωστή γλώσσα: href('en', '/katalymata') → '/en/katalymata' */
export function href(locale: Locale, path: string): string {
  const clean = path === '/' ? '' : path
  return `${prefix(locale)}${clean}` || '/'
}

/**
 * Η αντίστοιχη διαδρομή στην άλλη γλώσσα, για τον επιλογέα γλώσσας.
 * Ο επισκέπτης πρέπει να μένει στη σελίδα που διάβαζε, όχι να πετάγεται
 * στην αρχική.
 */
export function switchPath(currentPath: string, to: Locale): string {
  const withoutPrefix = currentPath.replace(/^\/en(?=\/|$)/, '') || '/'
  return href(to, withoutPrefix)
}

type Dict = Record<string, string>

const el: Dict = {
  'nav.properties': 'Καταλύματα',
  'nav.areas': 'Περιοχές',
  'nav.guides': 'Οδηγοί',
  'nav.listYours': 'Καταχώρησε το κατάλυμά σου',

  'search.area': 'Περιοχή',
  'search.allAreas': 'Όλη η Αργολίδα',
  'search.guests': 'Άτομα',
  'search.anyGuests': 'Οποιαδήποτε',
  'search.type': 'Τύπος',
  'search.anyType': 'Κάθε τύπος',
  'search.submit': 'Αναζήτηση',
  'search.amenities': 'Παροχές',
  'search.clear': 'Καθαρισμός',
  'search.text': 'Αναζήτηση με όνομα',
  'sort.label': 'Ταξινόμηση',
  'sort.featured': 'Προτεινόμενα πρώτα',
  'sort.priceAsc': 'Φθηνότερα πρώτα',
  'sort.priceDesc': 'Ακριβότερα πρώτα',
  'sort.guests': 'Περισσότερα άτομα',
  'sort.newest': 'Νεότερα πρώτα',

  'home.eyebrow': 'Αργολίδα',
  'home.title': 'Βρες πού θα μείνεις, μίλα κατευθείαν με τον ιδιοκτήτη',
  'home.subtitle':
    'Δωμάτια, διαμερίσματα και βίλες σε Ναύπλιο, Τολό, Επίδαυρο και όλη την Αργολίδα. Χωρίς μεσάζοντες, χωρίς προμήθειες.',
  'home.stat.properties': 'καταλύματα',
  'home.stat.areas': 'περιοχές',
  'home.stat.commission': 'προμήθεια',
  'home.featured': 'Προτεινόμενα καταλύματα',
  'home.recent': 'Πρόσφατες καταχωρήσεις',
  'home.featuredSub': 'Διαλεγμένα από όλη την Αργολίδα.',
  'home.seeAll': 'Δες όλα',
  'home.areasTitle': 'Πού θέλεις να μείνεις;',
  'home.areasSub': 'Κάθε γωνιά της Αργολίδας έχει τον δικό της χαρακτήρα.',
  'home.howTitle': 'Πώς δουλεύει',
  'home.how1': 'Ψάξε',
  'home.how1d':
    'Φιλτράρισε με περιοχή, άτομα και τύπο καταλύματος μέχρι να βρεις κάτι που σου ταιριάζει.',
  'home.how2': 'Επικοινώνησε',
  'home.how2d': 'Δες το τηλέφωνο του ιδιοκτήτη ή άφησε το δικό σου για να σε καλέσει εκείνος.',
  'home.how3': 'Κλείσε απευθείας',
  'home.how3d': 'Συμφωνείτε τιμή και ημερομηνίες μεταξύ σας. Το site δεν παίρνει προμήθεια.',
  'home.ownerCta': 'Έχεις κατάλυμα στην Αργολίδα;',
  'home.ownerCtaSub':
    'Καταχώρησέ το και δέξου τηλεφωνήματα απευθείας από τους επισκέπτες. Χωρίς προμήθεια ανά κράτηση.',

  'list.title': 'Καταλύματα στην Αργολίδα',
  'list.none': 'Κανένα αποτέλεσμα',
  'list.one': 'κατάλυμα',
  'list.many': 'καταλύματα',
  'list.emptyTitle': 'Δεν βρέθηκε κατάλυμα με αυτά τα κριτήρια',
  'list.emptyBody':
    'Δοκίμασε λιγότερα φίλτρα — για παράδειγμα χωρίς συγκεκριμένη περιοχή ή με μικρότερο αριθμό ατόμων.',
  'list.seeAll': 'Δες όλα τα καταλύματα',
  'list.prev': 'Προηγούμενη',
  'list.next': 'Επόμενη',
  'list.pageOf': 'Σελίδα {a} από {b}',

  'areas.title': 'Περιοχές της Αργολίδας',
  'areas.subtitle':
    'Από το Ναύπλιο και την Επίδαυρο μέχρι το Πόρτο Χέλι — διάλεξε πού θέλεις να μείνεις.',
  'areas.empty': 'Χωρίς καταχωρήσεις ακόμα',
  'areas.seeAllIn': 'Δες και τα {n}',
  'areas.guidesFor': 'Οδηγοί για {name}',
  'areas.noneHere': 'Δεν υπάρχουν καταχωρήσεις ακόμα σε αυτή την περιοχή.',

  'guides.title': 'Οδηγοί για την Αργολίδα',
  'guides.subtitle': 'Τι να δεις, πού να κολυμπήσεις και πώς να κινηθείς.',
  'guides.empty': 'Δεν έχουν δημοσιευτεί οδηγοί ακόμα.',
  'guides.related': 'Καταλύματα στην περιοχή',
  'guides.relatedSub': 'Από «τι να δεις» σε «πού θα μείνεις».',

  'prop.description': 'Περιγραφή',
  'prop.amenities': 'Παροχές',
  'prop.location': 'Τοποθεσία',
  'prop.noMap': 'Ο ακριβής χάρτης δεν έχει καταχωρηθεί. Ρώτησε τον ιδιοκτήτη.',
  'prop.toBeach': 'μέτρα από τη θάλασσα',
  'prop.mite': 'Αρ. ΜΗΤΕ',
  'prop.guest': 'άτομο',
  'prop.guests': 'άτομα',
  'prop.bedroom': 'υπνοδωμάτιο',
  'prop.bedrooms': 'υπνοδωμάτια',
  'prop.bed': 'κρεβάτι',
  'prop.beds': 'κρεβάτια',
  'prop.bathroom': 'μπάνιο',
  'prop.bathrooms': 'μπάνια',
  'prop.sqm': 'τ.μ.',
  'prop.inArea': 'στην περιοχή',
  'prop.nearby': 'Άλλα καταλύματα στην περιοχή',

  'contact.askPrice': 'Επικοινωνήστε για τιμές',
  'contact.priceNote': 'ενδεικτικά, ανά διανυκτέρευση',
  'contact.showPhone': 'Δες τηλέφωνο',
  'contact.loading': 'Φόρτωση…',
  'contact.or': 'ή',
  'contact.callMe': 'Να με καλέσουν',
  'contact.phoneOf': 'Επικοινωνία',
  'contact.phone': 'Τηλέφωνο επικοινωνίας',
  'contact.viber': 'Μήνυμα στο Viber',
  'contact.yourName': 'Το όνομά σου',
  'contact.yourPhone': 'Το τηλέφωνό σου',
  'contact.checkIn': 'Άφιξη',
  'contact.checkOut': 'Αναχώρηση',
  'contact.message': 'Μήνυμα (προαιρετικό)',
  'contact.send': 'Στείλε το αίτημα',
  'contact.sending': 'Αποστολή…',
  'contact.privacy': 'Το τηλέφωνό σου πάει μόνο στον ιδιοκτήτη αυτού του καταλύματος.',
  'contact.sentTitle': 'Το αίτημα στάλθηκε',
  'contact.sentBody': 'Ο ιδιοκτήτης ειδοποιήθηκε και θα σε καλέσει.',
  'contact.error': 'Κάτι πήγε στραβά. Δοκίμασε ξανά.',

  'footer.tagline':
    'Καταλύματα στην Αργολίδα. Επικοινωνείτε απευθείας με τον ιδιοκτήτη — χωρίς μεσάζοντες και χωρίς προμήθειες.',
  'footer.browse': 'Περιήγηση',
  'footer.allProperties': 'Όλα τα καταλύματα',
  'footer.forOwners': 'Για ιδιοκτήτες',
  'footer.listing': 'Καταχώρηση καταλύματος',
  'footer.legal':
    'Οι τιμές και η διαθεσιμότητα συμφωνούνται απευθείας με τον ιδιοκτήτη κάθε καταλύματος.',
  'footer.contact': 'Επικοινωνία',
  'footer.terms': 'Όροι χρήσης',
  'footer.privacy': 'Πολιτική απορρήτου',
}

const en: Dict = {
  'nav.properties': 'Stays',
  'nav.areas': 'Areas',
  'nav.guides': 'Guides',
  'nav.listYours': 'List your property',

  'search.area': 'Area',
  'search.allAreas': 'All of Argolida',
  'search.guests': 'Guests',
  'search.anyGuests': 'Any',
  'search.type': 'Type',
  'search.anyType': 'Any type',
  'search.submit': 'Search',
  'search.amenities': 'Amenities',
  'search.clear': 'Clear',
  'search.text': 'Search by name',
  'sort.label': 'Sort',
  'sort.featured': 'Featured first',
  'sort.priceAsc': 'Cheapest first',
  'sort.priceDesc': 'Most expensive first',
  'sort.guests': 'Most guests',
  'sort.newest': 'Newest first',

  'home.eyebrow': 'Argolida, Greece',
  'home.title': 'Find your stay, talk directly to the owner',
  'home.subtitle':
    'Rooms, apartments and villas in Nafplio, Tolo, Epidavros and across Argolida. No middlemen, no commission.',
  'home.stat.properties': 'places to stay',
  'home.stat.areas': 'areas',
  'home.stat.commission': 'commission',
  'home.featured': 'Featured stays',
  'home.recent': 'Recently added',
  'home.featuredSub': 'Hand-picked from across Argolida.',
  'home.seeAll': 'See all',
  'home.areasTitle': 'Where would you like to stay?',
  'home.areasSub': 'Every corner of Argolida has its own character.',
  'home.howTitle': 'How it works',
  'home.how1': 'Search',
  'home.how1d': 'Filter by area, number of guests and property type until something fits.',
  'home.how2': 'Get in touch',
  'home.how2d': "See the owner's phone number, or leave yours and they will call you.",
  'home.how3': 'Book directly',
  'home.how3d': 'You agree on price and dates between you. We take no commission.',
  'home.ownerCta': 'Do you own a property in Argolida?',
  'home.ownerCtaSub':
    'List it and take calls directly from visitors. No commission per booking.',

  'list.title': 'Places to stay in Argolida',
  'list.none': 'No results',
  'list.one': 'property',
  'list.many': 'properties',
  'list.emptyTitle': 'No property matches these filters',
  'list.emptyBody':
    'Try fewer filters — for example without a specific area, or with fewer guests.',
  'list.seeAll': 'See all properties',
  'list.prev': 'Previous',
  'list.next': 'Next',
  'list.pageOf': 'Page {a} of {b}',

  'areas.title': 'Areas of Argolida',
  'areas.subtitle':
    'From Nafplio and Epidavros to Porto Cheli — choose where you want to stay.',
  'areas.empty': 'No listings yet',
  'areas.seeAllIn': 'See all {n}',
  'areas.guidesFor': 'Guides for {name}',
  'areas.noneHere': 'No listings in this area yet.',

  'guides.title': 'Guides to Argolida',
  'guides.subtitle': 'What to see, where to swim and how to get around.',
  'guides.empty': 'No guides published yet.',
  'guides.related': 'Places to stay nearby',
  'guides.relatedSub': 'From what to see to where to sleep.',

  'prop.description': 'Description',
  'prop.amenities': 'Amenities',
  'prop.location': 'Location',
  'prop.noMap': 'No exact map provided. Ask the owner for directions.',
  'prop.toBeach': 'metres from the beach',
  'prop.mite': 'Reg. no.',
  'prop.guest': 'guest',
  'prop.guests': 'guests',
  'prop.bedroom': 'bedroom',
  'prop.bedrooms': 'bedrooms',
  'prop.bed': 'bed',
  'prop.beds': 'beds',
  'prop.bathroom': 'bathroom',
  'prop.bathrooms': 'bathrooms',
  'prop.sqm': 'm²',
  'prop.inArea': 'in',
  'prop.nearby': 'More places to stay in',

  'contact.askPrice': 'Contact for prices',
  'contact.priceNote': 'indicative, per night',
  'contact.showPhone': 'Show phone number',
  'contact.loading': 'Loading…',
  'contact.or': 'or',
  'contact.callMe': 'Ask them to call me',
  'contact.phoneOf': 'Contact',
  'contact.phone': 'Phone number',
  'contact.viber': 'Message on Viber',
  'contact.yourName': 'Your name',
  'contact.yourPhone': 'Your phone number',
  'contact.checkIn': 'Check-in',
  'contact.checkOut': 'Check-out',
  'contact.message': 'Message (optional)',
  'contact.send': 'Send request',
  'contact.sending': 'Sending…',
  'contact.privacy': 'Your number goes only to the owner of this property.',
  'contact.sentTitle': 'Request sent',
  'contact.sentBody': 'The owner has been notified and will call you.',
  'contact.error': 'Something went wrong. Please try again.',

  'footer.tagline':
    'Places to stay in Argolida. Talk directly to the owner — no middlemen, no commission.',
  'footer.browse': 'Browse',
  'footer.allProperties': 'All properties',
  'footer.forOwners': 'For owners',
  'footer.listing': 'List a property',
  'footer.legal': 'Prices and availability are agreed directly with each property owner.',
  'footer.contact': 'Contact',
  'footer.terms': 'Terms of use',
  'footer.privacy': 'Privacy policy',
}

const DICTS: Record<Locale, Dict> = { el, en }

/** Μετάφραση με προαιρετική αντικατάσταση: t('el','list.pageOf',{a:1,b:3}) */
export function t(
  locale: Locale,
  key: string,
  vars?: Record<string, string | number>,
): string {
  let s = DICTS[locale][key] ?? DICTS[DEFAULT_LOCALE][key] ?? key
  if (vars) {
    for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v))
  }
  return s
}

export const PROPERTY_TYPES: Record<Locale, Record<string, string>> = {
  el: {
    apartment: 'Διαμέρισμα',
    studio: 'Στούντιο',
    maisonette: 'Μεζονέτα',
    villa: 'Βίλα',
    house: 'Μονοκατοικία',
    room: 'Δωμάτιο',
    hotel: 'Ξενοδοχείο',
    guesthouse: 'Ξενώνας',
  },
  en: {
    apartment: 'Apartment',
    studio: 'Studio',
    maisonette: 'Maisonette',
    villa: 'Villa',
    house: 'House',
    room: 'Room',
    hotel: 'Hotel',
    guesthouse: 'Guesthouse',
  },
}
