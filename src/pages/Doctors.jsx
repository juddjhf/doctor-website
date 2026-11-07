import { useOutletContext } from 'react-router-dom'
import { ArrowUpRight, Check, HeartHandshake } from 'lucide-react'
import Button from '../components/Button'
import DoctorCard from '../components/DoctorCard'
import { doctors } from '../data/doctors'
import useClinicData from '../hooks/useClinicData'
import ApiNotice from '../components/ApiNotice'
import LoadingCards from '../components/LoadingCards'

export default function Doctors() {
  const { onBook } = useOutletContext()
  const { data: liveDentists, loading, error } = useClinicData('/dentists', doctors)
  const dentistItems = liveDentists
  return (
    <>
      <section className="page-hero doctors-page-hero">
        <div className="container page-hero-grid">
          <div><span className="eyebrow"><span className="eyebrow-dot" /> GOOD PEOPLE. GOOD HANDS.</span><h1>Meet your smile’s <span>biggest fans.</span></h1><p>Skilled clinicians, kind listeners, and real people who care about helping you feel your best.</p><Button onClick={onBook}>Find your dentist</Button></div>
          <div className="page-hero-image doctors-hero-image"><img src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1100&q=85" alt="Dental care team ready to welcome patients" /><span>A team that takes time to listen.</span></div>
        </div>
      </section>
      <section className="section doctor-directory"><div className="container"><div className="section-heading"><div><span className="eyebrow">THE PEOPLE WHO CARE FOR YOU</span><h2>Meet the team behind <span>your care.</span></h2></div><p className="heading-description">A thoughtful team, with a shared belief that the best dental care starts with a good conversation.</p></div>{loading ? <LoadingCards count={3} /> : dentistItems.length ? <div className="doctors-grid">{dentistItems.map((doctor) => <DoctorCard key={doctor._id || doctor.name} doctor={doctor} onBook={onBook} />)}</div> : <div className="empty-state">Our team profiles are coming soon.</div>}<p className="demo-note">All dentist names, roles, and biographies are fictional sample content for this portfolio demo.</p><ApiNotice message={error} /></div></section>
      <section className="doctor-promise"><div className="container doctor-promise-inner"><span className="doctor-promise-icon"><HeartHandshake size={26} /></span><div><span className="eyebrow">A NOTE FROM YOUR CARE TEAM</span><h2>“We want you to feel like you have a partner in your health—not just a dentist.”</h2><p>That means no silly questions, no rushing, and no judgment. Just good people ready to help.</p></div><div className="doctor-promise-sign"><strong>The SmileCraft team</strong><span>Here for your smile</span></div></div></section>
      <section className="appointment-cta doctors-cta"><div className="container appointment-cta-inner"><div className="cta-mark"><Check size={25} /></div><div><span className="eyebrow eyebrow-light">YOUR FIRST VISIT IS A CONVERSATION</span><h2>Let’s meet, get to know you, and take it from there.</h2><p>No pressure. Just a good place to start.</p></div><Button variant="light" onClick={onBook}>Request an appointment</Button><span className="cta-clock"><ArrowUpRight size={15} /> We can’t wait to meet you</span></div></section>
    </>
  )
}
