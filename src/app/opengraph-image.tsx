import { ImageResponse } from 'next/og'

/**
 * Η εικόνα που εμφανίζεται όταν μοιράζεται ο σύνδεσμος του site σε Viber,
 * WhatsApp, Facebook ή Messenger.
 *
 * Χωρίς αυτήν, ο σύνδεσμος εμφανίζεται ως γυμνό κείμενο και περνάει
 * απαρατήρητος. Για τουριστικό site που μοιράζεται κυρίως σε συνομιλίες,
 * αυτό είναι από τα λίγα πράγματα που επηρεάζουν άμεσα πόσοι θα κάνουν κλικ.
 *
 * Παράγεται από τον server ώστε να μην υπάρχει αρχείο να ξεχαστεί
 * ενημερωμένο· αλλάζει μαζί με τον κώδικα.
 */
export const alt = 'ArgolidaStay — Καταλύματα στην Αργολίδα'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: 'linear-gradient(135deg, #f7ecd5 0%, #f5f1e8 55%, #fbf9f5 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 72,
              height: 72,
              borderRadius: 20,
              background: '#b5563a',
              color: '#fbf9f5',
              fontSize: 40,
              fontWeight: 700,
            }}
          >
            A
          </div>
          <div style={{ display: 'flex', fontSize: 38, fontWeight: 600, color: '#241f1a' }}>
            <span>Argolida</span>
            <span style={{ color: '#b5563a' }}>Stay</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div
            style={{
              fontSize: 62,
              fontWeight: 700,
              lineHeight: 1.1,
              color: '#241f1a',
              letterSpacing: '-0.02em',
              maxWidth: 900,
            }}
          >
            Καταλύματα στην Αργολίδα
          </div>
          <div style={{ fontSize: 30, color: '#4a423a', maxWidth: 860 }}>
            Ναύπλιο · Τολό · Επίδαυρος · Πόρτο Χέλι · Ερμιόνη
          </div>
        </div>

        <div style={{ display: 'flex', gap: 28, fontSize: 24, color: '#766c60' }}>
          <span>Απευθείας με τον ιδιοκτήτη</span>
          <span style={{ color: '#b5563a' }}>·</span>
          <span>Χωρίς προμήθεια</span>
        </div>
      </div>
    ),
    size,
  )
}
