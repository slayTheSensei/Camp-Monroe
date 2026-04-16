'use client'

import { useEffect, useState } from 'react'
import type { TocNode } from './extractToc'

type Props = {
  nodes: TocNode[]
}

/**
 * Sticky left-sidebar TOC. Highlights the section currently in view
 * using IntersectionObserver against the rendered heading anchors.
 */
export default function TableOfContents({ nodes }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    const headings = Array.from(document.querySelectorAll('.admin-guide h2, .admin-guide h3'))
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      {
        // Trigger when the top ~1/3 of the viewport hits the heading
        rootMargin: '-80px 0px -60% 0px',
        threshold: [0, 1],
      }
    )
    for (const h of headings) observer.observe(h)
    return () => observer.disconnect()
  }, [nodes])

  if (nodes.length === 0) return null

  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
          On this page
        </p>
        <nav>
          <ul className="space-y-1 text-sm border-l border-gray-200">
            {nodes.map((n) => (
              <TocItem key={n.id} node={n} activeId={activeId} />
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  )
}

function TocItem({ node, activeId }: { node: TocNode; activeId: string | null }) {
  const isActive = activeId === node.id
  return (
    <li>
      <a
        href={`#${node.id}`}
        className={`block pl-4 py-1 -ml-px border-l transition-colors ${
          isActive
            ? 'border-amber text-amber font-medium'
            : 'border-transparent text-gray-600 hover:text-forest hover:border-gray-300'
        }`}
      >
        {node.text}
      </a>
      {node.children.length > 0 && (
        <ul className="ml-3 space-y-1 mt-1 mb-2">
          {node.children.map((c) => {
            const childActive = activeId === c.id
            return (
              <li key={c.id}>
                <a
                  href={`#${c.id}`}
                  className={`block pl-4 py-0.5 -ml-px border-l text-xs transition-colors ${
                    childActive
                      ? 'border-amber text-amber font-medium'
                      : 'border-transparent text-gray-500 hover:text-forest hover:border-gray-300'
                  }`}
                >
                  {c.text}
                </a>
              </li>
            )
          })}
        </ul>
      )}
    </li>
  )
}
