import type { CollectionConfig } from 'payload'

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
    defaultColumns: ['visitorName', 'visitorPhone', 'property', 'status', 'createdAt'],
    group: 'Κατάλογος',
    description:
      'Όσοι ζήτησαν να τους καλέσει κάποιο κατάλυμα. Άλλαξε την κατάσταση καθώς τα διαχειρίζεσαι.',
  },
  access: {
    // Οποιοσδήποτε επισκέπτης μπορεί να υποβάλει αίτημα από τη φόρμα...
    create: () => true,
    // ...αλλά μόνο το προσωπικό βλέπει τα στοιχεία επικοινωνίας.
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => user?.role === 'admin',
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
      name: 'visitorName',
      type: 'text',
      required: true,
      label: 'Όνομα επισκέπτη',
    },
    {
      name: 'visitorPhone',
      type: 'text',
      required: true,
      label: 'Τηλέφωνο επισκέπτη',
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
