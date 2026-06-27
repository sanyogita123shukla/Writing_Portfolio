import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import IntroPage from './pages/IntroPage'
import BooksPage from './pages/BooksPage'
import BookPage from './pages/BookPage'
import ConnectPage from './pages/ConnectPage'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/books/:bookId" element={<BookPage />} />
        <Route path="/connect" element={<ConnectPage />} />
      </Routes>
    </Layout>
  )
}
