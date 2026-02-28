import { Link, useParams } from 'react-router-dom'
import { projects } from '../data/projects'

export default function ProjectDetail() {
  const { slug } = useParams()
  const project = projects.find((item) => item.slug === slug)

  if (!project) {
    return (
      <div className="detail-view">
        <Link to="/#projects" className="detail-back">
          &larr; Back to projects
        </Link>
        <h2 className="detail-title">Project not found</h2>
      </div>
    )
  }

  return (
    <div className="detail-view">
      <Link to="/#projects" className="detail-back">
        &larr; Back to projects
      </Link>

      <div className="detail-header">
        <span className="detail-label">{project.number}</span>
        <h2 className="detail-title">{project.title}</h2>
        <div className="project-tags" style={{ marginTop: '0.75rem' }}>
          {project.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>

      <div className="detail-hero placeholder-img">
        <div className="placeholder-content">
          <span>Project {project.number} — Preview</span>
        </div>
      </div>

      <div className="detail-body">
        <div className="detail-section">
          <h3>Overview</h3>
          <p>{project.desc}</p>
        </div>

        <div className="detail-section">
          <h3>The Problem</h3>
          <p>
            {project.problem ||
              'Detailed problem statement coming soon. This section will describe the challenge that needed to be solved and the context around it.'}
          </p>
        </div>

        <div className="detail-section">
          <h3>The Approach</h3>
          <p>
            {project.approach ||
              'Detailed approach coming soon. This section will walk through the design and development process, key decisions made, and the reasoning behind them.'}
          </p>
        </div>

        <div className="detail-section">
          <h3>The Outcome</h3>
          <p>
            {project.outcome ||
              'Results and impact coming soon. This section will highlight the outcomes, what was learned, and how it informed future work.'}
          </p>
        </div>

        {project.links && (
          <div className="detail-links">
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="detail-link-btn"
              >
                View Code &rarr;
              </a>
            )}
            {project.links.live && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                className="detail-link-btn detail-link-primary"
              >
                Live Demo &rarr;
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
