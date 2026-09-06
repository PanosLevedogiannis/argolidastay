/**
 * Μετατροπή απλού κειμένου σε μορφή που καταλαβαίνει ο επεξεργαστής του
 * πάνελ (Lexical).
 *
 * Το Payload δεν αποθηκεύει HTML αλλά δομημένο δέντρο κόμβων. Γράφοντας τα
 * άρθρα σε απλό κείμενο και μετατρέποντάς τα εδώ, το περιεχόμενο μένει
 * αναγνώσιμο στον κώδικα και ταυτόχρονα πλήρως επεξεργάσιμο από το πάνελ.
 *
 * Υποστηρίζονται:
 *   ## Επικεφαλίδα
 *   - στοιχείο λίστας
 *   **έντονα** μέσα σε παράγραφο
 */

const FORMAT_BOLD = 1

function textNode(text, bold = false) {
  return {
    type: 'text',
    detail: 0,
    format: bold ? FORMAT_BOLD : 0,
    mode: 'normal',
    style: '',
    text,
    version: 1,
  }
}

/** Σπάει μια γραμμή σε κομμάτια, αναγνωρίζοντας τα **έντονα**. */
function inline(line) {
  const parts = []
  const re = /\*\*(.+?)\*\*/g
  let last = 0
  let m
  while ((m = re.exec(line))) {
    if (m.index > last) parts.push(textNode(line.slice(last, m.index)))
    parts.push(textNode(m[1], true))
    last = m.index + m[0].length
  }
  if (last < line.length) parts.push(textNode(line.slice(last)))
  return parts.length ? parts : [textNode('')]
}

function paragraph(line) {
  return {
    type: 'paragraph',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    textFormat: 0,
    textStyle: '',
    children: inline(line),
  }
}

function heading(line, tag = 'h2') {
  return {
    type: 'heading',
    tag,
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    children: inline(line),
  }
}

function list(items) {
  return {
    type: 'list',
    listType: 'bullet',
    tag: 'ul',
    start: 1,
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    children: items.map((item, i) => ({
      type: 'listitem',
      value: i + 1,
      checked: undefined,
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: inline(item),
    })),
  }
}

export function richText(source) {
  const children = []
  let bullets = []

  const flush = () => {
    if (bullets.length) {
      children.push(list(bullets))
      bullets = []
    }
  }

  for (const raw of source.trim().split('\n')) {
    const line = raw.trim()
    if (!line) {
      flush()
      continue
    }
    if (line.startsWith('## ')) {
      flush()
      children.push(heading(line.slice(3)))
    } else if (line.startsWith('- ')) {
      bullets.push(line.slice(2))
    } else {
      flush()
      children.push(paragraph(line))
    }
  }
  flush()

  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children,
    },
  }
}
