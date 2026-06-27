import { Link } from 'react-router-dom'
import site from '../data/site'

export default function BooksPage() {
  return (
    <section className="page books-page">
      <div className="page-header">
        <h1 className="page-title">The Library</h1>
        <p className="page-subtitle">Pick a book to explore its chapters</p>
      </div>

      <div className="bookshelf">
        {site.books.map((book, index) => (
          <Link
            key={book.id}
            to={`/books/${book.id}`}
            className={`book-card ${book.coverImage ? 'has-cover-image' : ''}`}
            style={{ '--book-color': book.coverColor, '--book-index': index }}
          >
            <div className="book-spine" />
            <div
              className="book-cover"
              style={book.coverImage ? { backgroundImage: `url(${book.coverImage})` } : undefined}
            >
              <div className="book-cover-overlay">
                <span className="book-cover-label">{book.subtitle}</span>
                <h2 className="book-cover-title">{book.title}</h2>
                <span className="book-chapter-count">
                  {book.chapters.length} {book.id === 'aurora-to-starry-nights' ? 'poems' : `chapter${book.chapters.length !== 1 ? 's' : ''}`}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
