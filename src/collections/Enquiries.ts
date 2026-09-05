import type { CollectionConfig } from 'payload'

import { buildSmsText, sendSms } from '../lib/notifications'

/**
 * Αιτήματα επικοινωνίας.
 *
 * Ο επισκέπτης αφήνει το τηλέφωνό του, και ο ιδιοκτήτης ειδοποιείται ώστε
 * να τον πάρει. Το site δεν μεσολαβεί σε τιμές ή κρατήσεις — απλώς φέρνει
 * τους δύο σε επαφή.
 *
 * Κρατάμε κάθε αίτημα και μετά την αποστολή, γιατί το «πόσα αιτήματα πήρε
 * το κατάλυμά σου φέτος» είναι το μόνο αντικειμενικό επιχείρημα όταν
 * ζητηθεί ανανέωση συνδρομής.
 */
export const Enquiries: CollectionConfig = {
  slug: 'enquiries',
  labels: {
    singular: 'Αίτημα επικοινωνίας',
    plural: 'Αιτήματα επικοινωνίας',
  },
  admin: {
    useAsTitle: 'visitorName',
    defaultColumns: ['property', 'type', 'visitorName', 'visitorPhone', 'status', 'createdAt'],
    group: 'Κατάλογος',
    description:
      'Κάθε εκδήλωση ενδιαφέροντος ανά κατάλυμα — είτε συμπληρωμένη φόρμα είτε απλή αποκάλυψη τηλεφώνου.',
  },
  access: {
    // Οποιοσδήποτε επισκέπτης μπορεί να υποβάλει αίτημα από τη φόρμα...
    create: () => true,
    // ...αλλά μόνο το προσωπικό βλέπει τα στοιχεία επικοινωνίας.
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  hooks: {
    /**
     * Μόλις καταχωρηθεί αίτημα κλήσης, ειδοποιείται ο ιδιοκτήτης.
     *
     * Τρέχει μετά την αποθήκευση και ποτέ δεν ρίχνει σφάλμα προς τα έξω:
     * αν πέσει ο πάροχος SMS, το αίτημα έχει ήδη σωθεί και φαίνεται στο
     * πάνελ — προτιμότερο από το να δει ο επισκέπτης σφάλμα και να φύγει.
     *
     * Το `req` περνιέται σε κάθε κλήση ώστε να συμμετέχουν στην ίδια
     * συναλλαγή με τη δημιουργία. Χωρίς αυτό η εγγραφή δεν είναι ακόμα
     * ορατή και η ενημέρωση αποτυγχάνει με «δεν βρέθηκε».
     */
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation !== 'create' || doc.type !== 'callback') return doc

        try {
          const property = await req.payload.findByID({
            collection: 'properties',
            id: typeof doc.property === 'object' ? doc.property.id : doc.property,
            depth: 0,
            overrideAccess: true,
            req,
          })

          if (!property?.contactPhone) {
            await req.payload.update({
              collection: 'enquiries',
              id: doc.id,
              data: { notificationLog: 'Δεν στάλθηκε: το κατάλυμα δεν έχει κινητό.' },
              overrideAccess: true,
              req,
            })
            return doc
          }

          const text = buildSmsText({
            ownerPhone: property.contactPhone,
            propertyName: String(property.name ?? ''),
            visitorName: doc.visitorName,
            visitorPhone: doc.visitorPhone,
            checkIn: doc.checkIn,
            checkOut: doc.checkOut,
            guests: doc.guests,
          })

          const result = await sendSms(property.contactPhone, text)
          const stamp = new Date().toLocaleString('el-GR')

          await req.payload.update({
            collection: 'enquiries',
            id: doc.id,
            data: {
              notificationLog: `${stamp} — ${result.provider}: ${result.detail}`,
              ...(result.ok ? { status: 'notified' } : {}),
            },
            overrideAccess: true,
            req,
          })
        } catch (err) {
          req.payload.logger.error(`Αποτυχία ειδοποίησης για αίτημα ${doc.id}: ${err}`)
        }

        return doc
      },
    ],
  },
  fields: [
    {
      name: 'property',
      type: 'relationship',
      relationTo: 'properties',
      required: true,
      index: true,
      label: 'Κατάλυμα',
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'callback',
      index: true,
      label: 'Είδος',
      options: [
        { value: 'callback', label: 'Ζήτησε να τον καλέσουν' },
        { value: 'phone_reveal', label: 'Είδε το τηλέφωνο' },
      ],
      admin: {
        description:
          'Η «αποκάλυψη τηλεφώνου» καταγράφεται αυτόματα όταν κάποιος πατήσει «Δες τηλέφωνο». Δεν έχει στοιχεία επικοινωνίας — μετράει μόνο ως ενδιαφέρον.',
      },
    },
    {
      name: 'visitorName',
      type: 'text',
      label: 'Όνομα επισκέπτη',
      validate: (value: unknown, { siblingData }: { siblingData?: { type?: string } }) => {
        if (siblingData?.type === 'callback' && !value) return 'Απαιτείται για αίτημα κλήσης.'
        return true
      },
    },
    {
      name: 'visitorPhone',
      type: 'text',
      label: 'Τηλέφωνο επισκέπτη',
      validate: (value: unknown, { siblingData }: { siblingData?: { type?: string } }) => {
        if (siblingData?.type === 'callback' && !value) return 'Απαιτείται για αίτημα κλήσης.'
        return true
      },
    },
    {
      name: 'visitorEmail',
      type: 'email',
      label: 'Email επισκέπτη',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'checkIn',
          type: 'date',
          label: 'Άφιξη',
          admin: {
            width: '33%',
            date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' },
          },
        },
        {
          name: 'checkOut',
          type: 'date',
          label: 'Αναχώρηση',
          admin: {
            width: '33%',
            date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' },
          },
        },
        {
          name: 'guests',
          type: 'number',
          min: 1,
          label: 'Άτομα',
          admin: { width: '33%' },
        },
      ],
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'Μήνυμα',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      index: true,
      label: 'Κατάσταση',
      options: [
        { value: 'new', label: 'Νέο' },
        { value: 'notified', label: 'Ειδοποιήθηκε ο ιδιοκτήτης' },
        { value: 'contacted', label: 'Έγινε επικοινωνία' },
        { value: 'booked', label: 'Έκλεισε' },
        { value: 'lost', label: 'Χάθηκε' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'notificationLog',
      type: 'textarea',
      label: 'Ιστορικό ειδοποιήσεων',
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Συμπληρώνεται αυτόματα: πότε και πώς ειδοποιήθηκε ο ιδιοκτήτης.',
      },
    },
    {
      name: 'locale',
      type: 'text',
      label: 'Γλώσσα επισκέπτη',
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Σε ποια γλώσσα έβλεπε το site — χρήσιμο για τον ιδιοκτήτη.',
      },
    },
  ],
}
