import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function DoctorCard({ doctor, onBook }) {
  const specialty = doctor.specialty || doctor.role || 'Dental care'
  const intro = doctor.bio || doctor.introduction || ''
  const slug = doctor._id || doctor.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  return (
    <article className="doctor-card" id={slug}>
      <div className="doctor-photo-wrap">
        <img
          className="doctor-photo"
          src={doctor.image}
          alt={`${doctor.name}, ${specialty}`}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.style.display = 'none'
            event.currentTarget.nextElementSibling.hidden = false
          }}
        />
        <div className="doctor-fallback" hidden aria-hidden="true">{doctor.initials}</div>
        <span className="doctor-experience">Fictional demo profile</span>
      </div>
      <div className="doctor-card-info">
        <div>
          <h3>{doctor.name}</h3>
          <p>{specialty}{intro ? ` · ${intro}` : ''}</p>
          <Link className="doctor-profile-link" to={`/team#${slug}`}>View profile <ArrowUpRight size={13} aria-hidden="true" /></Link>
        </div>
        <button className="doctor-book" type="button" onClick={onBook} aria-label={`Request an appointment with ${doctor.name}`}>
          <ArrowUpRight size={19} aria-hidden="true" />
        </button>
      </div>
    </article>
  )
}
