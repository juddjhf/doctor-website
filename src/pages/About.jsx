import { Link, useOutletContext } from 'react-router-dom'
import { ArrowUpRight, Check, Heart, Lightbulb, ShieldCheck } from 'lucide-react'
import Button from '../components/Button'
import DoctorCard from '../components/DoctorCard'
import { doctors } from '../data/doctors'
import useClinicData from '../hooks/useClinicData'
import ApiNotice from '../components/ApiNotice'
import LoadingCards from '../components/LoadingCards'

export default function About() {
  const { onBook } = useOutletContext()
  const { data: liveDentists, loading, error } = useClinicData('/dentists', doctors)
  const dentistItems = liveDentists
  return (
    <>
      <section className="page-hero about-page-hero">
        <div className="container page-hero-grid">
          <div><span className="eyebrow"><span className="eyebrow-dot" /> A NEIGHBORHOOD DENTAL STUDIO</span><h1>Dental care with <span>a little more heart.</span></h1><p>We started SmileCraft with one simple thought: what if going to the dentist could feel a little more like being cared for?</p><Link className="quiet-link" to="/team">Meet the people who make it happen <ArrowUpRight size={17} /></Link></div>
          <div className="page-hero-image"><img src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1100&q=85" alt="Light-filled dental studio designed for patient comfort" /><span>Thoughtful care, right here in Brooklyn.</span></div>
        </div>
      </section>
      <section className="about-story section">
        <div className="container story-grid">
          <div className="story-image-wrap"><img src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1100&q=85" alt="Dentist talking through care with a patient" loading="lazy" /><div className="story-image-label"><span>01</span>Listen first. Always.</div></div>
          <div className="story-copy"><span className="eyebrow">OUR STORY</span><h2>We believe care should feel <span>as good as it is.</span></h2><p>For a lot of people, the dentist can bring up nerves, questions, or memories they’d rather leave behind. We get it. That’s why we built a practice around listening, explaining, and never rushing.</p><p>Our Brooklyn studio brings modern dental technology together in a space that feels calm and welcoming. Because when you feel comfortable, taking care of yourself gets a little easier.</p><div className="story-signoff"><span className="avatar">SC</span><span><strong>Here for you, always.</strong><small>The SmileCraft Dental Studio team</small></span></div></div>
        </div>
      </section>
      <section className="values-section">
        <div className="container"><div className="values-heading"><span className="eyebrow eyebrow-light">WHAT WE BELIEVE</span><h2>Good care is built on <span>good values.</span></h2></div>
          <div className="values-grid">
            <article><span className="value-icon"><Heart size={23} /></span><span className="value-number">01 / KINDNESS</span><h3>People before procedures.</h3><p>We see the person behind the smile. Your comfort, your questions, and your goals always come first.</p></article>
            <article><span className="value-icon"><Lightbulb size={23} /></span><span className="value-number">02 / CLARITY</span><h3>Knowledge is confidence.</h3><p>We explain your options in plain language, so you can make choices that feel right for you.</p></article>
            <article><span className="value-icon"><ShieldCheck size={23} /></span><span className="value-number">03 / TRUST</span><h3>Care you can count on.</h3><p>Honest recommendations and thoughtful treatment—never pressure, never guesswork.</p></article>
          </div>
        </div>
      </section>
      <section className="approach-section section">
        <div className="container approach-grid"><div><span className="eyebrow">THE SMILECARE APPROACH</span><h2>Modern dentistry. <span>Made more human.</span></h2><p>Great care starts with good relationships. We make sure you feel seen and understood before we ever talk treatment.</p><ul className="approach-list"><li><Check size={17} />We listen to what matters to you</li><li><Check size={17} />We take time to explain every option</li><li><Check size={17} />We make a plan together, at your pace</li></ul><Button onClick={onBook}>Come say hello</Button></div><div className="approach-image"><img src="https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=1000&q=85" alt="Dental team member providing gentle, attentive care" loading="lazy" /><span className="approach-image-caption">Care that feels different from the start.</span></div></div>
      </section>
      <section className="doctors-preview section about-team-section"><div className="container"><div className="section-heading"><div><span className="eyebrow">YOUR CARE TEAM</span><h2>Good people. <span>Good hands.</span></h2></div><Link className="text-link" to="/team">Meet our doctors <ArrowUpRight size={16} /></Link></div>{loading ? <LoadingCards count={3} /> : dentistItems.length ? <div className="doctors-grid">{dentistItems.map((doctor) => <DoctorCard key={doctor._id || doctor.name} doctor={doctor} onBook={onBook} />)}</div> : <div className="empty-state">Our team profiles are coming soon.</div>}<p className="demo-note">Dentist profiles are fictional sample content for this portfolio demo.</p><ApiNotice message={error} /></div></section>
    </>
  )
}
