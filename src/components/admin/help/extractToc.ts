/**
 * Parse h2 + h3 headings from a markdown string and return a TOC tree.
 * Uses the same slug algorithm as rehype-slug (simple github-style) so the
 * anchors line up with what the renderer produces.
 */

export type TocNode = {
  id: string
  text: string
  level: 2 | 3
  children: TocNode[]
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // remove punctuation
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function extractToc(markdown: string): TocNode[] {
  const lines = markdown.split('\n')
  const flat: TocNode[] = []
  let inCodeBlock = false
  for (const line of lines) {
    // Skip headings inside fenced code blocks
    if (line.startsWith('```')) {
      inCodeBlock = !inCodeBlock
      continue
    }
    if (inCodeBlock) continue

    const m = line.match(/^(#{2,3})\s+(.+?)\s*$/)
    if (!m) continue
    const level = m[1].length === 2 ? 2 : 3
    const text = m[2].replace(/\s*\{#[^}]+\}\s*$/, '') // strip explicit {#id} if any
    const id = slugify(text)
    flat.push({ id, text, level: level as 2 | 3, children: [] })
  }
  // Nest h3s under the previous h2
  const tree: TocNode[] = []
  let currentH2: TocNode | null = null
  for (const node of flat) {
    if (node.level === 2) {
      tree.push(node)
      currentH2 = node
    } else if (currentH2) {
      currentH2.children.push(node)
    } else {
      tree.push(node) // orphan h3 (rare)
    }
  }
  return tree
}
