type IconProps = { className?: string };

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
  );
}

export function NavIconSun({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <circle
        cx="12"
        cy="12"
        r="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4l1.4-1.4M17 7l1.4-1.4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function NavIconCards({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <rect
        x="5"
        y="7"
        width="10"
        height="14"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        transform="rotate(-8 10 14)"
      />
      <rect
        x="9"
        y="5"
        width="10"
        height="14"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        transform="rotate(8 14 12)"
      />
    </svg>
  );
}

export function NavIconQuestion({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M9.5 9a3 3 0 1 1 5.2 2.1c-.9.7-1.7 1.4-1.7 2.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="12.5" cy="17.5" r="1" fill="currentColor" />
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

export function NavIconClock({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <circle
        cx="12"
        cy="12"
        r="8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M12 8v4l3 2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function NavIconBook({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 6.25v12.75"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M12 6.25C10.83 5.48 9.25 5 7.5 5 5.75 5 4.17 5.48 3 6.25v12.75C4.17 19.02 5.75 18.5 7.5 18.5c1.75 0 3.33.52 4.5 1.25"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 6.25c1.17-.77 2.75-1.25 4.5-1.25 1.75 0 3.33.48 4.5 1.25v12.75c-1.17.52-2.75 1-4.5 1-1.75 0-3.33-.52-4.5-1.25"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function NavIconChart({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M5 19V11M10 19V7M15 19v-5M20 19V5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function NavIconProfile({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <circle
        cx="12"
        cy="12"
        r="8.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle
        cx="12"
        cy="10"
        r="2.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M7 17.5c1.3-2.6 3.2-3.8 5-3.8s3.7 1.2 5 3.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function DecoSoftSparkle({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 2.2 13.4 9.1 20.3 10.5 13.4 11.9 12 18.8 10.6 11.9 3.7 10.5 10.6 9.1 12 2.2Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function SparkleIcon({ className }: IconProps) {
  return <DecoSoftSparkle className={className} />;
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
  );
}

export function FeatureIconCardsStar({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <g transform="translate(0, 2)">
        {/* Arrière-plan : gauche puis droite */}
        <rect
          x="3"
          y="5"
          width="10"
          height="14"
          rx="2"
          transform="rotate(-12 3 5)"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <rect
          x="11"
          y="3"
          width="10"
          height="14"
          rx="2"
          transform="rotate(12 11 3)"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        {/* Premier plan : masque les traits intérieurs des cartes derrière */}
        <rect
          x="7"
          y="3"
          width="10"
          height="14"
          rx="2"
          fill="var(--feature-icon-card-face, #fff)"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M12 8.5L13.1 10.7L15.5 11L13.75 12.7L14.2 15L12 13.8L9.8 15L10.25 12.7L8.5 11L10.9 10.7L12 8.5Z"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

export function DecoSoftCloud({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 56"
      fill="none"
      aria-hidden="true"
    >
      <g className="deco-soft-cloud__blobs">
        <ellipse cx="28" cy="36" rx="22" ry="15" fill="currentColor" />
        <ellipse cx="50" cy="30" rx="26" ry="18" fill="currentColor" />
        <ellipse cx="70" cy="34" rx="20" ry="14" fill="currentColor" />
        <ellipse cx="40" cy="26" rx="16" ry="13" fill="currentColor" />
        <ellipse cx="58" cy="38" rx="18" ry="12" fill="currentColor" />
      </g>
      <path
        className="deco-soft-cloud__unified"
        d="M12 40c-6 0-10-4-10-10 0-4 2-7 6-8-1-6 6-11 14-9 4-8 18-9 24-1 8-2 15 2 14 9 6 1 10 6 8 11-2 5-9 9-17 9H12z"
        fill="currentColor"
      />
    </svg>
  );
}

export function DecoSoftCrescentMoon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 80 80"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <mask id="deco-soft-crescent-moon-mask">
          <rect width="80" height="80" fill="white" />
          <circle cx="36" cy="39.5" r="25.5" fill="black" />
        </mask>
        <filter
          id="deco-soft-crescent-moon-blur"
          x="-40%"
          y="-40%"
          width="180%"
          height="180%"
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.65" />
        </filter>
      </defs>
      <g transform="rotate(45 40 40)">
        <circle
          cx="51"
          cy="40"
          r="28"
          fill="currentColor"
          mask="url(#deco-soft-crescent-moon-mask)"
          filter="url(#deco-soft-crescent-moon-blur)"
        />
      </g>
    </svg>
  );
}

export function FeatureIconQuestionBubble({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 3C6.48 3 2 6.81 2 11.5C2 13.74 3.02 15.78 4.72 17.31L4 21L7.54 19.11C8.91 19.68 10.42 20 12 20C17.52 20 22 16.19 22 11.5C22 6.81 17.52 3 12 3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M9.8 10C9.8 8.5 11 7.4 12.5 7.4C14 7.4 15.2 8.5 15.2 10C15.2 11 14.6 11.7 13.8 12.3C13 12.9 12.5 13.4 12.5 14.3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="12.5" cy="16.9" r="0.85" fill="currentColor" />
    </svg>
  );
}
