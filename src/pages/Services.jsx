import { useOutletContext } from 'react-router-dom'
import { Check } from 'lucide-react'
import Button from '../components/Button'
import ServiceCard from '../components/ServiceCard'
import { services } from '../data/services'
import useClinicData from '../hooks/useClinicData'
import ApiNotice from '../components/ApiNotice'
import LoadingCards from '../components/LoadingCards'

export default function Services() {
  const { onBook } = useOutletContext()
  const { data: liveServices, loading, error } = useClinicData('/services', services)
  const serviceItems = liveServices
  return (
    <>
      <section className="page-hero services-page-hero">
        <div className="container page-hero-grid">
          <div><span className="eyebrow"><span className="eyebrow-dot" /> HERE FOR YOUR WHOLE SMILE</span><h1>Thoughtful care for <span>every smile.</span></h1><p>From preventive checkups to the change you’ve been dreaming of, we’ll help you find the right care for you.</p><Button onClick={onBook}>Let’s talk about your smile</Button></div>
          <div className="page-hero-image"><img src="https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=1000&q=85" alt="Friendly dental care in a bright, modern clinic" /><span>Care that meets you where you are.</span></div>
        </div>
      </section>
      <section className="section services-all">
        <div className="container">
          <div className="section-heading"><div><span className="eyebrow">OUR SERVICES</span><h2>All the care you need, <span>under one roof.</span></h2></div><p className="heading-description">Every treatment starts with a conversation. We’ll take the time to understand your needs, explain your options, and make a plan that feels right.</p></div>
          {loading ? <LoadingCards count={6} /> : serviceItems.length ? <div className="services-grid services-grid-full">{serviceItems.map((service) => <ServiceCard key={service._id || service.title} service={service} />)}</div> : <div className="empty-state">No services are available right now.</div>}
          <ApiNotice message={error} />
        </div>
      </section>
      <section className="service-promise">
        <div className="container service-promise-inner">
          <div><span className="eyebrow">NO SURPRISES, JUST GOOD CARE</span><h2>Here’s what you can always expect.</h2></div>
          <div className="promise-list"><span><Check size={17} />Clear explanations, every step of the way</span><span><Check size={17} />A care plan shaped around you</span><span><Check size={17} />No-pressure conversations and honest guidance</span></div>
          <Button onClick={onBook}>Talk with our team</Button>
        </div>
      </section>
    </>
  )
}
