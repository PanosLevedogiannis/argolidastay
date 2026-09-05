import type { CollectionConfig } from 'payload'

/**
 * Φωτογραφίες καταλυμάτων και περιοχών.
 *
 * Τα μεγέθη παράγονται αυτόματα κατά το ανέβασμα, ώστε ο διαχειριστής να
 * ανεβάζει απλώς τη φωτογραφία από το κινητό του χωρίς να σκέφτεται
 * διαστάσεις — το site σερβίρει το κατάλληλο μέγεθος ανά συσκευή.
 */
export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Φωτογραφία',
    plural: 'Φωτογραφίες',
  },
  admin: {
    group: 'Περιεχόμενο',
  },
  access: {
    read: () => true,
  },
  upload: {
    /**
     * Ο φάκελος αποθήκευσης ορίζεται από μεταβλητή ώστε στον server να
     * δείχνει σε volume που επιβιώνει των deploy. Αν χαθεί αυτό, χάνονται
     * όλες οι φωτογραφίες με την πρώτη ενημέρωση.
     */
    staticDir: process.env.MEDIA_DIR || 'media',
    mimeTypes: ['image/*'],
    focalPoint: true,
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 768, height: 512, position: 'centre' },
      { name: 'hero', width: 1920, height: 1080, position: 'centre' },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      localized: true,
      label: 'Περιγραφή εικόνας',
      admin: {
        description: 'Σύντομη περιγραφή του τι δείχνει η φωτογραφία. Τη διαβάζουν οι μηχανές αναζήτησης και οι χρήστες με προβλήματα όρασης.',
      },
    },
    {
      name: 'credit',
      type: 'text',
      label: 'Πηγή / φωτογράφος',
      admin: {
        description: 'Προαιρετικό. Συμπλήρωσέ το αν η φωτογραφία δεν είναι δική μας.',
      },
    },
  ],
}
