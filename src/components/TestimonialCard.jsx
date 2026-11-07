import { Star } from 'lucide-react'

export default function TestimonialCard({ testimonial }) {
  return (
    <article className="testimonial-card">
      <div className="rating" aria-label={`${testimonial.rating || 5} out of 5 stars`}>
        {Array.from({ length: testimonial.rating || 5 }, (_, index) => <Star key={index} size={15} fill="currentColor" aria-hidden="true" />)}
      </div>
      <blockquote>“{testimonial.quote}”</blockquote>
      <div className="testimonial-person">
        <span className="avatar">{testimonial.initials || testimonial.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span>
        <span><strong>{testimonial.name}</strong><small>{testimonial.detail}</small></span>
      </div>
    </article>
  )
}
