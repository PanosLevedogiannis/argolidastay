/**
 * Ένδειξη φόρτωσης κατά την πλοήγηση.
 *
 * Όλες οι σελίδες διαβάζουν από τη βάση σε κάθε αίτημα, οπότε ανάμεσα στο
 * κλικ και στο νέο περιεχόμενο μεσολαβεί μια στιγμή. Χωρίς αυτό το αρχείο
 * η σελίδα μένει ακίνητη σε εκείνο το διάστημα και μοιάζει κολλημένη —
 * ειδικά στην αλλαγή γλώσσας, όπου ο χρήστης περιμένει να δει αλλαγή.
 *
 * Δείχνει σκελετό με το σχήμα του περιεχομένου αντί για σπινάκι: η σελίδα
 * φαίνεται να χτίζεται, δεν παγώνει.
 */
export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-6xl animate-pulse px-5 py-10 sm:px-6">
      <div className="h-9 w-2/3 rounded-lg bg-sand-200" />
      <div className="mt-3 h-5 w-1/3 rounded bg-sand-200" />

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="overflow-hidden rounded-card bg-white shadow-card">
            <div className="aspect-[4/3] bg-sand-200" />
            <div className="space-y-2 p-4">
              <div className="h-3 w-1/3 rounded bg-sand-200" />
              <div className="h-4 w-3/4 rounded bg-sand-200" />
              <div className="h-3 w-full rounded bg-sand-100" />
            </div>
          </div>
        ))}
      </div>

      <span className="sr-only">Φόρτωση…</span>
    </div>
  )
}
