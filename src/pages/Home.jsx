import { useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Armchair,
  ClipboardCheck,
  CalendarDays,
  Check,
  Clock3,
  Heart,
  HeartHandshake,
  Activity,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import Button from '../components/Button'
import ServiceCard from '../components/ServiceCard'
import DoctorCard from '../components/DoctorCard'
import TestimonialCard from '../components/TestimonialCard'
import { services } from '../data/services'
import { doctors } from '../data/doctors'
import { testimonials } from '../data/testimonials'
import useClinicData from '../hooks/useClinicData'
import { ChevronDown } from 'lucide-react'
import ApiNotice from '../components/ApiNotice'
import LoadingCards from '../components/LoadingCards'

const heroImage = 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1600&q=90'

export default function Home() {
  const { onBook } = useOutletContext()
  const [testimonialIndex, setTestimonialIndex] = useState(0)
  const [openFaq, setOpenFaq] = useState(0)
  const { data: liveServices, loading: servicesLoading, error: servicesError } = useClinicData('/services', services)
  const { data: liveDentists, loading: dentistsLoading, error: dentistsError } = useClinicData('/dentists', doctors)
  const { data: liveReviews, error: reviewsError } = useClinicData('/reviews', testimonials)
  const serviceItems = liveServices
  const dentistItems = liveDentists
  const reviewItems = liveReviews
  const visibleTestimonials = reviewItems.length
    ? [0, 1].map((offset) => reviewItems[(testimonialIndex + offset) % reviewItems.length])
    : []

  return (
    <>
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow"><span className="eyebrow-dot" /> A DIFFERENT KIND OF DENTAL VISIT</span>
            <h1>Confident smiles begin with <span>exceptional care.</span></h1>
            <p className="hero-description">Modern dentistry, a genuinely gentle touch, and a team that takes the time to get to know you.</p>
            <div className="hero-actions">
              <Button onClick={onBook}>Book an appointment</Button>
              <Link className="quiet-link" to="/services">Explore our services <ArrowUpRight size={17} /></Link>
            </div>
            <div className="hero-rating">
              <Check size={16} aria-hidden="true" />
              <span><strong>Thoughtful care</strong> from a team that listens</span>
            </div>
          </div>
          <div className="hero-visual">
            <img className="hero-image" src={heroImage} alt="Welcoming, light-filled modern dental clinic" />
            <div className="hero-image-shade" />
            <div className="hero-image-caption"><span className="caption-dot" />A calmer kind of care<span>Brooklyn, New York</span></div>
            <div className="hero-floating-card">
              <span className="floating-icon"><Heart size={20} fill="currentColor" /></span>
              <span><strong>Here for your smile</strong><small>and everything behind it</small></span>
            </div>
            <div className="hero-vertical-label">CARE THAT FEELS LIKE YOU</div>
          </div>
        </div>
        <div className="container trust-strip">
          <div className="trust-intro">A little more care.<br /><span>A lot more confidence.</span></div>
          <div className="trust-item"><span><ShieldCheck size={20} /></span><div><strong>Personalized dental care</strong><small>Thoughtful plans, shaped around you</small></div></div>
          <div className="trust-item"><span><Sparkles size={20} /></span><div><strong>Thoughtful technology</strong><small>Modern care, made simple</small></div></div>
          <div className="trust-item"><span><HeartHandshake size={20} /></span><div><strong>Friendly dental team</strong><small>Kind people, here to help</small></div></div>
          <div className="trust-item"><span><Heart size={20} /></span><div><strong>Patient-first always</strong><small>Comfort at every visit</small></div></div>
          <ArrowDownRight className="trust-arrow" size={25} aria-hidden="true" />
        </div>
      </section>

      <section className="section services-preview">
        <div className="container">
          <div className="section-heading">
            <div><span className="eyebrow">HOW WE CAN HELP</span><h2>Care for every <span>kind of smile.</span></h2></div>
            <div className="section-heading-aside"><p>From a simple checkup to a smile transformation, you’re in thoughtful hands.</p><Link className="text-link" to="/services">Explore all services <ArrowUpRight size={16} /></Link></div>
          </div>
          {servicesLoading ? <LoadingCards /> : serviceItems.length ? <div className="services-grid">{serviceItems.slice(0, 4).map((service) => <ServiceCard key={service._id || service.title} service={service} />)}</div> : <div className="empty-state">Our service list is being updated.</div>}
          <ApiNotice message={servicesError} />
        </div>
      </section>

      <section className="about-preview">
        <div className="container about-grid">
          <div className="about-photo-stack">
            <img className="about-photo-main" src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=85" alt="Comfortable modern dental treatment room" loading="lazy" />
            <div className="about-note"><span className="about-note-icon"><Check size={18} /></span><span><strong>Care, without the rush</strong><small>Every visit is yours to shape.</small></span></div>
            <span className="photo-caption">A space designed around you</span>
          </div>
          <div className="about-copy">
            <span className="eyebrow">A LITTLE ABOUT US</span>
            <h2>Good dentistry starts with <span>feeling at ease.</span></h2>
            <p>We believe a great dental experience is about more than healthy teeth. It’s about being listened to, having things explained clearly, and feeling genuinely cared for.</p>
            <p>At SmileCraft, we pair thoughtful dentistry with a warm neighborhood feel—so you can show up exactly as you are.</p>
            <div className="about-highlights"><span><Check size={15} />Clear, no-pressure guidance</span><span><Check size={15} />Modern comfort-first care</span></div>
            <Link to="/about" className="text-link">Get to know us <ArrowUpRight size={16} /></Link>
            <div className="about-signoff">With care, <strong>The SmileCraft team</strong></div>
          </div>
        </div>
      </section>

      <section className="why-choose-section section">
        <div className="container">
          <div className="section-heading"><div><span className="eyebrow">THE SMILECRAFT DIFFERENCE</span><h2>A better feeling, <span>at every visit.</span></h2></div><p className="heading-description">Small, thoughtful details make care feel more personal—from the first hello to your follow-up.</p></div>
          <div className="why-choose-grid">
            <article><span><Activity size={21} /></span><h3>Modern dental technology</h3><p>Thoughtful tools help make your care clear and comfortable.</p></article>
            <article><span><Armchair size={21} /></span><h3>A comfortable environment</h3><p>A calm, welcoming space with room to settle in and ask questions.</p></article>
            <article><span><ClipboardCheck size={21} /></span><h3>Personalized treatment plans</h3><p>Your goals guide the conversation and the next steps.</p></article>
            <article><span><HeartHandshake size={21} /></span><h3>A friendly professional team</h3><p>Kind people who listen, explain, and respect your pace.</p></article>
          </div>
        </div>
      </section>

      <section className="section doctors-preview">
        <div className="container">
          <div className="section-heading">
            <div><span className="eyebrow">THE PEOPLE BEHIND YOUR CARE</span><h2>Meet your smile’s <span>biggest fans.</span></h2></div>
            <div className="section-heading-aside"><p>Skilled, kind, and always happy to answer one more question.</p><Link className="text-link" to="/team">Meet the whole team <ArrowUpRight size={16} /></Link></div>
          </div>
          {dentistsLoading ? <LoadingCards count={3} /> : dentistItems.length ? <div className="doctors-grid">{dentistItems.map((doctor) => <DoctorCard key={doctor._id || doctor.name} doctor={doctor} onBook={onBook} />)}</div> : <div className="empty-state">Our team profiles are coming soon.</div>}
          <p className="demo-note">Dentist profiles shown are fictional sample content for this portfolio demo.</p>
          <ApiNotice message={dentistsError} />
        </div>
      </section>

      <section className="testimonial-section" id="reviews">
        <div className="container testimonial-layout">
          <div className="testimonial-intro">
            <span className="eyebrow eyebrow-light">SAMPLE DEMO REVIEWS</span>
            <h2>It feels good to <span>feel good.</span></h2>
            <p>We’re grateful to be part of our patients’ stories—and even more grateful they share them.</p>
            {reviewItems.length > 0 && <div className="testimonial-controls">
              <button type="button" aria-label="Previous testimonials" onClick={() => setTestimonialIndex((index) => (index + reviewItems.length - 1) % reviewItems.length)}><ArrowLeft size={18} /></button>
              <button type="button" aria-label="Next testimonials" onClick={() => setTestimonialIndex((index) => (index + 1) % reviewItems.length)}><ArrowRight size={18} /></button>
            </div>}
          </div>
          {visibleTestimonials.length ? <div className="testimonial-cards" aria-live="polite">{visibleTestimonials.map((testimonial) => <TestimonialCard key={testimonial._id || testimonial.name} testimonial={testimonial} />)}</div> : <div className="testimonial-cards"><p className="testimonial-card">No sample reviews are available right now.</p></div>}
          <p className="testimonial-demo-note">All testimonials shown are fictional sample content for this portfolio demo.</p>
          {reviewsError && <p className="testimonial-demo-note">{reviewsError}</p>}
        </div>
      </section>

      <section className="section faq-section">
        <div className="container faq-layout">
          <div><span className="eyebrow">A FEW THINGS YOU MAY BE WONDERING</span><h2>Good questions. <span>Clear answers.</span></h2><p>Have another question? Our demo team would be happy to help.</p><Link className="text-link" to="/contact">Get in touch <ArrowUpRight size={16} /></Link></div>
          <div className="faq-list">{[
            ['What should I expect at my first visit?', 'We start by listening, learning about your goals, and helping you feel comfortable. Your care team will explain what to expect before anything begins.'],
            ['Do you accept new patients?', 'Yes. SmileCraft is a fictional demo practice and welcomes new-patient inquiries through the request form.'],
            ['How can I book an appointment?', 'Send an appointment request online or call the demo office. The clinic will contact you to confirm availability; requests are not confirmed bookings.'],
            ['What dental services do you offer?', 'Our sample service list includes general, cosmetic, preventive, whitening, implant, and clear-aligner consultation services.'],
            ['How often should I schedule dental checkups?', 'A dental professional can recommend a schedule that suits your needs. Many people arrange routine visits about every six months.'],
          ].map(([question, answer], index) => (
            <article className={`faq-item${openFaq === index ? ' is-open' : ''}`} key={question}>
              <button type="button" aria-expanded={openFaq === index} onClick={() => setOpenFaq(openFaq === index ? -1 : index)}><span>{question}</span><ChevronDown size={18} /></button>
              {openFaq === index && <p>{answer}</p>}
            </article>
          ))}</div>
        </div>
      </section>

      <section className="stats-section">
        <div className="container stats-grid">
          <div className="stats-heading"><span className="eyebrow">A FEW THINGS WE’RE PROUD OF</span><h2>Small moments.<br /><span>Big reasons to smile.</span></h2></div>
          <div className="stat"><strong>01</strong><p>Listen first.<br />Understand your goals.</p></div>
          <div className="stat"><strong>02</strong><p>Explain clearly.<br />Explore your options.</p></div>
          <div className="stat"><strong>03</strong><p>Plan together.<br />Move at your pace.</p></div>
        </div>
      </section>

      <section className="appointment-cta">
        <div className="container appointment-cta-inner">
          <div className="cta-mark" aria-hidden="true"><CalendarDays size={28} /></div>
          <div><span className="eyebrow eyebrow-light">YOUR NEXT CHAPTER STARTS HERE</span><h2>Ready to feel good about your dental care?</h2><p>Let’s make your first visit an easy one.</p></div>
          <Button variant="light" onClick={onBook}>Request an appointment</Button>
          <span className="cta-clock"><Clock3 size={15} /> Here when you need us</span>
        </div>
      </section>
    </>
  )
}
