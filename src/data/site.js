import siteData from '../../content/site.json'
import auroraSource from '../../content/aurora-poems-source.txt?raw'

function slugify(value, index) {
  const base = value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 50)
  return base || `poem-${index + 1}`
}

function parseAuroraPoems(source) {
  return source
    .split(/\n---\n/)
    .slice(1)
    .map((block, index) => {
      const lines = block.trim().split('\n')
      if (!lines.length) return null

      const title = lines[0].trim()
      let bodyStart = 1
      if (lines[1]?.match(/^-+$/)) bodyStart = 2

      const content = lines.slice(bodyStart).join('\n').trim()
      if (!content) return null

      return {
        id: slugify(title, index),
        title,
        content,
      }
    })
    .filter(Boolean)
}

const auroraChapters = parseAuroraPoems(auroraSource)
const books = siteData.books.map((book) =>
  book.id === 'aurora-to-starry-nights'
    ? { ...book, chapters: auroraChapters }
    : book,
)

export default { ...siteData, books }
