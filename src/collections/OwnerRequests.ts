import type { CollectionConfig } from 'payload'

/**
 * Ιδιοκτήτες που ζητούν να μπουν στον κατάλογο.
 *
 * Ξεχωριστό από τα αιτήματα επισκεπτών: εδώ δεν υπάρχει ακόμα κατάλυμα να
 * δείξει η εγγραφή — αυτό ακριβώς ζητείται. Είναι η λίστα με τους πελάτες
 * που περιμένουν καταχώρηση, οπότε η κατάσταση παρακολουθεί την πώληση,
 * όχι την εξυπηρέτηση.
 */
export const OwnerRequests: CollectionConfig = {
  slug: 'owner-requests',
  labels: {
    singular: 'Αίτημα καταχώρησης',
    plural: 'Αιτήματα καταχώρησης',
  },
  admin: {
    useAsTitle: 'ownerName',
    defaultColumns: ['ownerName', 'phone', 'propertyName', 'areaName', 'status', 'createdAt'],
    group: 'Κατάλογος',
    description: 'Ιδιοκτήτες που ζήτησαν να μπει το κατάλυμά τους στον κατάλογο.',
  },
  access: {
    create: () => true,
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'ownerName',
      type: 'text',
      required: true,
      label: 'Ονοματεπώνυμο',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'phone',
          type: 'text',
          required: true,
          label: 'Τηλέφωνο',
          admin: { width: '50%' },
        },
        {
          name: 'email',
          type: 'email',
          label: 'Email',
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'propertyName',
      type: 'text',
      label: 'Ονομασία καταλύματος',
    },
    {
      name: 'areaName',
      type: 'text',
      label: 'Περιοχή',
      admin: {
        description: 'Όπως τη γράφει ο ιδιοκτήτης — μπορεί να μην αντιστοιχεί σε καταχωρημένη.',
      },
    },
    {
      name: 'propertyType',
      type: 'text',
      label: 'Τύπος καταλύματος',
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
        { value: 'contacted', label: 'Έγινε επικοινωνία' },
        { value: 'collecting', label: 'Συγκεντρώνουμε υλικό' },
        { value: 'published', label: 'Καταχωρήθηκε' },
        { value: 'declined', label: 'Δεν προχώρησε' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'internalNotes',
      type: 'textarea',
      label: 'Εσωτερικές σημειώσεις',
      admin: { position: 'sidebar' },
    },
  ],
}
