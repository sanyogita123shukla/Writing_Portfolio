/**
 * Parse aurora-poems-source.txt into aurora-poems.json
 * Run: node content/build-aurora.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const dir = dirname(fileURLToPath(import.meta.url))
const source = readFileSync(join(dir, 'aurora-poems-source.txt'), 'utf8')

function slugify(value, index) {
  const base = value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 50)
  return base || `poem-${index + 1}`
}

const poems = []
const blocks = source.split(/\n---\n/).slice(1)

for (const block of blocks) {
  const lines = block.trim().split('\n')
  if (!lines.length) continue

  const title = lines[0].trim()
  let bodyStart = 1

  if (lines[1]?.match(/^-+$/)) {
    bodyStart = 2
  }

  const content = lines.slice(bodyStart).join('\n').trim()
  if (!content) continue

  poems.push({
    id: slugify(title, poems.length),
    title,
    content,
  })
}

writeFileSync(join(dir, 'aurora-poems.json'), JSON.stringify(poems, null, 2), 'utf8')
console.log(`Wrote ${poems.length} poems to aurora-poems.json`)
