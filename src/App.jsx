import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AppointmentModal from './components/AppointmentModal'
const AdminApp = lazy(() => import('./admin/AdminApp'))
const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Services = lazy(() => import('./pages/Services'))
const Doctors = lazy(() => import('./pages/Doctors'))
const Contact = lazy(() => import('./pages/Contact'))
const BookAppointment = lazy(() => import('./pages/BookAppointment'))
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return null
}

function SiteLayout() {
  const { pathname } = useLocation()
  const [appointmentOpen, setAppointmentOpen] = useState(false)
  const openAppointment = useCallback(() => setAppointmentOpen(true), [])
  const closeAppointment = useCallback(() => setAppointmentOpen(false), [])

  return (
    <div className="app-shell">
      <Navbar onBook={openAppointment} />
      <motion.main key={pathname} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, ease: 'easeOut' }}><Outlet context={{ onBook: openAppointment }} /></motion.main>
      <Footer onBook={openAppointment} />
      <AppointmentModal isOpen={appointmentOpen} onClose={closeAppointment} />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<div className="admin-loading"><span className="loading-spinner" /> Loading SmileCraft…</div>}>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services/:slug" element={<ServiceDetail />} />
            <Route path="/services" element={<Services />} />
            <Route path="/team" element={<Doctors />} />
            <Route path="/doctors" element={<Navigate to="/team" replace />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/book-appointment" element={<BookAppointment />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="*" element={<Home />} />
          </Route>
          <Route path="/admin/*" element={<AdminApp />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
