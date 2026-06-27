import { Link } from 'react-router-dom'
import site from '../data/site'

function SocialIcon({ href, label, children }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="social-link" aria-label={label}>
      {children}
    </a>
  )
}

export default function IntroPage() {
  const { name, tagline, linkedin, github } = site.profile

  return (
    <section className="page intro-page">
      <div className="intro-content">
        <p className="intro-label">Portfolio</p>
        <h1 className="intro-name">{name}</h1>
        <p className="intro-tagline">{tagline}</p>

        <Link to="/books" className="cta-button">
          Open the books
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  )
}
