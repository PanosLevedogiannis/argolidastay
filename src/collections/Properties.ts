import type { CollectionConfig } from 'payload'

import { revealPhone } from '../endpoints/revealPhone'

/** Ορατό μόνο στο προσωπικό — δεν βγαίνει ποτέ στο δημόσιο API. */
const staffOnly = { read: ({ req: { user } }: { req: { user?: unknown } }) => Boolean(user) }

/**
 * Τα καταλύματα του καταλόγου.
 *
 * Ο κατάλογος φιλοξενεί καταλύματα τρίτων, οπότε κάθε εγγραφή κρατά και τα
 * στοιχεία επικοινωνίας του ιδιοκτήτη: ο επισκέπτης κλείνει απευθείας μαζί
 * του, δεν μεσολαβεί το site.
 *
 * Τα πεδία είναι χωρισμένα σε καρτέλες ώστε η φόρμα να μη γίνεται ένα
 * ατέλειωτο σκρολ για όποιον καταχωρεί.
 */
export const Properties: CollectionConfig = {
  slug: 'properties',
  labels: {
    singular: 'Κατάλυμα',
    plural: 'Καταλύματα',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'area', 'enquiryCount', 'subscriptionUntil', '_status'],
    group: 'Κατάλογος',
    description: 'Τα καταλύματα που εμφανίζονται στον κατάλογο. Χρησιμοποίησε "Αποθήκευση ως πρόχειρο" όσο δουλεύεις μια καταχώρηση και "Δημοσίευση" όταν είναι έτοιμη.',
  },
  access: {
    /**
     * Το προσωπικό βλέπει τα πάντα. Το κοινό βλέπει μόνο όσα έχουν ενεργή
     * συνδρομή: όταν περάσει η ημερομηνία, το κατάλυμα εξαφανίζεται από το
     * site χωρίς να χρειαστεί να θυμηθεί κανείς να το αποδημοσιεύσει.
     * Όσα δεν έχουν καθόλου ημερομηνία θεωρούνται ενεργά (π.χ. δωρεάν).
     */
    read: ({ req: { user } }) => {
      if (user) return true
      return {
        or: [
          { subscriptionUntil: { exists: false } },
          { subscriptionUntil: { greater_than: new Date().toISOString() } },
        ],
      }
    },
  },
  endpoints: [revealPhone],
  versions: {
    drafts: {
      autosave: { interval: 2000 },
    },
    maxPerDoc: 20,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
      label: 'Ονομασία καταλύματος',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: 'Διεύθυνση URL',
      admin: {
        position: 'sidebar',
        description: 'Λατινικοί χαρακτήρες και παύλες, π.χ. "villa-eleni-tolo".',
      },
    },
    {
      /**
       * Πόσα αιτήματα έχει δεχθεί το κατάλυμα.
       *
       * Δεν αποθηκεύεται — υπολογίζεται κάθε φορά που ζητείται η εγγραφή
       * στο πάνελ. Είναι το αντικειμενικό νούμερο που δείχνεις στον
       * ιδιοκτήτη όταν έρθει η ώρα της ανανέωσης: «πήρες 47 αιτήματα».
       *
       * Υπολογίζεται ΜΟΝΟ για το πάνελ. Στο δημόσιο site θα ήταν άχρηστο
       * και θα πρόσθετε ένα ερώτημα ανά κατάλυμα σε κάθε επίσκεψη.
       */
      name: 'enquiryCount',
      type: 'number',
      virtual: true,
      label: 'Αιτήματα',
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Σύνολο αιτημάτων και αποκαλύψεων τηλεφώνου.',
      },
      hooks: {
        afterRead: [
          async ({ req, data }) => {
            if (!req.user || !data?.id) return undefined
            try {
              const res = await req.payload.count({
                collection: 'enquiries',
                where: { property: { equals: data.id } },
                req,
              })
              return res.totalDocs
            } catch {
              return undefined
            }
          },
        ],
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      label: 'Προβεβλημένο',
      admin: {
        position: 'sidebar',
        description: 'Τα προβεβλημένα εμφανίζονται πρώτα στην αρχική σελίδα.',
      },
    },

    {
      type: 'tabs',
      tabs: [
        // ── Βασικά ────────────────────────────────────────────────
        {
          label: 'Βασικά',
          fields: [
            {
              name: 'type',
              type: 'select',
              required: true,
              label: 'Τύπος καταλύματος',
              options: [
                { value: 'apartment', label: 'Διαμέρισμα' },
                { value: 'studio', label: 'Στούντιο' },
                { value: 'maisonette', label: 'Μεζονέτα' },
                { value: 'villa', label: 'Βίλα' },
                { value: 'house', label: 'Μονοκατοικία' },
                { value: 'room', label: 'Δωμάτιο' },
                { value: 'hotel', label: 'Ξενοδοχείο' },
                { value: 'guesthouse', label: 'Ξενώνας' },
              ],
            },
            {
              name: 'area',
              type: 'relationship',
              relationTo: 'areas',
              required: true,
              label: 'Περιοχή',
            },
            {
              name: 'shortDescription',
              type: 'textarea',
              localized: true,
              maxLength: 200,
              label: 'Σύντομη περιγραφή',
              admin: {
                description: 'Μία-δύο προτάσεις. Εμφανίζεται στην κάρτα του καταλύματος μέσα στη λίστα αποτελεσμάτων.',
              },
            },
            {
              name: 'description',
              type: 'richText',
              localized: true,
              label: 'Αναλυτική περιγραφή',
            },
          ],
        },

        // ── Χωρητικότητα ─────────────────────────────────────────
        {
          label: 'Χωρητικότητα',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'guests',
                  type: 'number',
                  required: true,
                  min: 1,
                  label: 'Άτομα',
                  admin: { width: '25%' },
                },
                {
                  name: 'bedrooms',
                  type: 'number',
                  min: 0,
                  label: 'Υπνοδωμάτια',
                  admin: { width: '25%' },
                },
                {
                  name: 'beds',
                  type: 'number',
                  min: 0,
                  label: 'Κρεβάτια',
                  admin: { width: '25%' },
                },
                {
                  name: 'bathrooms',
                  type: 'number',
                  min: 0,
                  label: 'Μπάνια',
                  admin: { width: '25%' },
                },
              ],
            },
            {
              name: 'sizeSqm',
              type: 'number',
              min: 0,
              label: 'Εμβαδόν (τ.μ.)',
            },
            {
              name: 'amenities',
              type: 'relationship',
              relationTo: 'amenities',
              hasMany: true,
              label: 'Παροχές',
            },
          ],
        },

        // ── Φωτογραφίες ──────────────────────────────────────────
        {
          label: 'Φωτογραφίες',
          fields: [
            {
              name: 'coverImage',
              type: 'upload',
              relationTo: 'media',
              required: true,
              label: 'Κύρια φωτογραφία',
              admin: {
                description: 'Αυτή εμφανίζεται στη λίστα αποτελεσμάτων και όταν μοιράζεται ο σύνδεσμος στα social.',
              },
            },
            {
              name: 'gallery',
              type: 'array',
              label: 'Γκαλερί',
              labels: {
                singular: 'Φωτογραφία',
                plural: 'Φωτογραφίες',
              },
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                  label: 'Φωτογραφία',
                },
              ],
            },
          ],
        },

        // ── Τοποθεσία ────────────────────────────────────────────
        {
          label: 'Τοποθεσία',
          fields: [
            {
              name: 'address',
              type: 'text',
              localized: true,
              label: 'Διεύθυνση',
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'latitude',
                  type: 'number',
                  label: 'Συντεταγμένη 1 (πλάτος)',
                  admin: {
                    width: '50%',
                    description:
                      'Στο Google Maps: δεξί κλικ στο σημείο → εμφανίζονται δύο αριθμοί. Ο ΠΡΩΤΟΣ μπαίνει εδώ (π.χ. 37.5675).',
                  },
                },
                {
                  name: 'longitude',
                  type: 'number',
                  label: 'Συντεταγμένη 2 (μήκος)',
                  admin: {
                    width: '50%',
                    description: 'Ο ΔΕΥΤΕΡΟΣ αριθμός (π.χ. 22.8003).',
                  },
                },
              ],
            },
            {
              name: 'distanceToBeach',
              type: 'number',
              min: 0,
              label: 'Απόσταση από θάλασσα (μέτρα)',
            },
          ],
        },

        // ── Τιμές ────────────────────────────────────────────────
        {
          label: 'Τιμές',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'priceFrom',
                  type: 'number',
                  min: 0,
                  label: 'Τιμή από (€)',
                  admin: { width: '50%' },
                },
                {
                  name: 'priceTo',
                  type: 'number',
                  min: 0,
                  label: 'Τιμή έως (€)',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'priceNote',
              type: 'text',
              localized: true,
              label: 'Σημείωση για την τιμή',
              admin: {
                description:
                  'Π.χ. «ανά διανυκτέρευση, ανάλογα με την περίοδο». Αν αφήσεις τις τιμές κενές, το site γράφει «Επικοινωνήστε για τιμές».',
              },
            },
          ],
        },

        // ── Επικοινωνία ──────────────────────────────────────────
        {
          label: 'Επικοινωνία',
          description:
            'Εδώ φτάνουν τα αιτήματα των επισκεπτών. Το τηλέφωνο είναι το κρίσιμο πεδίο — χωρίς αυτό δεν μπορεί να σταλεί ειδοποίηση.',
          fields: [
            {
              name: 'contactName',
              type: 'text',
              required: true,
              label: 'Όνομα ιδιοκτήτη',
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'contactPhone',
                  access: staffOnly,
                  type: 'text',
                  required: true,
                  label: 'Κινητό ιδιοκτήτη',
                  admin: {
                    width: '50%',
                    description: 'Με κωδικό χώρας, π.χ. +306941234567 — έτσι φεύγει το SMS.',
                  },
                },
                {
                  name: 'contactEmail',
                  access: staffOnly,
                  type: 'email',
                  label: 'Email ιδιοκτήτη',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'contactViber',
              access: staffOnly,
              type: 'text',
              label: 'Viber (αν διαφέρει από το κινητό)',
            },
            {
              name: 'bookingLinks',
              type: 'array',
              label: 'Σύνδεσμοι κράτησης',
              admin: {
                description: 'Προαιρετικό. Π.χ. η σελίδα του καταλύματος στο Booking.com ή στο Airbnb.',
              },
              fields: [
                { name: 'platform', type: 'text', required: true, label: 'Πλατφόρμα' },
                { name: 'url', type: 'text', required: true, label: 'Σύνδεσμος' },
              ],
            },
          ],
        },

        // ── Συνδρομή & νομικά ────────────────────────────────────
        {
          label: 'Συνδρομή & νομικά',
          description: 'Εσωτερικά στοιχεία. Το ΜΗΤΕ εμφανίζεται στο site· τα υπόλοιπα όχι.',
          fields: [
            {
              name: 'mite',
              type: 'text',
              label: 'Αριθμός ΜΗΤΕ',
              admin: {
                description:
                  'Τα τουριστικά καταλύματα υποχρεούνται να αναγράφουν τον αριθμό μητρώου τους στις καταχωρήσεις. Εμφανίζεται στη σελίδα του καταλύματος.',
              },
            },
            {
              name: 'subscriptionUntil',
              access: staffOnly,
              type: 'date',
              label: 'Συνδρομή έως',
              admin: {
                date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' },
                description:
                  'Μετά την ημερομηνία αυτή το κατάλυμα κρύβεται αυτόματα από το site, ακόμα κι αν είναι δημοσιευμένο.',
              },
            },
            {
              name: 'internalNotes',
              access: staffOnly,
              type: 'textarea',
              label: 'Εσωτερικές σημειώσεις',
              admin: {
                description: 'Δεν εμφανίζονται πουθενά στο site. Μόνο για εσένα.',
              },
            },
          ],
        },
      ],
    },
  ],
}
