import { useEffect } from 'react'
import { X } from 'lucide-react'
import { services } from '../data/services'
import AppointmentForm from './AppointmentForm'
import useClinicData from '../hooks/useClinicData'
import ApiNotice from './ApiNotice'

export default function AppointmentModal({ isOpen, onClose }) {
  const { data: liveServices, error } = useClinicData('/services', services)
  const availableServices = liveServices

  const handleClose = () => {
    onClose()
  }

  useEffect(() => {
    if (!isOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.body.classList.add('modal-open')
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.classList.remove('modal-open')
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) handleClose()
    }}>
      <section className="appointment-modal" role="dialog" aria-modal="true" aria-labelledby="appointment-title">
        <button className="modal-close" type="button" onClick={handleClose} aria-label="Close appointment form"><X size={21} /></button>
        <>
            <span className="eyebrow">YOUR VISIT, YOUR WAY</span>
            <h2 id="appointment-title">Let’s find a time for you.</h2>
            <p className="modal-intro">Tell us what you need. The clinic will contact you to confirm a time; submitting does not book an appointment.</p>
            <ApiNotice message={error} />
            <AppointmentForm services={availableServices} />
        </>
      </section>
    </div>
  )
}
