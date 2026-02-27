const skillGroups = [
  {
    title: 'Backend',
    skills: ['Spring Boot', 'Spring JPA', 'REST APIs', 'Java', 'Node.js'],
  },
  {
    title: 'Frontend',
    skills: ['Angular', 'TypeScript', 'HTML / CSS', 'React', 'Next.js'],
  },
  {
    title: 'Design & UX',
    skills: ['Interaction Design', 'UI/UX Thinking', 'Responsive Design', 'Accessibility'],
  },
]

export default function Skills() {
  return (
    <section className="section skills">
      <div className="container">
        <div className="skills-grid">
          {skillGroups.map((group) => (
            <div className="skill-group reveal" key={group.title}>
              <h3 className="skill-group-title">{group.title}</h3>
              <div className="skill-tags">
                {group.skills.map((skill) => (
                  <span className="skill-tag" key={skill}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
