import type { Metadata } from 'next'
import Link from 'next/link'

import { LegalPage } from '@/components/LegalPage'
import { href } from '@/lib/i18n'
import { getLocale } from '@/lib/server-locale'
import { pageAlternates } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  return {
    title: locale === 'en' ? 'Contact' : 'Επικοινωνία',
    description:
      locale === 'en'
        ? 'Get in touch with ArgolidaStay about a listing, a correction or your data.'
        : 'Επικοινώνησε με το ArgolidaStay για καταχώρηση, διόρθωση ή τα δεδομένα σου.',
    alternates: pageAlternates('/epikoinonia', locale),
  }
}

/*
 * Τα στοιχεία επικοινωνίας μένουν ως σύμβολα μέχρι να αποφασιστούν.
 * Συμπλήρωσέ τα εδώ πριν βγει το site στον αέρα — μια σελίδα επικοινωνίας
 * χωρίς τρόπο επικοινωνίας είναι χειρότερη από το να μην υπάρχει.
 */
const EMAIL = 'info@argolidastay.gr'
const PHONE = ''

export default async function ContactPage() {
  const locale = await getLocale()
  const en = locale === 'en'

  return (
    <LegalPage title={en ? 'Contact' : 'Επικοινωνία'}>
      <p>
        {en
          ? 'Whatever you need, write to us and we will answer.'
          : 'Ό,τι και αν χρειάζεσαι, γράψε μας και θα σου απαντήσουμε.'}
      </p>

      <p>
        <strong>Email:</strong>{' '}
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        {PHONE && (
          <>
            <br />
            <strong>{en ? 'Phone' : 'Τηλέφωνο'}:</strong>{' '}
            <a href={`tel:${PHONE.replace(/\s/g, '')}`}>{PHONE}</a>
          </>
        )}
      </p>

      <h2>{en ? 'I own a property' : 'Έχω κατάλυμα'}</h2>
      <p>
        {en ? (
          <>
            The quickest way is the{' '}
            <Link href={href(locale, '/kataxorisi')}>listing form</Link> — leave your name and
            phone number and we will call you.
          </>
        ) : (
          <>
            Ο γρηγορότερος δρόμος είναι η{' '}
            <Link href={href(locale, '/kataxorisi')}>φόρμα καταχώρησης</Link> — άφησε όνομα
            και τηλέφωνο και σε παίρνουμε εμείς.
          </>
        )}
      </p>

      <h2>{en ? 'Something in a listing is wrong' : 'Κάτι σε μια καταχώρηση είναι λάθος'}</h2>
      <p>
        {en
          ? 'Send us the link to the listing and tell us what is wrong. Listings are provided by their owners, so corrections usually need a call to them — we handle that.'
          : 'Στείλε μας τον σύνδεσμο της καταχώρησης και τι δεν ισχύει. Οι καταχωρήσεις δίνονται από τους ιδιοκτήτες, οπότε η διόρθωση συνήθως απαιτεί επικοινωνία μαζί τους — το αναλαμβάνουμε εμείς.'}
      </p>

      <h2>{en ? 'My personal data' : 'Τα προσωπικά μου δεδομένα'}</h2>
      <p>
        {en ? (
          <>
            To get a copy of your data or ask us to delete it, write to the address above. We
            answer within one month. Details in the{' '}
            <Link href={href(locale, '/prosopika-dedomena')}>privacy policy</Link>.
          </>
        ) : (
          <>
            Για αντίγραφο των δεδομένων σου ή διαγραφή τους, γράψε μας στη διεύθυνση
            παραπάνω. Απαντάμε εντός ενός μήνα. Λεπτομέρειες στην{' '}
            <Link href={href(locale, '/prosopika-dedomena')}>πολιτική απορρήτου</Link>.
          </>
        )}
      </p>
    </LegalPage>
  )
}
