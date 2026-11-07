import { useEffect, useState } from 'react'
import { Link, useOutletContext, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, Check } from 'lucide-react'
import Button from '../components/Button'
import { services } from '../data/services'
import api from '../lib/api'
import ApiNotice from '../components/ApiNotice'

export default function ServiceDetail() {
  const { slug } = useParams()
  const { onBook } = useOutletContext()
  const [service, setService] = useState(services.find((item) => item.slug === slug))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    api.get(`/services/${slug}`)
      .then(({ data }) => { if (active) setService(data) })
      .catch((requestError) => {
        if (!active) return
        if (requestError.response?.status === 404) {
          setService(null)
          setError('We couldn’t find that service. Please browse our full service list.')
        } else if (!services.some((item) => item.slug === slug)) {
          setError('Service details are temporarily unavailable.')
        } else {
          setError('The API is unavailable. Showing sample service information.')
        }
      })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [slug])

  if (loading && !service) return <section className="section"><div className="container loading-state">Loading service details…</div></section>
  if (!service) return <section className="section"><div className="container empty-state"><h1>Service not found</h1><p>{error || 'That service is not available.'}</p><Link className="text-link" to="/services">Browse our services <ArrowLeft size={16} /></Link></div></section>

  return (
    <section className="page-hero service-detail-page">
      <div className="container service-detail-layout">
        <div>
          <Link className="quiet-link" to="/services"><ArrowLeft size={16} /> All services</Link>
          <span className="eyebrow service-detail-eyebrow"><span className="eyebrow-dot" /> PERSONALIZED DENTAL CARE</span>
          <h1>{service.title} <span>at SmileCraft.</span></h1>
          <p>{service.description}</p>
          <ul className="approach-list"><li><Check size={17} />Start with a conversation about your goals</li><li><Check size={17} />Explore options with the care team</li><li><Check size={17} />Get a plan tailored to your needs</li></ul>
          <Button onClick={onBook}>Request a consultation</Button>
          <ApiNotice message={error} />
        </div>
        <div className="page-hero-image"><img src={service.image || 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=1100&q=85'} alt={`Dental care related to ${service.title}`} /><span>Every smile starts with a conversation.</span></div>
      </div>
      <div className="container service-detail-note">All information on this site is for illustrative purposes only and is not medical advice.</div>
      <ArrowUpRight className="service-detail-decoration" aria-hidden="true" />
    </section>
  )
}
