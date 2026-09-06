import path from 'path'
import { fileURLToPath } from 'url'

import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Areas } from './collections/Areas'
import { Amenities } from './collections/Amenities'
import { Properties } from './collections/Properties'
import { Enquiries } from './collections/Enquiries'
import { Articles } from './collections/Articles'
import { OwnerRequests } from './collections/OwnerRequests'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: '— ArgolidaStay',
      icons: [{ rel: 'icon', type: 'image/svg+xml', url: '/icon.svg' }],
    },
    components: {
      graphics: {
        Logo: '@/admin/Logo#default',
        Icon: '@/admin/Icon#default',
      },
    },
  },

  collections: [Properties, Enquiries, OwnerRequests, Articles, Areas, Amenities, Media, Users],

  editor: lexicalEditor(),

  /**
   * Διγλωσσία σε επίπεδο πεδίου: όποιο πεδίο έχει `localized: true`
   * αποθηκεύεται χωριστά ανά γλώσσα. Ο διαχειριστής βλέπει έναν επιλογέα
   * γλώσσας στο πάνελ και συμπληρώνει ελληνικά και αγγλικά στην ίδια φόρμα.
   *
   * Τα ελληνικά είναι η προεπιλογή· αν λείπει αγγλική μετάφραση, το
   * `fallback` σερβίρει τα ελληνικά αντί για κενό.
   */
  localization: {
    locales: [
      { code: 'el', label: 'Ελληνικά' },
      { code: 'en', label: 'English' },
    ],
    defaultLocale: 'el',
    fallback: true,
  },

  /**
   * Το Payload δεν διαθέτει ελληνική μετάφραση για το ίδιο το πάνελ, οπότε
   * τα κουμπιά του (Save, Create New κ.λπ.) παραμένουν αγγλικά. Όλες όμως
   * οι ετικέτες των πεδίων που ορίζουμε εμείς είναι γραμμένες στα ελληνικά,
   * που είναι και το μέρος που διαβάζει ο διαχειριστής.
   */

  secret: process.env.PAYLOAD_SECRET || '',

  /**
   * Postgres και στην ανάπτυξη και στην παραγωγή.
   *
   * Τοπικά τρέχει σε container (docker compose up -d), στον server δίπλα
   * στην εφαρμογή. Η ίδια βάση και στα δύο σημαίνει ότι δεν ανακαλύπτουμε
   * διαφορές συμπεριφοράς την ώρα του deploy.
   */
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),

  sharp,

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  upload: {
    limits: { fileSize: 10_000_000 }, // 10 MB — αρκετό για φωτογραφία κινητού
  },
})
