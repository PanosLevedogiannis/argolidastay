import { NextResponse, type NextRequest } from 'next/server'

/**
 * Δρομολόγηση γλώσσας.
 *
 * Οι αγγλικές διευθύνσεις έχουν πρόθεμα (`/en/katalymata`), οι ελληνικές
 * όχι (`/katalymata`). Αντί να γραφτεί κάθε σελίδα δύο φορές, το `/en`
 * αφαιρείται εσωτερικά και η γλώσσα ταξιδεύει σε κεφαλίδα: μία σελίδα
 * εξυπηρετεί και τις δύο γλώσσες, ενώ ο επισκέπτης και το Google βλέπουν
 * δύο ξεχωριστές διευθύνσεις.
 *
 * Η διεύθυνση στον browser δεν αλλάζει — το ξαναγράψιμο είναι εσωτερικό.
 */
export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const isEnglish = pathname === '/en' || pathname.startsWith('/en/')

  const headers = new Headers(request.headers)
  headers.set('x-locale', isEnglish ? 'en' : 'el')
  headers.set('x-pathname', pathname)

  if (isEnglish) {
    const stripped = pathname.replace(/^\/en/, '') || '/'
    return NextResponse.rewrite(new URL(`${stripped}${search}`, request.url), {
      request: { headers },
    })
  }

  return NextResponse.next({ request: { headers } })
}

export const config = {
  // Το πάνελ, το API και τα στατικά αρχεία δεν περνούν από εδώ.
  matcher: ['/((?!admin|api|_next|favicon.ico|.*\\.).*)'],
}
