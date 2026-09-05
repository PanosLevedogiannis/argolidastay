import type { CollectionConfig } from 'payload'

/**
 * Παροχές (WiFi, πισίνα, πάρκινγκ, θέα θάλασσα, ...).
 *
 * Ξεχωριστό collection ώστε τα φίλτρα αναζήτησης να δουλεύουν σε σταθερή
 * λίστα και όχι σε ελεύθερο κείμενο. Ο διαχειριστής προσθέτει μία φορά την
 * παροχή και μετά απλώς την τσεκάρει σε κάθε κατάλυμα.
 */
export const Amenities: CollectionConfig = {
  slug: 'amenities',
  labels: {
    singular: 'Παροχή',
    plural: 'Παροχές',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category'],
    group: 'Κατάλογος',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
      label: 'Ονομασία',
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'general',
      label: 'Κατηγορία',
      options: [
        { value: 'general', label: 'Γενικά' },
        { value: 'kitchen', label: 'Κουζίνα' },
        { value: 'outdoor', label: 'Εξωτερικός χώρος' },
        { value: 'accessibility', label: 'Προσβασιμότητα' },
        { value: 'family', label: 'Οικογένεια' },
      ],
    },
    {
      name: 'icon',
      type: 'text',
      label: 'Εικονίδιο',
      admin: {
        description: 'Προαιρετικό. Όνομα εικονιδίου (π.χ. "wifi", "pool") — χρησιμοποιείται από το site για την εμφάνιση.',
      },
    },
  ],
}
