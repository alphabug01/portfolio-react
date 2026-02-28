import { Link } from 'react-router-dom'
import { projects } from '../data/projects'

export default function Projects() {

  return (
    <section className="section projects" id="projects">
      <div className="container">
        <div className="section-label reveal">03 — Projects</div>
        <h2 className="section-heading reveal">Things I've built.</h2>
        <p className="section-subtext reveal">Selected work — more coming soon.</p>
        <div className="projects-grid">
          {projects.map((project) => (
            <Link key={project.slug} to={`/projects/${project.slug}`} className="project-card reveal">
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
      </div>
    </section>
  )
}
