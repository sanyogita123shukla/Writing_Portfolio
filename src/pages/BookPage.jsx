import { Link, useParams } from 'react-router-dom'
import { useState } from 'react'
import site from '../data/site'

export default function BookPage() {
  const { bookId } = useParams()
  const book = site.books.find((b) => b.id === bookId)
  const [activeChapterId, setActiveChapterId] = useState(book?.chapters[0]?.id)

  if (!book) {
    return (
      <section className="page">
        <p>Book not found.</p>
        <Link to="/books">← Back to library</Link>
      </section>
    )
  }

  const activeChapter = book.chapters.find((c) => c.id === activeChapterId) ?? book.chapters[0]
  const chapterLabel = book.id === 'aurora-to-starry-nights' ? 'Poems' : 'Chapters'

  return (
    <section className="page book-page">
      <div className="book-header">
        <Link to="/books" className="back-link">
          ← Back to library
        </Link>
        <div className="book-title-block" style={{ '--book-color': book.coverColor }}>
          {book.coverImage && (
            <img src={book.coverImage} alt={`${book.title} cover`} className="book-cover-thumb" />
          )}
          <div>
            <span className="book-subtitle-small">{book.subtitle}</span>
            <h1 className="book-title">{book.title}</h1>
          </div>
        </div>
      </div>

      <div className="book-reader">
        <aside className="chapter-list">
          <h2 className="chapter-list-heading">{chapterLabel}</h2>
          <ul>
            {book.chapters.map((chapter, index) => (
              <li key={chapter.id}>
                <button
                  type="button"
                  className={`chapter-btn ${activeChapter.id === chapter.id ? 'active' : ''}`}
                  onClick={() => setActiveChapterId(chapter.id)}
                  style={{ '--book-color': book.coverColor }}
                >
                  <span className="chapter-num">{String(index + 1).padStart(2, '0')}</span>
                  {chapter.title}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <article className="chapter-content" style={{ '--book-color': book.coverColor }}>
          <h2 className="chapter-title">{activeChapter.title}</h2>
          <div className="chapter-body">
            {activeChapter.content.split('\n\n').map((paragraph, i) => (
              <p key={i}>
                {paragraph.split('\n').map((line, j, arr) => (
                  <span key={j}>
                    {line}
                    {j < arr.length - 1 && <br />}
                  </span>
                ))}
              </p>
            ))}
          </div>
        </article>
      </div>
    </section>
  )
}
