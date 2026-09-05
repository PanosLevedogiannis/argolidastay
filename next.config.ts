import type { NextConfig } from 'next'
import { withPayload } from '@payloadcms/next/withPayload'

const nextConfig: NextConfig = {
  // Παράγει αυτόνομο πακέτο με μόνο τις απαραίτητες εξαρτήσεις — κάνει την
  // εικόνα Docker πολλαπλάσια μικρότερη.
  output: 'standalone',

  images: {
    // Οι φωτογραφίες σερβίρονται τοπικά από το Payload κατά την ανάπτυξη.
    // Όταν μπει CDN (S3 / Cloudflare / Vercel Blob), πρόσθεσε εδώ το domain.
    remotePatterns: [],
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
