/**
 * Λογότυπο στην οθόνη σύνδεσης του πάνελ.
 *
 * Το προεπιλεγμένο είναι του Payload. Ένας διαχειριστής που μπαίνει κάθε
 * μέρα πρέπει να βλέπει το δικό του σήμα — και όποιος πέσει κατά λάθος στη
 * σελίδα να καταλαβαίνει πού βρίσκεται.
 */
export default function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <span
        aria-hidden="true"
        style={{
          display: 'grid',
          placeItems: 'center',
          width: 52,
          height: 52,
          borderRadius: 14,
          background: '#b5563a',
          color: '#fbf9f5',
          fontSize: 26,
          fontWeight: 700,
          letterSpacing: '-0.02em',
        }}
      >
        A
      </span>
      <span style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em' }}>
        Argolida<span style={{ color: '#b5563a' }}>Stay</span>
      </span>
    </div>
  )
}
