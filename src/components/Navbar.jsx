import { useCallback, useEffect, useState } from 'react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Active section detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + 120
      const sections = document.querySelectorAll('section[id]')
      sections.forEach((section) => {
        const top = section.offsetTop
        const height = section.offsetHeight
        const id = section.getAttribute('id')
        if (scrollY >= top && scrollY < top + height) {
          setActiveSection(id)
        }
      })
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSmoothScroll = useCallback((e, href) => {
    e.preventDefault()
    const target = document.querySelector(href)
    if (target) {
      const offset = 80
      const top = target.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: 'smooth' })
    }
    setMobileOpen(false)
    document.body.style.overflow = ''
  }, [])

  const toggleMobile = () => {
    setMobileOpen((prev) => {
      document.body.style.overflow = !prev ? 'hidden' : ''
      return !prev
    })
  }

  const navLinks = [
    { href: '#about', label: 'About' },
    { href: '#experience', label: 'Experience' },
    { href: '#projects', label: 'Projects' },
    { href: '#blog', label: 'Blog' },
    { href: '#contact', label: 'Contact' },
  ]

  return (
    <nav className={`nav${scrolled ? ' scrolled' : ''}`} id="nav">
      <div className="nav-inner">
        <a
          href="#hero"
          className="nav-logo"
          onClick={(e) => handleSmoothScroll(e, '#hero')}
        >
          AS
        </a>
        <div className={`nav-links${mobileOpen ? ' open' : ''}`}>
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className={`nav-link${activeSection === href.slice(1) ? ' active' : ''}`}
              onClick={(e) => handleSmoothScroll(e, href)}
            >
              {label}
            </a>
          ))}
        </div>
        <button
          className={`nav-toggle${mobileOpen ? ' active' : ''}`}
          aria-label="Toggle menu"
          onClick={toggleMobile}
        >
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  )
}
