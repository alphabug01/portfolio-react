import { useLayoutEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import About from './components/About'
import Blog from './components/Blog'
import BlogDetail from './components/BlogDetail'
import Contact from './components/Contact'
import Experience from './components/Experience'
import Footer from './components/Footer'
import Hero from './components/Hero'
import Navbar from './components/Navbar'
import ProjectDetail from './components/ProjectDetail'
import Projects from './components/Projects'
import Skills from './components/Skills'
import { useCursorGlow } from './hooks/useCursorGlow'
import { useGlobalScrollReveal } from './hooks/useScrollReveal'

function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Blog />
      <Contact />
      <Footer />
    </>
  )
}

function App() {
  const location = useLocation()

  useCursorGlow()
  useGlobalScrollReveal(`${location.pathname}${location.hash}`)

  useLayoutEffect(() => {
    const nav = document.getElementById('nav')
    const navOffset = nav ? Math.ceil(nav.getBoundingClientRect().height) + 16 : 96

    if (location.hash) {
      const targetId = location.hash.slice(1)
      const target = document.getElementById(targetId)

      if (target) {
        const anchor = target.querySelector('.section-label, .section-heading') || target
        const top = anchor.getBoundingClientRect().top + window.scrollY - navOffset
        window.scrollTo({ top, behavior: 'auto' })
        return
      }
    }

    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [location.pathname, location.hash])

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/projects/:slug"
        element={
          <main className="detail-page section">
            <div className="container">
              <ProjectDetail />
            </div>
          </main>
        }
      />
      <Route
        path="/blog/:slug"
        element={
          <main className="detail-page section">
            <div className="container">
              <BlogDetail />
            </div>
          </main>
        }
      />
      <Route
        path="*"
        element={
          <main className="detail-page section">
            <div className="container">
              <h1 className="detail-title">Page not found</h1>
            </div>
          </main>
        }
      />
    </Routes>
  )
}

export default App
