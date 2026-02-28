import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCardReveal } from '../hooks/useCardReveal'
import { getBlogs } from '../lib/api'
import Breadcrumb from './Breadcrumb'
import Footer from './Footer'
import Navbar from './Navbar'
import { BlogCardSkeleton } from './SkeletonCard'

export default function BlogPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const gridRef = useRef(null)
  useCardReveal(gridRef, !loading)

  useEffect(() => {
    getBlogs()
      .then(setPosts)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <Navbar />
      <main className="listing-page section">
        <div className="container">
          <Breadcrumb items={[
            { label: 'Home', to: '/' },
            { label: 'Blog' },
          ]} />
          <div className="section-label">04 — Blog</div>
          <h1 className="section-heading">All Posts</h1>
          <p className="section-subtext">
            Notes on design, development, and the messy space in between.
          </p>

          <div className="blog-grid" ref={gridRef}>
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <BlogCardSkeleton key={i} />)
              : posts.map((post) => (
                  <Link
                    key={post.slug}
                    to={`/blog/${post.slug}`}
                    state={{ from: 'blog-list' }}
                    className="blog-card card-item"
                  >
                    <article>
                      <div className="blog-meta">
                        <span className="blog-date">{post.date}</span>
                        <span className="blog-read">{post.readTime}</span>
                      </div>
                      <h3 className="blog-title">{post.title}</h3>
                      <p className="blog-excerpt">{post.excerpt}</p>
                      <span className="blog-link">Read more &rarr;</span>
                    </article>
                  </Link>
                ))}
          </div>

          {!loading && posts.length === 0 && (
            <p className="listing-empty">No blog posts yet. Check back soon!</p>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
