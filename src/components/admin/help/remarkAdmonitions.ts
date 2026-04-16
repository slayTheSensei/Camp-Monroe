import type { Plugin } from 'unified'
import type { Root } from 'mdast'
import { visit } from 'unist-util-visit'

/**
 * Converts remark-directive's containerDirective nodes into HTML nodes with
 * a known `data-admonition` attribute so the renderer can style them.
 *
 * Syntax in markdown:
 *   :::note
 *   Content here
 *   :::
 *   :::warning Title here
 *   Content
 *   :::
 *
 * Supported types: note, tip, warning, danger.
 */

const SUPPORTED = new Set(['note', 'tip', 'warning', 'danger', 'info'])

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const remarkAdmonitions: Plugin<[], Root> = () => (tree: any) => {
  visit(tree, (node) => {
    if (node.type !== 'containerDirective') return
    if (!SUPPORTED.has(node.name)) return

    const data = node.data ?? (node.data = {})
    const firstChild = node.children?.[0] as any
    const title =
      (firstChild?.data?.directiveLabel &&
        firstChild.children?.map((c: any) => c.value ?? '').join('')) ||
      undefined

    // Strip the label child so it doesn't render as a paragraph
    if (title) node.children = node.children.slice(1)

    data.hName = 'div'
    data.hProperties = {
      'data-admonition': node.name,
      ...(title ? { 'data-admonition-title': title } : {}),
    }
  })
}

export default remarkAdmonitions
