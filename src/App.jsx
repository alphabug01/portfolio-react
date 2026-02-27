import About from './components/About'
import Blog from './components/Blog'
import Contact from './components/Contact'
import Experience from './components/Experience'
import Footer from './components/Footer'
import Hero from './components/Hero'
import Navbar from './components/Navbar'
import Projects from './components/Projects'
import Skills from './components/Skills'
import { useCursorGlow } from './hooks/useCursorGlow'
import { useGlobalScrollReveal } from './hooks/useScrollReveal'

function App() {
  useCursorGlow()
  useGlobalScrollReveal()

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

export default App
