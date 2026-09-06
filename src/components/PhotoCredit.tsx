/**
 * Απόδοση φωτογραφίας.
 *
 * Οι εικόνες από το Wikimedia Commons είναι κυρίως CC BY / CC BY-SA, που
 * επιτρέπουν εμπορική χρήση **με αναφορά στον δημιουργό**. Χωρίς αυτήν την
 * αναφορά η χρήση παραβιάζει την άδεια.
 *
 * Εμφανίζεται διακριτικά ώστε να μην ανταγωνίζεται το περιεχόμενο, αλλά να
 * είναι ορατή και αναγνώσιμη.
 */
export function PhotoCredit({
  credit,
  className,
}: {
  credit?: string | null
  className?: string
}) {
  if (!credit) return null

  return (
    <p className={['text-xs text-ink-300', className].filter(Boolean).join(' ')}>
      Φωτογραφία: {credit}
    </p>
  )
}
