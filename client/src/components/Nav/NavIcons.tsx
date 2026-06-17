type IconProps = { className?: string }

export function NavIconHome({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function NavIconSun({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4l1.4-1.4M17 7l1.4-1.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function NavIconCards({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <rect x="5" y="7" width="10" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" transform="rotate(-8 10 14)" />
      <rect x="9" y="5" width="10" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" transform="rotate(8 14 12)" />
    </svg>
  )
}

export function NavIconQuestion({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9.5 9a3 3 0 1 1 5.2 2.1c-.9.7-1.7 1.4-1.7 2.4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12.5" cy="17.5" r="1" fill="currentColor" />
      <rect x="4" y="4" width="16" height="16" rx="4" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

export function NavIconClock({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 8v4l3 2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function NavIconBook({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 5h9a3 3 0 0 1 3 3v13H9a3 3 0 0 0-3 3V5Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M6 18a3 3 0 0 1 3-3h9" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

export function NavIconChart({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 19V11M10 19V7M15 19v-5M20 19V5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function SparkleIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2l1.4 5.2L18.6 9 13.4 10.4 12 15.6 10.6 10.4 5.4 9l5.2-1.8L12 2Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function ArrowRightIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M5 12h12M13 7l5 5-5 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function FeatureIconCardsStar({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4.5" y="7.5" width="10" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" transform="rotate(-10 9.5 14.5)" />
      <rect x="8.5" y="5.5" width="10" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" transform="rotate(10 13.5 12.5)" />
      <path
        d="M15.2 7.8l.5 1.8 1.8.5-1.8.5-.5 1.8-.5-1.8-1.8-.5 1.8-.5.5-1.8Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function FeatureIconQuestionBubble({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M6 5.5h11a2.5 2.5 0 0 1 2.5 2.5v7a2.5 2.5 0 0 1-2.5 2.5H11l-3.5 2.8V17.5H6a2.5 2.5 0 0 1-2.5-2.5V8A2.5 2.5 0 0 1 6 5.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M10.2 10.2a2.2 2.2 0 1 1 3.8 1.5c-.7.55-1.3 1.05-1.3 2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="12" cy="16.2" r="0.9" fill="currentColor" />
    </svg>
  )
}
