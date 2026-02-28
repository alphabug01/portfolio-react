/**
 * Skeleton loaders that match exact card dimensions to prevent layout shift.
 */

export function ProjectCardSkeleton() {
  return (
    <div className="project-card skeleton-card" aria-hidden="true">
      <div className="project-image placeholder-img skeleton-pulse" />
      <div className="project-info">
        <div className="skeleton-line skeleton-line--title" />
        <div className="skeleton-line skeleton-line--text" />
        <div className="skeleton-line skeleton-line--text skeleton-line--short" />
        <div className="skeleton-tags">
          <span className="skeleton-tag" />
          <span className="skeleton-tag" />
        </div>
      </div>
    </div>
  )
}

export function BlogCardSkeleton() {
  return (
    <div className="blog-card skeleton-card" aria-hidden="true">
      <div className="blog-meta">
        <span className="skeleton-line skeleton-line--meta" />
        <span className="skeleton-line skeleton-line--meta" />
      </div>
      <div className="skeleton-line skeleton-line--title" />
      <div className="skeleton-line skeleton-line--text" />
      <div className="skeleton-line skeleton-line--text skeleton-line--short" />
      <div className="skeleton-line skeleton-line--link" />
    </div>
  )
}
