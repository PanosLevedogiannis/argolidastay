# Ανέβασμα στον server

Οδηγίες για να τρέχει το site σε δικό μας VPS, ώστε να μπαίνουν και οι δύο διαχειριστές από όπου κι αν είναι.

## Γιατί χρειάζεται server

Όσο το site τρέχει τοπικά, η βάση είναι αρχείο στον υπολογιστή του καθενός. Δύο άτομα σε δύο laptop θα δούλευαν σε **δύο διαφορετικές βάσεις** και δεν θα έβλεπαν ο ένας τις καταχωρήσεις του άλλου. Ο server δίνει μία κοινή βάση για όλους.

---

## 1. Ο server

Οποιοσδήποτε πάροχος VPS κάνει — Hetzner, DigitalOcean, Contabo. Ζητούμενα:

| | |
|---|---|
| Λειτουργικό | Ubuntu 24.04 LTS |
| Μνήμη | 2 GB (ελάχιστο) — 4 GB αν ξεπεράσετε τα 200 καταλύματα |
| Δίσκος | 40 GB — οι φωτογραφίες πιάνουν τον περισσότερο χώρο |
| Κόστος | περίπου 5 €/μήνα |

Επίλεξε τοποθεσία **Γερμανία ή Φινλανδία** — είναι οι πιο κοντινές με χαμηλή καθυστέρηση προς Ελλάδα.

## 2. Προετοιμασία

Συνδέσου στον server και εγκατέστησε το Docker:

```bash
ssh root@Η_IP_ΤΟΥ_SERVER

curl -fsSL https://get.docker.com | sh
```

Δημιούργησε χρήστη χωρίς δικαιώματα root για την εφαρμογή:

```bash
adduser --disabled-password --gecos "" argolida
usermod -aG docker argolida
```

Τείχος προστασίας — ανοιχτά μόνο τα απαραίτητα:

```bash
ufw allow OpenSSH
ufw allow 80
ufw allow 443
ufw --force enable
```

## 3. Ο κώδικας

```bash
su - argolida
git clone https://github.com/PanosLevedogiannis/argolidastay.git
cd argolidastay
```

Αν το repository είναι ιδιωτικό, χρειάζεσαι κλειδί ανάπτυξης (deploy key) ή προσωπικό token.

## 4. Ρυθμίσεις

Φτιάξε αρχείο `.env` στον φάκελο του project:

```bash
cat > .env <<'EOF'
POSTGRES_USER=argolidastay
POSTGRES_PASSWORD=ΒΑΛΕ_ΕΝΑΝ_ΜΕΓΑΛΟ_ΤΥΧΑΙΟ_ΚΩΔΙΚΟ
POSTGRES_DB=argolidastay

PAYLOAD_SECRET=ΒΑΛΕ_ΑΛΛΟΝ_ΤΥΧΑΙΟ_ΚΩΔΙΚΟ
NEXT_PUBLIC_SERVER_URL=https://argolidastay.gr

SMS_PROVIDER=none
SMS_API_KEY=
SMS_SENDER=ArgolidaStay
EOF

chmod 600 .env
```

Για τους τυχαίους κωδικούς:

```bash
openssl rand -hex 32
```

> Ο `PAYLOAD_SECRET` κρυπτογραφεί τις συνεδρίες του πάνελ. Αν αλλάξει, αποσυνδέονται όλοι — δεν χάνονται δεδομένα, αλλά χρειάζεται νέα σύνδεση.

## 5. Domain

Στον καταχωρητή του `argolidastay.gr`, δύο εγγραφές:

| Τύπος | Όνομα | Τιμή |
|---|---|---|
| A | `@` | η IP του server |
| A | `www` | η IP του server |

Περίμενε να διαδοθεί (συνήθως λεπτά, ενίοτε ώρες):

```bash
dig +short argolidastay.gr
```

**Μέχρι να πάρεις domain:** άλλαξε στο `Caddyfile` την πρώτη γραμμή σε `:80 {` και μπες με τη διεύθυνση IP. Θα δουλεύει χωρίς HTTPS, μόνο για δοκιμές.

## 6. Εκκίνηση

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

Το πρώτο χτίσιμο θέλει μερικά λεπτά. Έλεγχος:

```bash
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f app
```

Το Caddy βγάζει μόνο του πιστοποιητικό HTTPS. Αν αποτύχει, σχεδόν πάντα φταίει το DNS που δεν έχει διαδοθεί ακόμα.

## 7. Πρώτος λογαριασμός

Μπες στο `https://argolidastay.gr/admin` — θα ζητήσει να φτιάξεις τον πρώτο διαχειριστή.

Μετά, από **Χρήστες → Create New**, φτιάξε τον λογαριασμό του συνεργάτη με ρόλο **Διαχειριστής**.

Για τις περιοχές και τις παροχές:

```bash
SEED_BASE_URL=https://argolidastay.gr \
SEED_EMAIL=το@email.σου \
SEED_PASSWORD='ο κωδικός σου' \
node scripts/seed.mjs
```

Μη τρέξεις το `demo-data.mjs` στον server — είναι μόνο για δοκιμές.

---

## Ενημερώσεις

```bash
cd ~/argolidastay
git pull
docker compose -f docker-compose.prod.yml up -d --build
```

Οι φωτογραφίες και η βάση ζουν σε volume του Docker και **δεν επηρεάζονται** από τις ενημερώσεις.

## Αντίγραφα ασφαλείας

Χωρίς αυτά, μια αστοχία δίσκου σβήνει τη δουλειά μηνών.

**Βάση:**

```bash
docker compose -f docker-compose.prod.yml exec -T db \
  pg_dump -U argolidastay argolidastay | gzip > backups/db-$(date +%F).sql.gz
```

**Φωτογραφίες:**

```bash
docker run --rm -v argolidastay_media_data:/media -v $(pwd)/backups:/out \
  alpine tar czf /out/media-$(date +%F).tar.gz -C /media .
```

Αυτόματα κάθε βράδυ στις 3:

```bash
crontab -e
```

```
0 3 * * * cd /home/argolida/argolidastay && docker compose -f docker-compose.prod.yml exec -T db pg_dump -U argolidastay argolidastay | gzip > backups/db-$(date +\%F).sql.gz
```

**Κατέβασε τα αντίγραφα εκτός server** — αν καεί ο δίσκος, χάνονται μαζί του:

```bash
rsync -av argolida@Η_IP:~/argolidastay/backups/ ~/argolidastay-backups/
```

## Επαναφορά

```bash
gunzip -c backups/db-2026-09-05.sql.gz | \
  docker compose -f docker-compose.prod.yml exec -T db psql -U argolidastay argolidastay
```
