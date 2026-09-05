import type { CollectionConfig } from 'payload'

/**
 * Λογαριασμοί που μπαίνουν στο πάνελ διαχείρισης.
 * Δεν είναι οι επισκέπτες του site — μόνο το προσωπικό.
 */
export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'Χρήστης',
    plural: 'Χρήστες',
  },
  auth: true,
  admin: {
    useAsTitle: 'email',
    group: 'Σύστημα',
    defaultColumns: ['name', 'email', 'role'],
  },
  access: {
    // Μόνο οι διαχειριστές δημιουργούν ή σβήνουν λογαριασμούς.
    create: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Ονοματεπώνυμο',
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      label: 'Ρόλος',
      options: [
        { value: 'admin', label: 'Διαχειριστής' },
        { value: 'editor', label: 'Συντάκτης' },
      ],
      admin: {
        description: 'Ο συντάκτης διαχειρίζεται καταλύματα και περιεχόμενο. Ο διαχειριστής επιπλέον διαχειρίζεται χρήστες.',
      },
    },
  ],
}
