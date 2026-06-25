import { useId, type ReactNode } from 'react'
import { DecoSoftSparkle } from '../Nav/NavIcons'
import './PageIntro.css'

type PageIntroProps = {
  title: string
  children?: ReactNode
}

export function PageIntro({ title, children }: PageIntroProps) {
  const uid = useId().replace(/:/g, '')

  return (
    <header className="page-intro">
      <div className="page-intro__card">
        <span className="page-intro__deco" aria-hidden="true">
          <DecoSoftSparkle className="page-intro__spark page-intro__spark--a" />
          <DecoSoftSparkle className="page-intro__spark page-intro__spark--b" />
          <DecoSoftSparkle className="page-intro__spark page-intro__spark--c" />
        </span>
        <span
          className="page-intro__shoot"
          aria-hidden="true"
          style={{
            ['--shoot-path-1' as string]: `url(#${uid}-path-1)`,
            ['--shoot-path-2' as string]: `url(#${uid}-path-2)`,
            ['--shoot-path-3' as string]: `url(#${uid}-path-3)`,
            ['--shoot-path-4' as string]: `url(#${uid}-path-4)`,
          }}
        >
          <svg
            className="page-intro__motion-svg"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <path
                id={`${uid}-path-1`}
                d="M -10 68 C 8 20, 38 6, 54 6 C 72 6, 95 30, 112 62"
              />
              <path
                id={`${uid}-path-2`}
                d="M -8 82 C 10 58, 30 35, 62 22 C 78 18, 98 16, 115 32"
              />
              <path
                id={`${uid}-path-3`}
                d="M -12 42 C 5 32, 40 18, 72 12 C 88 14, 102 32, 110 44"
              />
              <path
                id={`${uid}-path-4`}
                d="M -6 22 C 12 38, 28 52, 42 52 C 58 52, 88 48, 108 72"
              />
            </defs>
          </svg>
          <span className="page-intro__shoot-trail page-intro__shoot-trail--1" />
          <span className="page-intro__shoot-trail page-intro__shoot-trail--2" />
          <span className="page-intro__shoot-trail page-intro__shoot-trail--3" />
          <span className="page-intro__shoot-trail page-intro__shoot-trail--4" />
        </span>
        <h1 className="page-intro__title">{title}</h1>
        {children != null && <div className="page-intro__lead">{children}</div>}
      </div>
    </header>
  )
}
