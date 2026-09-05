import type { CollectionConfig } from 'payload'

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
    defaultColumns: ['name', 'area', 'type', 'guests', '_status'],
    group: 'Κατάλογος',
    description: 'Τα καταλύματα που εμφανίζονται στον κατάλογο. Χρησιμοποίησε "Αποθήκευση ως πρόχειρο" όσο δουλεύεις μια καταχώρηση και "Δημοσίευση" όταν είναι έτοιμη.',
  },
  access: {
    read: () => true,
  },
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
                  label: 'Γεωγρ. πλάτος',
                  admin: { width: '50%' },
                },
                {
                  name: 'longitude',
                  type: 'number',
                  label: 'Γεωγρ. μήκος',
                  admin: { width: '50%' },
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

        // ── Τιμές & κρατήσεις ────────────────────────────────────
        {
          label: 'Τιμές & κρατήσεις',
          fields: [
            {
              name: 'priceFrom',
              type: 'number',
              min: 0,
              label: 'Τιμή από (€ / διανυκτέρευση)',
              admin: {
                description: 'Ενδεικτική χαμηλότερη τιμή. Άφησέ το κενό αν δεν θέλεις να εμφανίζεται τιμή.',
              },
            },
            {
              name: 'contactName',
              type: 'text',
              label: 'Όνομα ιδιοκτήτη',
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'contactPhone',
                  type: 'text',
                  label: 'Τηλέφωνο',
                  admin: { width: '50%' },
                },
                {
                  name: 'contactEmail',
                  type: 'email',
                  label: 'Email',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'bookingLinks',
              type: 'array',
              label: 'Σύνδεσμοι κράτησης',
              admin: {
                description: 'Π.χ. η σελίδα του καταλύματος στο Booking.com ή στο Airbnb.',
              },
              fields: [
                {
                  name: 'platform',
                  type: 'text',
                  required: true,
                  label: 'Πλατφόρμα',
                },
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                  label: 'Σύνδεσμος',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
