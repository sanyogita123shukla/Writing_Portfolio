import { Link, useLocation } from 'react-router-dom'
import GradientBackground from './GradientBackground'
import site from '../data/site'

const navItems = [
  { path: '/', label: 'Intro' },
  { path: '/books', label: 'Books' },
  { path: '/connect', label: 'Connect' },
]

export default function Layout({ children }) {
  const location = useLocation()
  const isBookDetail = location.pathname.startsWith('/books/') && location.pathname !== '/books'

  return (
    <div className="layout">
      <GradientBackground />
      <header className="header">
        <Link to="/" className="logo">
          Keeping .. in my journey because I know there is much more to my journey
        </Link>
        <nav className="nav">
          {navItems.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`nav-link ${location.pathname === path || (path === '/books' && isBookDetail) ? 'active' : ''}`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="main">{children}</main>
    </div>
  )
}
