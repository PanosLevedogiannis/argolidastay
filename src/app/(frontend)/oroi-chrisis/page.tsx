import type { Metadata } from 'next'

import { LegalPage } from '@/components/LegalPage'
import { getLocale } from '@/lib/server-locale'
import { pageAlternates } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  return {
    title: locale === 'en' ? 'Terms of use' : 'Όροι χρήσης',
    alternates: pageAlternates('/oroi-chrisis', locale),
    robots: { index: false },
  }
}

export default async function TermsPage() {
  const locale = await getLocale()

  if (locale === 'en') {
    return (
      <LegalPage title="Terms of use" updated="Last updated: September 2026">
        <h2>What this site is</h2>
        <p>
          ArgolidaStay is a <strong>directory</strong> of accommodation in Argolida. We are
          not a booking platform and not a travel agency. We do not take reservations, do not
          handle payments, and take no commission on any stay.
        </p>
        <p>
          Every listing belongs to an independent owner. Prices, availability, terms of stay
          and cancellation are agreed <strong>directly between you and the owner</strong>.
        </p>

        <h2>Accuracy of listings</h2>
        <p>
          The information in each listing is provided by the owner. We check it as best we
          can, but we cannot guarantee it is complete or current. Prices shown are indicative
          and are not an offer.
        </p>
        <p>
          If you find a listing that is inaccurate or misleading, please tell us and we will
          look into it.
        </p>

        <h2>Our responsibility</h2>
        <p>
          Because we are not party to your agreement with the owner, we are not responsible
          for the stay itself: the condition of the property, the conduct of the owner,
          cancellations, or any dispute between you.
        </p>
        <p>
          We are responsible for operating this site with reasonable care, and for handling
          your personal data as described in our{' '}
          <a href="/en/prosopika-dedomena">privacy policy</a>.
        </p>

        <h2>Using the site</h2>
        <p>
          You may browse and contact owners freely. You may not copy listings in bulk,
          collect owner phone numbers automatically, or use the contact forms for anything
          other than a genuine enquiry.
        </p>

        <h2>Listings and subscriptions</h2>
        <p>
          Owners pay an annual fee to appear in the directory. A listing is hidden
          automatically when its subscription expires. Paying does not affect where a listing
          appears in search results, other than the featured positions which are marked.
        </p>

        <h2>Changes</h2>
        <p>
          We may update these terms. The date at the top shows the last change.
        </p>
      </LegalPage>
    )
  }

  return (
    <LegalPage title="Όροι χρήσης" updated="Τελευταία ενημέρωση: Σεπτέμβριος 2026">
      <h2>Τι είναι αυτό το site</h2>
      <p>
        Το ArgolidaStay είναι <strong>κατάλογος</strong> καταλυμάτων της Αργολίδας. Δεν είναι
        πλατφόρμα κρατήσεων ούτε τουριστικό γραφείο. Δεν δεχόμαστε κρατήσεις, δεν
        διαχειριζόμαστε πληρωμές και δεν λαμβάνουμε προμήθεια για καμία διαμονή.
      </p>
      <p>
        Κάθε καταχώρηση ανήκει σε ανεξάρτητο ιδιοκτήτη. Οι τιμές, η διαθεσιμότητα, οι όροι
        διαμονής και ακύρωσης συμφωνούνται <strong>απευθείας μεταξύ εσού και του
        ιδιοκτήτη</strong>.
      </p>

      <h2>Ακρίβεια των καταχωρήσεων</h2>
      <p>
        Οι πληροφορίες κάθε καταχώρησης παρέχονται από τον ιδιοκτήτη. Τις ελέγχουμε στο μέτρο
        του δυνατού, αλλά δεν μπορούμε να εγγυηθούμε ότι είναι πλήρεις ή επίκαιρες. Οι τιμές
        που εμφανίζονται είναι ενδεικτικές και δεν αποτελούν προσφορά.
      </p>
      <p>
        Αν εντοπίσεις καταχώρηση ανακριβή ή παραπλανητική, ενημέρωσέ μας και θα το
        εξετάσουμε.
      </p>

      <h2>Η ευθύνη μας</h2>
      <p>
        Επειδή δεν είμαστε συμβαλλόμενο μέρος στη συμφωνία σου με τον ιδιοκτήτη, δεν φέρουμε
        ευθύνη για την ίδια τη διαμονή: την κατάσταση του καταλύματος, τη συμπεριφορά του
        ιδιοκτήτη, τυχόν ακυρώσεις ή διαφορές μεταξύ σας.
      </p>
      <p>
        Φέρουμε ευθύνη για τη λειτουργία του site με τη δέουσα επιμέλεια, και για τη
        διαχείριση των προσωπικών σου δεδομένων όπως περιγράφεται στην{' '}
        <a href="/prosopika-dedomena">πολιτική απορρήτου</a>.
      </p>

      <h2>Χρήση του site</h2>
      <p>
        Μπορείς να περιηγείσαι και να επικοινωνείς ελεύθερα με ιδιοκτήτες. Δεν επιτρέπεται η
        μαζική αντιγραφή καταχωρήσεων, η αυτοματοποιημένη συλλογή τηλεφώνων, ή η χρήση των
        φορμών επικοινωνίας για οτιδήποτε άλλο πέρα από γνήσιο αίτημα.
      </p>

      <h2>Καταχωρήσεις και συνδρομές</h2>
      <p>
        Οι ιδιοκτήτες καταβάλλουν ετήσια συνδρομή για να εμφανίζονται στον κατάλογο. Η
        καταχώρηση αποκρύπτεται αυτόματα όταν λήξει η συνδρομή. Η πληρωμή δεν επηρεάζει τη
        θέση στα αποτελέσματα αναζήτησης, πέραν των προβεβλημένων θέσεων που σημειώνονται
        ως τέτοιες.
      </p>

      <h2>Μεταβολές</h2>
      <p>
        Οι όροι μπορεί να ενημερωθούν. Η ημερομηνία στην κορυφή δείχνει την τελευταία
        αλλαγή.
      </p>
    </LegalPage>
  )
}
