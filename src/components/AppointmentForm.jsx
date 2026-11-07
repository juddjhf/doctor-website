import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import api, { getErrorMessage } from '../lib/api'

const today = new Date().toISOString().slice(0, 10)

export default function AppointmentForm({ services }) {
  const [status, setStatus] = useState({ loading: false, error: '', success: false })

  async function handleSubmit(event) {
    event.preventDefault()
    const form = event.currentTarget
    const values = Object.fromEntries(new FormData(form).entries())
    setStatus({ loading: true, error: '', success: false })
    try {
      await api.post('/appointments', values)
      setStatus({ loading: false, error: '', success: true })
      form.reset()
    } catch (error) {
      setStatus({ loading: false, error: getErrorMessage(error), success: false })
    }
  }

  if (status.success) {
    return (
      <div className="form-success" role="status">
        <CheckCircle2 size={40} aria-hidden="true" />
        <h2>Thanks for reaching out.</h2>
        <p>Your request has been sent. The clinic will contact you to confirm availability; this is not a confirmed appointment.</p>
        <button type="button" className="text-link" onClick={() => setStatus({ loading: false, error: '', success: false })}>Send another request</button>
      </div>
    )
  }

  return (
    <form className="appointment-form" onSubmit={handleSubmit}>
      <label>Full name<input name="name" autoComplete="name" minLength="2" maxLength="100" placeholder="Your name" required /></label>
      <label>Email address<input name="email" type="email" autoComplete="email" maxLength="254" placeholder="you@example.com" required /></label>
      <label>Phone number<input name="phone" type="tel" autoComplete="tel" pattern="([0-9]|\s|\+|\(|\)|\.|-){7,}" title="Enter a valid phone number" placeholder="(555) 000-0000" required /></label>
      <label>Service<select name="service" defaultValue="" required><option value="" disabled>Select a service</option>{services.map((service) => <option key={service.slug || service.title}>{service.title}</option>)}</select></label>
      <label>Preferred date<input name="preferredDate" type="date" min={today} required /></label>
      <label>Preferred time<select name="preferredTime" defaultValue="" required><option value="" disabled>Select a time</option><option>Morning (8am–12pm)</option><option>Afternoon (12pm–4pm)</option><option>Late afternoon (4pm–6pm)</option></select></label>
      <label className="appointment-message">Anything you’d like us to know?<textarea name="message" rows="3" maxLength="2000" placeholder="Optional" /></label>
      {status.error && <p className="form-error" role="alert">{status.error}</p>}
      <button type="submit" className="button button-primary form-submit" disabled={status.loading}>
        {status.loading ? 'Sending request…' : 'Send appointment request'}
      </button>
      <p className="demo-note appointment-disclaimer">Demo clinic · The clinic will contact you to confirm availability. Submitting a request does not book an appointment.</p>
    </form>
  )
}
