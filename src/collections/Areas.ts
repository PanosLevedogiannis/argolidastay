import type { CollectionConfig } from 'payload'

/**
 * Περιοχές της Αργολίδας (Ναύπλιο, Τολό, Επίδαυρος, Πόρτο Χέλι, ...).
 *
 * Ξεχωριστό collection και όχι απλό κείμενο μέσα στο κατάλυμα, ώστε:
 *  - να μη γράφεται το «Ναύπλιο» με δέκα διαφορετικούς τρόπους,
 *  - να μπορεί κάθε περιοχή να έχει δική της σελίδα προορισμού (SEO),
 *  - να δουλεύει το φιλτράρισμα «δείξε μου ό,τι υπάρχει στο Τολό».
 */
export const Areas: CollectionConfig = {
  slug: 'areas',
  labels: {
    singular: 'Περιοχή',
    plural: 'Περιοχές',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug'],
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
      label: 'Όνομα περιοχής',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: 'Διεύθυνση URL',
      admin: {
        description: 'Με λατινικούς χαρακτήρες, π.χ. "nafplio". Εμφανίζεται στη διεύθυνση: argolidastay.gr/perioches/nafplio',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      label: 'Περιγραφή',
      admin: {
        description: 'Λίγες γραμμές για την περιοχή. Εμφανίζεται στην κορυφή της σελίδας της περιοχής.',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Φωτογραφία περιοχής',
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      label: 'Προβολή στην αρχική',
    },
  ],
}
