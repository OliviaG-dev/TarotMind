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

export function InterpretationText({ text }: { text: string }) {
  const paras = text.trim().split(/\n\n+/)
  return (
    <div className="interpretation-text">
      {paras.map((para, i) => (
        <p key={i}>{formatParagraph(para)}</p>
      ))}
    </div>
  )
}
