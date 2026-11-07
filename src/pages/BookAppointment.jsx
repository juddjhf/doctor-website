import { CalendarDays, ShieldCheck } from 'lucide-react'
import AppointmentForm from '../components/AppointmentForm'
import useClinicData from '../hooks/useClinicData'
import { services } from '../data/services'
import ApiNotice from '../components/ApiNotice'

export default function BookAppointment() {
  const { data: liveServices, error } = useClinicData('/services', services)
  return (
    <section className="page-hero booking-page">
      <div className="container booking-layout">
        <div className="booking-copy">
          <span className="eyebrow"><span className="eyebrow-dot" /> A GOOD PLACE TO START</span>
          <h1>Let’s find a time <span>that works for you.</span></h1>
          <p>Share a few details and our team will be in touch to confirm availability. This form sends an appointment request, not a confirmed booking.</p>
          <div className="booking-promise"><CalendarDays size={20} /><span><strong>Easy, thoughtful care</strong><small>Our team will follow up to confirm your visit.</small></span></div>
          <div className="booking-promise"><ShieldCheck size={20} /><span><strong>Your information stays private</strong><small>This is a fictional demo clinic; submitted requests are stored in its demo database.</small></span></div>
        </div>
        <div className="contact-form-panel booking-form-panel">
          <span className="eyebrow">APPOINTMENT INQUIRY</span>
          <h2>Tell us what you need.</h2>
          <p>We’ll get back to you about the next steps.</p>
          <ApiNotice message={error} />
          <AppointmentForm services={liveServices} />
        </div>
      </div>
    </section>
  )
}
