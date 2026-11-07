import { ArrowUpRight } from 'lucide-react'
import { AlignCenter, HeartPulse, ShieldCheck, Smile, Sparkles, Stethoscope, Syringe } from 'lucide-react'
import { Link } from 'react-router-dom'

const iconMap = { AlignCenter, HeartPulse, ShieldCheck, Smile, Sparkles, Stethoscope, Syringe }

export default function ServiceCard({ service }) {
  const Icon = typeof service.icon === 'string' ? iconMap[service.icon] || Smile : service.icon || Smile
  const slug = service.slug || service.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  return (
    <article className="service-card">
      <div className="service-card-top">
        <span className="service-icon"><Icon size={22} strokeWidth={1.7} aria-hidden="true" /></span>
        <span className="service-number">{service.number || '•'}</span>
      </div>
      <h3>{service.title}</h3>
      <p>{service.description}</p>
      <Link className="text-link" to={`/services/${slug}`} aria-label={`Learn more about ${service.title}`}>
        Learn more <ArrowUpRight size={16} aria-hidden="true" />
      </Link>
    </article>
  )
}
