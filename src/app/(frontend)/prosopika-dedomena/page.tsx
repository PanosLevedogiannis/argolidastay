import type { Metadata } from 'next'

import { LegalPage } from '@/components/LegalPage'
import { getLocale } from '@/lib/server-locale'
import { pageAlternates } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  return {
    title: locale === 'en' ? 'Privacy policy' : 'Πολιτική απορρήτου',
    alternates: pageAlternates('/prosopika-dedomena', locale),
  }
}

export default async function PrivacyPage() {
  const locale = await getLocale()
  const en = locale === 'en'

  if (en) {
    return (
      <LegalPage title="Privacy policy" updated="Last updated: September 2026">
        <p>
          This page explains what personal data ArgolidaStay collects, why, and what rights
          you have over it.
        </p>

        <h2>What we collect</h2>
        <p>When you ask a property owner to call you, we store:</p>
        <ul>
          <li>your name and phone number</li>
          <li>optionally your email, dates of stay, number of guests and message</li>
          <li>which property you enquired about, and the date and time</li>
        </ul>
        <p>
          When you press <strong>Show phone number</strong>, we record that the number was
          requested for that property. This record contains no personal details about you.
        </p>

        <h2>Why we collect it</h2>
        <p>
          Your name and phone number are passed to the owner of the property you chose, so
          that they can contact you. That is the only purpose.
        </p>
        <p>
          We also count how many enquiries each property receives, so we can tell owners how
          much interest their listing generated.
        </p>

        <h2>Who sees it</h2>
        <p>
          The owner of the property you enquired about, and the people who run ArgolidaStay.
          We do not sell your data and we do not pass it to anyone else.
        </p>
        <p>
          To deliver notifications we use an SMS provider, which processes the message on our
          behalf.
        </p>

        <h2>How long we keep it</h2>
        <p>
          Enquiries are kept for up to two years, then deleted. You may ask us to delete
          yours sooner.
        </p>

        <h2>Your rights</h2>
        <p>
          You may ask for a copy of your data, ask us to correct or delete it, or object to
          our use of it. Write to us and we will respond within one month.
        </p>
        <p>
          You also have the right to complain to the Hellenic Data Protection Authority
          (dpa.gr).
        </p>

        <h2>Cookies</h2>
        <p>
          This site uses only the cookies required for it to function. We do not use
          advertising or tracking cookies.
        </p>

        <h2>Contact</h2>
        <p>
          For anything on this page, see the <a href="/en/epikoinonia">contact page</a>.
        </p>
      </LegalPage>
    )
  }

  return (
    <LegalPage title="Πολιτική απορρήτου" updated="Τελευταία ενημέρωση: Σεπτέμβριος 2026">
      <p>
        Η σελίδα αυτή εξηγεί ποια προσωπικά δεδομένα συλλέγει το ArgolidaStay, για ποιον
        λόγο, και τι δικαιώματα έχεις πάνω σε αυτά.
      </p>

      <h2>Τι συλλέγουμε</h2>
      <p>Όταν ζητάς από ιδιοκτήτη να σε καλέσει, αποθηκεύουμε:</p>
      <ul>
        <li>το όνομα και το τηλέφωνό σου</li>
        <li>προαιρετικά email, ημερομηνίες διαμονής, αριθμό ατόμων και μήνυμα</li>
        <li>για ποιο κατάλυμα ρώτησες, και πότε</li>
      </ul>
      <p>
        Όταν πατάς <strong>Δες τηλέφωνο</strong>, καταγράφεται ότι ζητήθηκε το τηλέφωνο για
        το συγκεκριμένο κατάλυμα. Η καταγραφή αυτή δεν περιέχει κανένα στοιχείο δικό σου.
      </p>

      <h2>Γιατί τα συλλέγουμε</h2>
      <p>
        Το όνομα και το τηλέφωνό σου διαβιβάζονται στον ιδιοκτήτη του καταλύματος που
        επέλεξες, ώστε να επικοινωνήσει μαζί σου. Αυτός είναι ο μοναδικός σκοπός.
      </p>
      <p>
        Μετράμε επίσης πόσα αιτήματα δέχεται κάθε κατάλυμα, ώστε να ενημερώνουμε τους
        ιδιοκτήτες για το ενδιαφέρον που είχε η καταχώρησή τους.
      </p>

      <h2>Ποιος τα βλέπει</h2>
      <p>
        Ο ιδιοκτήτης του καταλύματος για το οποίο ρώτησες, και όσοι διαχειρίζονται το
        ArgolidaStay. Δεν πουλάμε τα δεδομένα σου και δεν τα διαβιβάζουμε αλλού.
      </p>
      <p>
        Για την αποστολή ειδοποιήσεων χρησιμοποιούμε πάροχο SMS, ο οποίος επεξεργάζεται το
        μήνυμα για λογαριασμό μας.
      </p>

      <h2>Πόσο καιρό τα κρατάμε</h2>
      <p>
        Τα αιτήματα διατηρούνται έως δύο έτη και μετά διαγράφονται. Μπορείς να ζητήσεις τη
        διαγραφή τους νωρίτερα.
      </p>

      <h2>Τα δικαιώματά σου</h2>
      <p>
        Μπορείς να ζητήσεις αντίγραφο των δεδομένων σου, τη διόρθωση ή τη διαγραφή τους, ή
        να αντιταχθείς στη χρήση τους. Γράψε μας και απαντάμε εντός ενός μήνα.
      </p>
      <p>
        Έχεις επίσης δικαίωμα προσφυγής στην Αρχή Προστασίας Δεδομένων Προσωπικού Χαρακτήρα
        (dpa.gr).
      </p>

      <h2>Cookies</h2>
      <p>
        Το site χρησιμοποιεί μόνο τα cookies που απαιτούνται για τη λειτουργία του. Δεν
        χρησιμοποιούμε cookies διαφήμισης ή παρακολούθησης.
      </p>

      <h2>Επικοινωνία</h2>
      <p>
        Για οτιδήποτε αφορά την παρούσα σελίδα, δες τη{' '}
        <a href="/epikoinonia">σελίδα επικοινωνίας</a>.
      </p>
    </LegalPage>
  )
}
