/**
 * Docs loader: walks `docs/` on the server, parses frontmatter, returns a
 * structured tree for the admin help route. Pure Node fs — runs at request
 * time in the /admin/help route (force-dynamic).
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'

const DOCS_ROOT = path.join(process.cwd(), 'docs')

export type DocCategory = 'SOPs' | 'Reference' | 'Overview'

export type DocFrontmatter = {
  title: string
  summary?: string
  category: DocCategory
  order?: number
  /** Path slug segments relative to /admin/help, e.g. ['sop', 'daily-triage'] */
  slug: string[]
}

export type DocArticle = DocFrontmatter & {
  content: string
  /** Full slug as a URL string, e.g. "sop/daily-triage". */
  path: string
}

export type DocTreeGroup = {
  category: DocCategory
  order: number
  articles: DocArticle[]
}

const CATEGORY_ORDER: Record<DocCategory, number> = {
  Overview: 0,
  SOPs: 1,
  Reference: 2,
}

/** Recursively find all .md files under docs/, return their absolute paths. */
async function walkMarkdown(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files: string[] = []
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await walkMarkdown(full)))
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(full)
    }
  }
  return files
}

function slugFromPath(abs: string): string[] {
  const rel = path.relative(DOCS_ROOT, abs).replace(/\.md$/, '')
  return rel.split(path.sep).map((seg) => seg.replace(/^\d+-/, '')) // strip leading "01-" ordering prefix
}

async function loadArticle(abs: string): Promise<DocArticle | null> {
  const raw = await fs.readFile(abs, 'utf-8')
  const { data, content } = matter(raw)
  if (!data.title) return null
  const slug = slugFromPath(abs)
  return {
    title: String(data.title),
    summary: data.summary ? String(data.summary) : undefined,
    category: (data.category as DocCategory) ?? 'SOPs',
    order: typeof data.order === 'number' ? data.order : 999,
    slug,
    path: slug.join('/'),
    content: content.trimStart(),
  }
}

/** Load every article, grouped by category, ordered. */
export async function loadDocsTree(): Promise<DocTreeGroup[]> {
  const files = await walkMarkdown(DOCS_ROOT)
  const articles = (await Promise.all(files.map(loadArticle))).filter(
    (a): a is DocArticle => a !== null
  )
  const byCategory = new Map<DocCategory, DocArticle[]>()
  for (const a of articles) {
    const list = byCategory.get(a.category) ?? []
    list.push(a)
    byCategory.set(a.category, list)
  }
  const groups: DocTreeGroup[] = []
  for (const [category, list] of byCategory.entries()) {
    list.sort((a, b) => (a.order ?? 999) - (b.order ?? 999) || a.title.localeCompare(b.title))
    groups.push({ category, order: CATEGORY_ORDER[category] ?? 99, articles: list })
  }
  groups.sort((a, b) => a.order - b.order)
  return groups
}

/** Load a single article by its slug segments (e.g. ['sop', 'daily-triage']). */
export async function loadArticleBySlug(slug: string[]): Promise<DocArticle | null> {
  const groups = await loadDocsTree()
  const flat = groups.flatMap((g) => g.articles)
  const target = flat.find((a) => a.path === slug.join('/'))
  return target ?? null
}

/** Flat list ordered by category then order — used for Previous/Next navigation. */
export async function loadAllArticlesFlat(): Promise<DocArticle[]> {
  const groups = await loadDocsTree()
  return groups.flatMap((g) => g.articles)
}
