import type { Endpoint } from 'payload'

/**
 * Αποκάλυψη τηλεφώνου με καταγραφή.
 *
 * Το τηλέφωνο του ιδιοκτήτη δεν βγαίνει ποτέ στο δημόσιο API — είναι
 * κλειδωμένο σε επίπεδο πεδίου. Βγαίνει μόνο από εδώ, και μόνο αφού
 * καταγραφεί ότι κάποιος το ζήτησε.
 *
 * Η καταγραφή δεν είναι λογιστική λεπτομέρεια: το «πόσοι ζήτησαν το
 * τηλέφωνό σου φέτος» είναι το επιχείρημα όταν έρθει η ώρα της ανανέωσης
 * της συνδρομής. Αν το τηλέφωνο φαινόταν ελεύθερα, δεν θα υπήρχε αριθμός
 * να δείξεις.
 */
export const revealPhone: Endpoint = {
  path: '/:id/reveal-phone',
  method: 'post',
  handler: async (req) => {
    const id = req.routeParams?.id

    if (!id) {
      return Response.json({ error: 'Λείπει το αναγνωριστικό.' }, { status: 400 })
    }

    // overrideAccess ώστε να διαβαστεί το κλειδωμένο πεδίο — αυτός είναι
    // ακριβώς ο λόγος ύπαρξης του endpoint.
    const property = await req.payload.findByID({
      collection: 'properties',
      id: String(id),
      depth: 0,
      overrideAccess: true,
    })

    if (!property) {
      return Response.json({ error: 'Το κατάλυμα δεν βρέθηκε.' }, { status: 404 })
    }

    // Ληγμένη συνδρομή σημαίνει ότι το κατάλυμα δεν πρέπει να είναι
    // προσβάσιμο — ούτε μέσω αυτού του δρόμου.
    if (property.subscriptionUntil && new Date(property.subscriptionUntil) < new Date()) {
      return Response.json({ error: 'Η καταχώρηση δεν είναι ενεργή.' }, { status: 410 })
    }

    if (!property.contactPhone) {
      return Response.json({ error: 'Δεν υπάρχει καταχωρημένο τηλέφωνο.' }, { status: 404 })
    }

    // Η καταγραφή δεν πρέπει να εμποδίσει τον επισκέπτη: αν αποτύχει,
    // παίρνει το τηλέφωνο ούτως ή άλλως.
    try {
      await req.payload.create({
        collection: 'enquiries',
        data: {
          property: property.id,
          type: 'phone_reveal',
          status: 'new',
          locale: typeof req.locale === 'string' ? req.locale : 'el',
        },
        overrideAccess: true,
      })
    } catch (err) {
      req.payload.logger.error(`Αποτυχία καταγραφής αποκάλυψης τηλεφώνου: ${err}`)
    }

    return Response.json({
      phone: property.contactPhone,
      viber: property.contactViber || property.contactPhone,
      name: property.contactName ?? null,
    })
  },
}
