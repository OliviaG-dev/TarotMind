import './AppBackground.css'

export function AppBackground() {
  return (
    <div className="app-bg" aria-hidden="true">
      <div className="app-bg__mesh" />
      <div className="app-bg__wash" />
      <span className="app-bg__blob app-bg__blob--lavender" />
      <span className="app-bg__blob app-bg__blob--peach" />
      <span className="app-bg__blob app-bg__blob--mint" />
      <span className="app-bg__blob app-bg__blob--rose" />
    </div>
  )
}
