import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCardReveal } from '../hooks/useCardReveal'
import { getProjects } from '../lib/api'
import { ProjectCardSkeleton } from './SkeletonCard'

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const gridRef = useRef(null)
  useCardReveal(gridRef, !loading)

  useEffect(() => {
    getProjects()
      .then(setProjects)
      .catch((err) => console.error('[Projects] Failed to load projects:', err))
      .finally(() => setLoading(false))
  }, [])

  // Show only top 3 on homepage
  const featured = projects.slice(0, 3)

  return (
    <section className="section projects" id="projects">
      <div className="container">
        <div className="section-label reveal">03 — Projects</div>
        <h2 className="section-heading reveal">Things I've built.</h2>
        <p className="section-subtext reveal">Selected work — more coming soon.</p>
        <div className="projects-grid" ref={gridRef}>
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <ProjectCardSkeleton key={i} />)
            : featured.map((project) => (
                <Link
                  key={project.slug}
                  to={`/projects/${project.slug}`}
                  state={{ from: 'home' }}
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
        {!loading && projects.length > 3 && (
          <div className="section-view-all reveal">
            <Link to="/projects" className="view-all-link">
              View all projects &rarr;
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
