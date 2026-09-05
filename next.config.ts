import type { NextConfig } from 'next'
import { withPayload } from '@payloadcms/next/withPayload'

const nextConfig: NextConfig = {
  images: {
    // Οι φωτογραφίες σερβίρονται τοπικά από το Payload κατά την ανάπτυξη.
    // Όταν μπει CDN (S3 / Cloudflare / Vercel Blob), πρόσθεσε εδώ το domain.
    remotePatterns: [],
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
