import type { InlinePart } from './content'

export function Inline({ parts }: { parts: InlinePart[] }) {
  return (
    <>
      {parts.map((part, i) => {
        if (typeof part === 'string') return <span key={i}>{part}</span>
        if (part.type === 'em') return <em key={i}>{part.text}</em>
        return (
          <a key={i} href={part.href} target="_blank" rel="noreferrer">
            {part.label}
          </a>
        )
      })}
    </>
  )
}
