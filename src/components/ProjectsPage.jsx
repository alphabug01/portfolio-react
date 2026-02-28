import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCardReveal } from '../hooks/useCardReveal'
import { getProjects } from '../lib/api'
import Breadcrumb from './Breadcrumb'
import Footer from './Footer'
import Navbar from './Navbar'
import { ProjectCardSkeleton } from './SkeletonCard'

export default function ProjectsPage() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const gridRef = useRef(null)
  useCardReveal(gridRef, !loading)

  useEffect(() => {
    getProjects()
      .then(setProjects)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Collect all unique tags for filters
  const allTags = ['All', ...new Set(projects.flatMap((p) => p.tags))]

  const filtered = filter === 'All'
    ? projects
    : projects.filter((p) => p.tags.includes(filter))

  return (
    <>
      <Navbar />
      <main className="listing-page section">
        <div className="container">
          <Breadcrumb items={[
            { label: 'Home', to: '/' },
            { label: 'Projects' },
          ]} />
          <div className="section-label">03 — Projects</div>
          <h1 className="section-heading">All Projects</h1>
          <p className="section-subtext">
            Everything I've built — side projects, client work, and experiments.
          </p>

          {!loading && projects.length > 0 && (
            <div className="listing-filters">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  className={`filter-btn${filter === tag ? ' active' : ''}`}
                  onClick={() => setFilter(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

          <div className="projects-grid" ref={gridRef}>
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <ProjectCardSkeleton key={i} />)
              : filtered.map((project) => (
                  <Link
                    key={project.slug}
                    to={`/projects/${project.slug}`}
                    state={{ from: 'projects-list' }}
                    className="project-card card-item"
                  >
                    <article>
                      <div className="project-image placeholder-img">
                        <div className="placeholder-content">
                          <span>Project {project.number}</span>
                        </div>
                      </div>
                      <div className="project-info">
                        <h3 className="project-title">{project.title}</h3>
                        <p className="project-desc">{project.desc}</p>
                        <div className="project-tags">
                          {project.tags.map((tag) => (
                            <span key={tag}>{tag}</span>
                          ))}
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
          </div>

          {!loading && filtered.length === 0 && (
            <p className="listing-empty">No projects match the selected filter.</p>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
