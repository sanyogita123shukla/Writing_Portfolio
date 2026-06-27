# Creative Portfolio — Sanyogita Shukla

A book-themed portfolio with lilac, yellow, and pink abstract styling.

## First-time setup (book cover)

Run once to copy your poetry book cover into the site:

```powershell
cd Projects\creative-portfolio
.\setup-assets.ps1
```

Or manually copy your cover to `public/covers/aurora-to-starry-nights.png`

## Edit your content

**`content/site.json`** — profile, contact, plays book chapters

**`content/aurora-poems-source.txt`** — all poetry for *Aurora to Starry Nights*

Each poem is separated by a line with only `---`. Format:

```
Poem Title
----------

Your poem lines here...


---

Next Poem Title
---------------
...
```

### Add a chapter

Under any book's `chapters` array, add:

```json
{
  "id": "unique-id",
  "title": "Chapter Title",
  "content": "Your writing here. Use \\n\\n for new paragraphs."
}
```

### Add or rename a book

Copy an existing book object in the `books` array and change `id`, `title`, `subtitle`, and `coverColor`.

## Run locally

```bash
cd Projects/creative-portfolio
npm install
npm run dev
```

Open the URL shown in the terminal (usually http://localhost:5173).

## Build for the web

```bash
npm run build
npm run preview
```

Deploy the `dist` folder to [Vercel](https://vercel.com) or [Netlify](https://netlify.com) for free hosting.
