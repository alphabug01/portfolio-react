import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useLayoutEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import About from './components/About'
import Blog from './components/Blog'
import BlogDetail from './components/BlogDetail'
import BlogPage from './components/BlogPage'
import Contact from './components/Contact'
import Experience from './components/Experience'
import Footer from './components/Footer'
import Hero from './components/Hero'
import Navbar from './components/Navbar'
import ProjectDetail from './components/ProjectDetail'
import Projects from './components/Projects'
import ProjectsPage from './components/ProjectsPage'
import Skills from './components/Skills'
import SmoothScroller from './components/SmoothScroller'
import AdminBlogForm from './components/admin/AdminBlogForm'
import AdminChangePassword from './components/admin/AdminChangePassword'
import AdminDashboard from './components/admin/AdminDashboard'
import AdminLayout from './components/admin/AdminLayout'
import AdminLogin from './components/admin/AdminLogin'
import AdminProjectForm from './components/admin/AdminProjectForm'
import { AuthProvider } from './context/AuthContext'
import { useCursorGlow } from './hooks/useCursorGlow'
import { useGsapScrollReveal } from './hooks/useGsapScrollReveal'
import { useThemeShortcut } from './hooks/useThemeShortcut'

gsap.registerPlugin(ScrollTrigger)

function HomePage() {
  return (
    <>
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
  const showNavbar = location.pathname === '/'

  useThemeShortcut()
  useCursorGlow()
  useGsapScrollReveal(`${location.pathname}${location.hash}`)

  // Scroll restoration — handles scroll-to-top and hash-based scroll
  useLayoutEffect(() => {
    if (location.hash) {
      const targetId = location.hash.slice(1)

      // Wait for DOM + ScrollSmoother to be ready, then scroll
      const scrollToTarget = () => {
        const section = document.getElementById(targetId)
        if (!section) return

        const nav = document.getElementById('nav')
        const navOffset = nav ? Math.ceil(nav.getBoundingClientRect().height) + 16 : 80
        const heading = section.querySelector('.section-label, .section-heading')
        const scrollTarget = heading || section

        if (window.__smoother) {
          // Use GSAP ScrollSmoother's scrollTo for accurate positioning
          const y = scrollTarget.offsetTop - navOffset
          window.__smoother.scrollTo(y, false) // instant, no smooth animation
        } else {
          const top = scrollTarget.getBoundingClientRect().top + window.scrollY - navOffset
          window.scrollTo({ top, behavior: 'auto' })
        }
      }

      // Try immediately, then retry after data loads
      requestAnimationFrame(scrollToTarget)
      const timer = setTimeout(scrollToTarget, 500)
      return () => clearTimeout(timer)
    }

    // Scroll to top for non-hash routes
    if (window.__smoother) {
      window.__smoother.scrollTo(0, false)
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
  }, [location.pathname, location.hash])

  // Refresh ScrollTrigger on route change
  useEffect(() => {
    const timer = setTimeout(() => ScrollTrigger.refresh(), 300)
    return () => clearTimeout(timer)
  }, [location.pathname])

  return (
    <AuthProvider>
      {showNavbar && <Navbar />}
      <SmoothScroller>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
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
          <Route path="/blog" element={<BlogPage />} />
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

          {/* Admin routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="blogs/new" element={<AdminBlogForm />} />
            <Route path="blogs/:slug/edit" element={<AdminBlogForm />} />
            <Route path="projects/new" element={<AdminProjectForm />} />
            <Route path="projects/:slug/edit" element={<AdminProjectForm />} />
            <Route path="change-password" element={<AdminChangePassword />} />
          </Route>

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
      </SmoothScroller>
    </AuthProvider>
  )
}

export default App
