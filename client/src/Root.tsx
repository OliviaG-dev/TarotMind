import { BrowserRouter } from 'react-router-dom'
import { AppProviders } from './context/AppProviders'
import App from './App.tsx'

export function Root() {
  return (
    <BrowserRouter>
      <AppProviders>
        <App />
      </AppProviders>
    </BrowserRouter>
  )
}
