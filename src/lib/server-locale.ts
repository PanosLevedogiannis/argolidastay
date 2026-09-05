import { headers } from 'next/headers'

import { DEFAULT_LOCALE, type Locale } from './i18n'

/**
 * Η γλώσσα της τρέχουσας σελίδας, όπως την όρισε το middleware.
 *
 * Χρησιμοποιείται και ως `locale` στα ερωτήματα προς το Payload, ώστε τα
 * μεταφρασμένα πεδία (ονόματα, περιγραφές) να έρχονται στη σωστή γλώσσα.
 */
export async function getLocale(): Promise<Locale> {
  const h = await headers()
  return h.get('x-locale') === 'en' ? 'en' : DEFAULT_LOCALE
}
