import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { getBlogBySlug } from '../lib/api'
import Breadcrumb from './Breadcrumb'
import { BlogDetailSkeleton } from './SkeletonCard'

export default function BlogDetail() {
  const { slug } = useParams()
  const location = useLocation()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  const from = location.state?.from
  const backTo = from === 'home' ? '/#blog' : '/blog'
  const backLabel = from === 'home' ? 'Back to home' : 'Back to blog'

  useEffect(() => {
    getBlogBySlug(slug)
      .then(setPost)
      .catch(() => setPost(null))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return <BlogDetailSkeleton />
  }

  if (!post) {
    return (
      <main className="detail-view">
        <Link to={backTo} className="detail-back">
          &larr; {backLabel}
        </Link>
        <h2 className="detail-title">Blog post not found</h2>
      </main>
    )
  }

  const breadcrumbs = [
    { label: 'Home', to: '/' },
    { label: 'Blog', to: '/blog' },
    { label: post.title },
  ]

  return (
    <main className="detail-view">
      <Breadcrumb items={breadcrumbs} />
      <Link to={backTo} className="detail-back">
        &larr; {backLabel}
      </Link>

      <div className="detail-header">
        <div className="blog-meta">
          <span className="blog-date">{post.date}</span>
          <span className="blog-read">{post.readTime}</span>
        </div>
        <h2 className="detail-title">{post.title}</h2>
      </div>

      <div className="detail-body detail-body--article">
        <p className="blog-lead">{post.excerpt}</p>

        <div className="blog-article-content">
          {post.content ? (
            post.content.map((block, i) => {
              if (block.type === 'heading') return <h3 key={i}>{block.text}</h3>
              if (block.type === 'paragraph') return <p key={i}>{block.text}</p>
              if (block.type === 'quote')
                return <blockquote key={i}>{block.text}</blockquote>
              return null
            })
          ) : (
            <>
              <h3>Introduction</h3>
              <p>
                This is a placeholder for the full blog post. The complete article
                will explore this topic in depth, sharing insights from real-world
                experience and practical examples.
              </p>

              <h3>Key Insights</h3>
              <p>
                Coming soon — this section will dive into the core ideas, backed by
                examples and lessons learned from building real products.
              </p>

              <blockquote>
                "Good design is obvious. Great design is transparent." — Joe Sparano
              </blockquote>

              <h3>Conclusion</h3>
              <p>
                The full article will wrap up with actionable takeaways and
                reflections. Stay tuned for the complete piece.
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
