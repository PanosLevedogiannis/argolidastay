import type { CollectionConfig } from 'payload'

/**
 * Άρθρα και οδηγοί για την Αργολίδα.
 *
 * Ο λόγος ύπαρξής τους είναι το Google. Ένας σκέτος κατάλογος καταλυμάτων
 * ανταγωνίζεται το Booking και χάνει· ένα άρθρο «Παραλίες κοντά στο Τολό»
 * πιάνει αναζητήσεις που το Booking δεν καλύπτει, και από εκεί ο επισκέπτης
 * περνάει στα καταλύματα.
 *
 * Γι' αυτό κάθε άρθρο μπορεί να δείχνει σε συγκεκριμένη περιοχή και σε
 * επιλεγμένα καταλύματα.
 */
export const Articles: CollectionConfig = {
  slug: 'articles',
  labels: {
    singular: 'Άρθρο',
    plural: 'Άρθρα',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'area', 'publishedAt', '_status'],
    group: 'Περιεχόμενο',
    description: 'Οδηγοί και άρθρα για την περιοχή. Φέρνουν επισκέπτες από αναζητήσεις.',
  },
  access: {
    read: () => true,
  },
  versions: {
    drafts: { autosave: { interval: 2000 } },
    maxPerDoc: 20,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      label: 'Τίτλος',
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
        description: 'Λατινικοί χαρακτήρες, π.χ. "paralies-tolo".',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Ημερομηνία δημοσίευσης',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' },
      },
    },
    {
      name: 'area',
      type: 'relationship',
      relationTo: 'areas',
      label: 'Σχετική περιοχή',
      admin: {
        position: 'sidebar',
        description: 'Προαιρετικό. Συνδέει το άρθρο με τη σελίδα της περιοχής.',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      localized: true,
      maxLength: 300,
      label: 'Περίληψη',
      admin: {
        description:
          'Εμφανίζεται στη λίστα άρθρων και στα αποτελέσματα του Google. Γράψ’ την σαν να είναι η μόνη πρόταση που θα διαβάσει κάποιος.',
      },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Κύρια φωτογραφία',
    },
    {
      name: 'body',
      type: 'richText',
      localized: true,
      label: 'Κείμενο',
    },
    {
      name: 'relatedProperties',
      type: 'relationship',
      relationTo: 'properties',
      hasMany: true,
      label: 'Σχετικά καταλύματα',
      admin: {
        description:
          'Εμφανίζονται στο τέλος του άρθρου. Εδώ ο αναγνώστης περνάει από «τι να δω» σε «πού θα μείνω».',
      },
    },
  ],
}
