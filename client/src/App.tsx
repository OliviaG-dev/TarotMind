import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/AppLayout/AppLayout'
import DrawPage from './pages/Draw/draw'
import HistoryPage from './pages/History/history'
import Home from './pages/Home/home'
import ProfilePage from './pages/Profile/profile'
import QuestionPage from './pages/Question/question'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/tirage" element={<DrawPage />} />
        <Route path="/question" element={<QuestionPage />} />
        <Route path="/profil" element={<ProfilePage />} />
        <Route path="/historique" element={<HistoryPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
