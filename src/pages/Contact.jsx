import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { CheckCircle2, Clock3, Mail, MapPin, Phone } from 'lucide-react'
import api, { getErrorMessage } from '../lib/api'

export default function Contact() {
  const { onBook } = useOutletContext()
  const [status, setStatus] = useState({ submitted: false, loading: false, error: '' })

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const values = Object.fromEntries(new FormData(form).entries())
    setStatus({ submitted: false, loading: true, error: '' })
    try {
      await api.post('/contact', values)
      setStatus({ submitted: true, loading: false, error: '' })
      form.reset()
    } catch (error) {
      setStatus({ submitted: false, loading: false, error: getErrorMessage(error) })
    }
  }

  return (
    <>
      <section className="page-hero contact-page-hero">
        <div className="container page-hero-grid">
          <div><span className="eyebrow"><span className="eyebrow-dot" /> WE’RE EASY TO REACH</span><h1>Let’s start with <span>hello.</span></h1><p>Questions, a first visit, or just want to get to know us? We’re happy to hear from you.</p><button className="quiet-link contact-book-link" type="button" onClick={onBook}>Prefer to request a visit? <span>Let’s find a time.</span></button></div>
          <div className="page-hero-image contact-hero-image"><img src="https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=1100&q=85" alt="A welcoming SmileCraft Dental Studio team member" /><span>We’re looking forward to meeting you.</span></div>
        </div>
      </section>
      <section className="contact-content section">
        <div className="container contact-grid">
          <div className="contact-details">
            <p className="demo-clinic-notice">Fictional demo clinic · Contact details are illustrative only.</p>
            <span className="eyebrow">COME ON IN</span><h2>We’re right here in <span>Brooklyn.</span></h2>
            <p className="contact-lead">A friendly face, a comfortable chair, and a team that’s happy to see you.</p>
            <div className="contact-detail"><span><MapPin size={20} /></span><div><strong>Find us</strong><p>42 Willow Lane, Suite 200<br />Brooklyn, NY 11201</p><a href="https://maps.google.com/?q=42+Willow+Lane+Brooklyn+NY+11201" target="_blank" rel="noreferrer">Get directions ↗</a></div></div>
            <div className="contact-detail"><span><Phone size={20} /></span><div><strong>Give us a call</strong><a href="tel:+17185550148">(718) 555-0148</a><small>We’re happy to help</small></div></div>
            <div className="contact-detail"><span><Mail size={20} /></span><div><strong>Send us a note</strong><a href="mailto:hello@smilecraft.example">hello@smilecraft.example</a><small>We’ll get back to you soon</small></div></div>
            <div className="hours-card"><Clock3 size={19} /><div><strong>When we’re here</strong><span>Mon–Fri <b>8:00 am – 6:00 pm</b></span><span>Saturday <b>9:00 am – 2:00 pm</b></span><span>Sunday <b>Closed</b></span></div></div>
          </div>
          <div className="contact-form-panel">
            {status.submitted ? (
              <div className="form-success">
                <CheckCircle2 size={40} aria-hidden="true" />
                <h2>Thanks for your note.</h2>
                <p>Your demo message has been received and stored by the demo backend.</p>
                <button className="text-link" type="button" onClick={() => setStatus({ submitted: false, loading: false, error: '' })}>Send another message</button>
              </div>
            ) : (
              <>
                <span className="eyebrow">SEND US A NOTE</span><h2>We’d love to hear from you.</h2><p>Fill in the form and we’ll be in touch. For this demo, your message stays right here.</p>
                <form className="contact-form" onSubmit={handleSubmit}>
                  <label>Your name<input name="name" autoComplete="name" placeholder="How should we address you?" required /></label>
                  <div className="form-row"><label>Email address<input name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></label><label>Phone number<input name="phone" type="tel" autoComplete="tel" pattern="([0-9]|\s|\+|\(|\)|\.|-){7,}" title="Enter a valid phone number" placeholder="(555) 000-0000" required /></label></div>
                  <label>What’s on your mind?<textarea name="message" rows="4" placeholder="Tell us how we can help..." minLength="10" required /></label>
                  {status.error && <p className="form-error" role="alert">{status.error}</p>}
                  <button className="button button-primary form-submit" type="submit" disabled={status.loading}>{status.loading ? 'Sending…' : 'Send your message'} <span aria-hidden="true">↗</span></button>
                </form>
                <p className="demo-note">Demo form · Your message is stored in this demo’s database.</p>
              </>
            )}
          </div>
        </div>
      </section>
      <section className="map-section">
        <div className="container map-placeholder">
          <div className="map-grid-pattern" aria-hidden="true" />
          <div className="map-road road-one" aria-hidden="true" /><div className="map-road road-two" aria-hidden="true" /><div className="map-road road-three" aria-hidden="true" />
          <div className="map-water" aria-hidden="true" />
          <div className="map-pin"><MapPin size={22} fill="currentColor" /><span>SmileCraft Dental Studio</span></div>
          <div className="map-address"><span className="eyebrow">NEIGHBORHOOD DENTAL CARE</span><strong>42 Willow Lane, Brooklyn</strong><a href="https://maps.google.com/?q=42+Willow+Lane+Brooklyn+NY+11201" target="_blank" rel="noreferrer">Open in maps ↗</a></div>
        </div>
      </section>
    </>
  )
}
