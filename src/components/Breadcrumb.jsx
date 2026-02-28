import { Link } from 'react-router-dom'

/**
 * Breadcrumb navigation component.
 * @param {Array<{label: string, to?: string}>} items - last item has no `to` (current page)
 */
export default function Breadcrumb({ items = [] }) {
  if (!items.length) return null

  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol className="breadcrumb-list">
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          return (
            <li key={i} className="breadcrumb-item">
              {!isLast && item.to ? (
                <>
                  <Link to={item.to} className="breadcrumb-link">
                    {item.label}
                  </Link>
                  <span className="breadcrumb-sep" aria-hidden="true">/</span>
                </>
              ) : (
                <span className="breadcrumb-current" aria-current="page">
                  {item.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
