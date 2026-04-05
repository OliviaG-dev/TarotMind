import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/AppLayout/AppLayout'
import DrawPage from './pages/Draw/draw'
import HistoryPage from './pages/History/history'
import Home from './pages/Home/home'
import LoginPage from './pages/Login/login'
import ProfilePage from './pages/Profile/profile'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/tirage" element={<DrawPage />} />
        <Route path="/profil" element={<ProfilePage />} />
        <Route path="/historique" element={<HistoryPage />} />
        <Route path="/connexion" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
