import { HashRouter, Routes, Route } from 'react-router-dom'
import PublicSite from './pages/PublicSite'
import GuestCodeEntry from './pages/GuestCodeEntry'
import GuestPortal from './pages/GuestPortal'
import { LanguageProvider } from './utils/LanguageContext'

export default function App() {
  return (
    <LanguageProvider>
    <HashRouter>
      <Routes>
        <Route path="/" element={<PublicSite />} />
        <Route path="/guest" element={<GuestCodeEntry />} />
        <Route path="/guest/portal" element={<GuestPortal />} />
      </Routes>
    </HashRouter>
    </LanguageProvider>
  )
}
