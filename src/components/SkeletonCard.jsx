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

export function BlogDetailSkeleton() {
  return (
    <div className="detail-view" aria-hidden="true" aria-busy="true">
      <div className="skeleton-line skeleton-line--back" />
      <div className="detail-header">
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem' }}>
          <div className="skeleton-line skeleton-line--meta" />
          <div className="skeleton-line skeleton-line--meta" />
        </div>
        <div className="skeleton-line skeleton-line--heading" />
      </div>
      <div className="detail-body detail-body--article">
        <div className="skeleton-line skeleton-line--text" />
        <div className="skeleton-line skeleton-line--text" />
        <div className="skeleton-line skeleton-line--short" style={{ marginBottom: 'var(--space-lg)' }} />
        <div className="skeleton-line skeleton-line--title" style={{ marginTop: 'var(--space-md)' }} />
        <div className="skeleton-line skeleton-line--text" />
        <div className="skeleton-line skeleton-line--text" />
        <div className="skeleton-line skeleton-line--short" />
      </div>
    </div>
  )
}

export function ProjectDetailSkeleton() {
  return (
    <div className="detail-view" aria-hidden="true" aria-busy="true">
      <div className="skeleton-line skeleton-line--back" />
      <div className="detail-header">
        <div className="skeleton-line skeleton-line--meta" style={{ marginBottom: '0.75rem' }} />
        <div className="skeleton-line skeleton-line--heading" />
        <div className="skeleton-tags">
          <span className="skeleton-tag" />
          <span className="skeleton-tag" />
          <span className="skeleton-tag" />
        </div>
      </div>
      <div className="skeleton-detail-hero" />
      <div className="detail-body">
        <div className="skeleton-line skeleton-line--title" />
        <div className="skeleton-line skeleton-line--text" />
        <div className="skeleton-line skeleton-line--text" />
        <div className="skeleton-line skeleton-line--short" style={{ marginBottom: 'var(--space-xl)' }} />
        <div className="skeleton-line skeleton-line--title" />
        <div className="skeleton-line skeleton-line--text" />
        <div className="skeleton-line skeleton-line--short" />
      </div>
    </div>
  )
}
