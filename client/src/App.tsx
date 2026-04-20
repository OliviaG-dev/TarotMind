import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/AppLayout/AppLayout'
import { ErrorBoundary } from './components/ErrorBoundary'

const Home = lazy(() => import('./pages/Home/home'))
const DrawPage = lazy(() => import('./pages/Draw/draw'))
const QuestionPage = lazy(() => import('./pages/Question/question'))
const ProfilePage = lazy(() => import('./pages/Profile/profile'))
const HistoryPage = lazy(() => import('./pages/History/history'))
const DailyCardPage = lazy(() => import('./pages/DailyCard/dailyCard'))
const EncyclopediaPage = lazy(() => import('./pages/Encyclopedia/encyclopedia'))
const StatsPage = lazy(() => import('./pages/Stats/stats'))

export default function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div className="page-loader">Chargement...</div>}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/carte-du-jour" element={<DailyCardPage />} />
            <Route path="/tirage" element={<DrawPage />} />
            <Route path="/question" element={<QuestionPage />} />
            <Route path="/profil" element={<ProfilePage />} />
            <Route path="/historique" element={<HistoryPage />} />
            <Route path="/encyclopedie" element={<EncyclopediaPage />} />
            <Route path="/statistiques" element={<StatsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  )
}
