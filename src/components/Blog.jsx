import { Link } from 'react-router-dom'
import { posts } from '../data/posts'

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
            <Link key={post.slug} to={`/blog/${post.slug}`} className="blog-card reveal">
              <article>
                <div className="blog-meta">
                  <span className="blog-date">{post.date}</span>
                  <span className="blog-read">{post.readTime}</span>
                </div>
                <h3 className="blog-title">{post.title}</h3>
                <p className="blog-excerpt">{post.excerpt}</p>
                <span className="blog-link">
                  Read more &rarr;
                </span>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
