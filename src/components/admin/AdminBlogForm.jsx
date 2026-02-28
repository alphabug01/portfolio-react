import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createBlog, getBlogBySlug, updateBlog } from '../../lib/api'

export default function AdminBlogForm() {
  const { slug } = useParams() // undefined for "new"
  const isEdit = Boolean(slug)
  const navigate = useNavigate()

  const [form, setForm] = useState({
    slug: '',
    title: '',
    date: '',
    readTime: '5 min read',
    excerpt: '',
    content: [],
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEdit) {
      getBlogBySlug(slug)
        .then((data) => {
          if (!data) {
            setError('Blog not found')
          } else {
            setForm(data)
          }
        })
        .catch(() => setError('Failed to load blog'))
    }
  }, [slug, isEdit])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleSlugify() {
    if (!isEdit && form.title && !form.slug) {
      const generated = form.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      setForm((prev) => ({ ...prev, slug: generated }))
    }
  }

  // Content blocks management
  function addBlock(type) {
    setForm((prev) => ({
      ...prev,
      content: [...prev.content, { type, text: '' }],
    }))
  }

  function updateBlock(index, text) {
    setForm((prev) => {
      const content = [...prev.content]
      content[index] = { ...content[index], text }
      return { ...prev, content }
    })
  }

  function removeBlock(index) {
    setForm((prev) => ({
      ...prev,
      content: prev.content.filter((_, i) => i !== index),
    }))
  }

  function moveBlock(index, direction) {
    setForm((prev) => {
      const content = [...prev.content]
      const newIndex = index + direction
      if (newIndex < 0 || newIndex >= content.length) return prev
      ;[content[index], content[newIndex]] = [content[newIndex], content[index]]
      return { ...prev, content }
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      if (isEdit) {
        await updateBlog(slug, form)
      } else {
        await createBlog(form)
      }
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="admin-form-page">
      <h2>{isEdit ? 'Edit Blog Post' : 'New Blog Post'}</h2>
      {error && <div className="admin-error">{error}</div>}

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="admin-form-row">
          <div className="admin-field">
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              onBlur={handleSlugify}
              required
            />
          </div>
          <div className="admin-field">
            <label htmlFor="slug">Slug *</label>
            <input
              id="slug"
              name="slug"
              value={form.slug}
              onChange={handleChange}
              required
              disabled={isEdit}
              placeholder="auto-generated-from-title"
            />
          </div>
        </div>

        <div className="admin-form-row">
          <div className="admin-field">
            <label htmlFor="date">Date</label>
            <input
              id="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              placeholder="e.g. Mar 15, 2026"
            />
          </div>
          <div className="admin-field">
            <label htmlFor="readTime">Read Time</label>
            <input
              id="readTime"
              name="readTime"
              value={form.readTime}
              onChange={handleChange}
              placeholder="e.g. 5 min read"
            />
          </div>
        </div>

        <div className="admin-field">
          <label htmlFor="excerpt">Excerpt</label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={form.excerpt}
            onChange={handleChange}
            rows={3}
            placeholder="A short summary of the blog post..."
          />
        </div>

        {/* Content Blocks */}
        <div className="admin-content-section">
          <div className="admin-section-header">
            <h3>Content Blocks</h3>
            <div className="admin-block-buttons">
              <button type="button" onClick={() => addBlock('heading')} className="admin-btn admin-btn-outline admin-btn-sm">
                + Heading
              </button>
              <button type="button" onClick={() => addBlock('paragraph')} className="admin-btn admin-btn-outline admin-btn-sm">
                + Paragraph
              </button>
              <button type="button" onClick={() => addBlock('quote')} className="admin-btn admin-btn-outline admin-btn-sm">
                + Quote
              </button>
            </div>
          </div>

          {form.content.length === 0 && (
            <p className="admin-empty-hint">No content blocks yet. Add headings, paragraphs, or quotes above.</p>
          )}

          {form.content.map((block, i) => (
            <div key={i} className="admin-block">
              <div className="admin-block-header">
                <span className="admin-block-type">{block.type}</span>
                <div className="admin-block-controls">
                  <button type="button" onClick={() => moveBlock(i, -1)} disabled={i === 0} title="Move up">
                    ↑
                  </button>
                  <button type="button" onClick={() => moveBlock(i, 1)} disabled={i === form.content.length - 1} title="Move down">
                    ↓
                  </button>
                  <button type="button" onClick={() => removeBlock(i)} className="admin-block-remove" title="Remove">
                    ×
                  </button>
                </div>
              </div>
              <textarea
                value={block.text}
                onChange={(e) => updateBlock(i, e.target.value)}
                rows={block.type === 'paragraph' ? 4 : 2}
                placeholder={`Enter ${block.type} text...`}
              />
            </div>
          ))}
        </div>

        <div className="admin-form-actions">
          <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
            {saving ? 'Saving...' : isEdit ? 'Update Post' : 'Create Post'}
          </button>
          <button type="button" className="admin-btn admin-btn-outline" onClick={() => navigate('/admin/dashboard')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
