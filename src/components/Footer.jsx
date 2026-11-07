import { Camera, MapPin, Phone, Share2, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const currentYear = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-main">
          <div className="footer-brand">
            <Link className="brand brand-light" to="/">
              <span className="brand-mark" aria-hidden="true"><span /></span>
              <span className="brand-name">smilecraft<span>.</span><small>DENTAL STUDIO</small></span>
            </Link>
            <p>Thoughtful dentistry for the smile you’re in.</p>
            <div className="social-links">
              <a href="https://instagram.com" aria-label="Instagram"><Camera size={17} /></a>
              <a href="https://facebook.com" aria-label="Facebook"><Share2 size={17} /></a>
            </div>
          </div>
          <div className="footer-column">
            <h3>Explore</h3>
            <Link to="/about">Our story</Link><Link to="/services">Dental services</Link><Link to="/team">Meet the team</Link><Link to="/contact">Contact us</Link><Link to="/privacy-policy">Privacy policy</Link>
          </div>
          <div className="footer-column">
            <h3>Visit us</h3>
            <p><MapPin size={16} /> 42 Willow Lane, Suite 200<br />Brooklyn, NY 11201</p>
            <a href="tel:+17185550148"><Phone size={16} /> (718) 555-0148</a>
          </div>
          <div className="footer-appointment">
            <span className="eyebrow eyebrow-light">A healthier smile starts here</span>
            <h3>Let’s make your next visit feel different.</h3>
            <Link className="footer-link" to="/book-appointment">Request a visit <ArrowUpRight size={17} /></Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {currentYear} SmileCraft Dental Studio. Fictional portfolio demo.</span>
          <span>Made for brighter days <span className="footer-heart">♥</span></span>
        </div>
      </div>
    </footer>
  )
}
