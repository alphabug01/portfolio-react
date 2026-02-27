const projects = [
  {
    number: '01',
    title: 'Coming Soon',
    desc: 'A detailed case study of a project highlighting the problem, process, and solution.',
    tags: ['Spring Boot', 'Angular'],
  },
  {
    number: '02',
    title: 'Coming Soon',
    desc: 'Another project showcasing full-stack skills and design thinking approach.',
    tags: ['React', 'Node.js'],
  },
  {
    number: '03',
    title: 'Coming Soon',
    desc: 'A personal side project exploring interaction design and user experience.',
    tags: ['Next.js', 'UX Design'],
  },
]

export default function Projects() {
  return (
    <section className="section projects" id="projects">
      <div className="container">
        <div className="section-label reveal">03 — Projects</div>
        <h2 className="section-heading reveal">Things I've built.</h2>
        <p className="section-subtext reveal">Selected work — more coming soon.</p>
        <div className="projects-grid">
          {projects.map((project) => (
            <article className="project-card reveal" key={project.number}>
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
          ))}
        </div>
      </div>
    </section>
  )
}
