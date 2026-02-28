import { Link, useParams } from 'react-router-dom'
import { posts } from '../data/posts'

export default function BlogDetail() {
  const { slug } = useParams()
  const post = posts.find((item) => item.slug === slug)

  if (!post) {
    return (
      <div className="detail-view">
        <Link to="/#blog" className="detail-back">
          &larr; Back to blog
        </Link>
        <h2 className="detail-title">Blog post not found</h2>
      </div>
    )
  }

  return (
    <div className="detail-view">
      <Link to="/#blog" className="detail-back">
        &larr; Back to blog
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
    </div>
  )
}
