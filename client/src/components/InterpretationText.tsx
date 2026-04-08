import { Fragment } from 'react'

function formatParagraph(line: string) {
  const parts = line.split(/(\*\*.+?\*\*)/g)
  return parts.map((part, j) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return <strong key={j}>{part.slice(2, -2)}</strong>
    }
    return <Fragment key={j}>{part}</Fragment>
  })
}

function splitMiniTitle(item: string): { title: string; content: string } | null {
  const m = item.match(/^([^-:—]{2,40})\s*[—:-]\s+(.+)$/)
  if (!m) return null
  const title = m[1].trim()
  const content = m[2].trim()
  if (!title || !content) return null
  return { title, content }
}

function isHighlightedMiniTitle(title: string): boolean {
  const normalized = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
  return [
    'passe',
    'present',
    'futur',
    'contexte',
    'contexte professionnel',
    'defi',
    'obstacle',
    'opportunite',
    'conseil',
    'synthese',
    'question',
    'etat du coeur',
    'dynamique',
    'piste 1',
    'piste 2',
  ].includes(normalized)
}

export function InterpretationText({ text }: { text: string }) {
  const lines = text
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0)

  const blocks: Array<
    | { type: 'h3'; value: string }
    | { type: 'ul'; items: string[] }
    | { type: 'ol'; items: string[] }
    | { type: 'p'; value: string }
  > = []

  let i = 0
  while (i < lines.length) {
    const line = lines[i]

    if (line.startsWith('### ')) {
      blocks.push({ type: 'h3', value: line.slice(4).trim() })
      i += 1
      continue
    }

    if (line.startsWith('- ')) {
      const items: string[] = []
      while (i < lines.length && lines[i].startsWith('- ')) {
        items.push(lines[i].slice(2).trim())
        i += 1
      }
      blocks.push({ type: 'ul', items })
      continue
    }

    if (/^\d+\.\s/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, '').trim())
        i += 1
      }
      blocks.push({ type: 'ol', items })
      continue
    }

    blocks.push({ type: 'p', value: line })
    i += 1
  }

  return (
    <div className="interpretation-text">
      {blocks.map((b, idx) => {
        if (b.type === 'h3') {
          return (
            <h3 key={idx} className="interpretation-text__h3">
              {formatParagraph(b.value)}
            </h3>
          )
        }
        if (b.type === 'ul') {
          return (
            <ul key={idx} className="interpretation-text__list">
              {b.items.map((item, j) => (
                (() => {
                  const mini = splitMiniTitle(item)
                  if (mini && isHighlightedMiniTitle(mini.title)) {
                    return (
                      <li key={j} className="interpretation-text__mini">
                        <span className="interpretation-text__mini-title">
                          {mini.title}
                        </span>
                        <span className="interpretation-text__mini-content">
                          {formatParagraph(mini.content)}
                        </span>
                      </li>
                    )
                  }
                  return <li key={j}>{formatParagraph(item)}</li>
                })()
              ))}
            </ul>
          )
        }
        if (b.type === 'ol') {
          return (
            <ol key={idx} className="interpretation-text__list interpretation-text__list--ordered">
              {b.items.map((item, j) => (
                <li key={j}>{formatParagraph(item)}</li>
              ))}
            </ol>
          )
        }
        return <p key={idx}>{formatParagraph(b.value)}</p>
      })}
    </div>
  )
}
