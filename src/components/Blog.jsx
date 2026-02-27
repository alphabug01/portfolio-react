const posts = [
  {
    date: 'Coming Soon',
    readTime: '5 min read',
    title: "Why \"Good Enough\" UX Isn't Good Enough",
    excerpt: 'Thoughts on why settling for functional-but-forgettable interfaces is a missed opportunity...',
  },
  {
    date: 'Coming Soon',
    readTime: '4 min read',
    title: "From Spring Boot to Next.js: A Backend Dev's Frontend Journey",
    excerpt: 'What happens when a Java developer falls in love with the frontend ecosystem...',
  },
  {
    date: 'Coming Soon',
    readTime: '6 min read',
    title: 'The Design School I Never Attended',
    excerpt: 'How an almost-decision shaped my approach to building software...',
  },
]

export default function Blog() {
  return (
    <section className="section blog" id="blog">
      <div className="container">
        <div className="section-label reveal">04 — Blog</div>
        <h2 className="section-heading reveal">Thinking out loud.</h2>
        <p className="section-subtext reveal">
          Notes on design, development, and the messy space in between.
        </p>
        <div className="blog-grid">
          {posts.map((post, i) => (
            <article className="blog-card reveal" key={i}>
              <div className="blog-meta">
                <span className="blog-date">{post.date}</span>
                <span className="blog-read">{post.readTime}</span>
              </div>
              <h3 className="blog-title">{post.title}</h3>
              <p className="blog-excerpt">{post.excerpt}</p>
              <a href="#" className="blog-link">
                Read more &rarr;
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
