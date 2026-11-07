import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ArrowUpRight, Menu, X } from 'lucide-react'

const links = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Our Team', to: '/team' },
  { label: 'Reviews', to: '/#reviews' },
  { label: 'Contact', to: '/contact' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="site-header">
      <nav className="navbar container" aria-label="Main navigation">
        <Link className="brand" to="/" onClick={closeMenu} aria-label="SmileCraft Dental Studio home">
          <span className="brand-mark" aria-hidden="true"><span /></span>
          <span className="brand-name">smilecraft<span>.</span><small>DENTAL STUDIO</small></span>
        </Link>
        <button
          className="mobile-menu-toggle"
          type="button"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
        <div id="primary-navigation" className={`nav-content${menuOpen ? ' is-open' : ''}`}>
          <div className="nav-links">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={closeMenu}
                className={({ isActive }) => `nav-link${isActive && !link.to.includes('#') ? ' active' : ''}`}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
          <Link className="button button-primary nav-cta" to="/book-appointment" onClick={closeMenu}>Book appointment <ArrowUpRight size={16} aria-hidden="true" /></Link>
        </div>
      </nav>
    </header>
  )
}
