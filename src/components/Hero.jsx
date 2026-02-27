export default function Hero() {
  const handleScroll = (e, href) => {
    e.preventDefault()
    const target = document.querySelector(href)
    if (target) {
      const offset = 80
      const top = target.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  return (
    <section className="hero" id="hero">
      <div className="container">
        <div className="hero-content">
          <p className="hero-greeting reveal">Hi, I'm</p>
          <h1 className="hero-name reveal">
            Ashwani<br />Senapati
          </h1>
          <div className="hero-rule reveal"></div>
          <p className="hero-title reveal">Full Stack Developer &amp; Design Thinker</p>
          <p className="hero-philosophy reveal">
            I build things that <em>work</em> — not just things that look good.
          </p>
          <div className="hero-cta reveal">
            <a
              href="#projects"
              className="btn btn-primary"
              onClick={(e) => handleScroll(e, '#projects')}
            >
              View My Work
            </a>
            <a
              href="#contact"
              className="btn btn-ghost"
              onClick={(e) => handleScroll(e, '#contact')}
            >
              Get in Touch
            </a>
          </div>
        </div>
        <div className="hero-scroll">
          <div className="scroll-indicator">
            <span>Scroll</span>
            <div className="scroll-line"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
