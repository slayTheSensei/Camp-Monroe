import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'

type Props = {
  content: string
}

/**
 * Docusaurus-style rendering of the admin guide markdown.
 * Applied via the `admin-guide` class so the TOC observer can find headings.
 */
export default function MarkdownBody({ content }: Props) {
  return (
    <div className="admin-guide max-w-3xl">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold text-gray-900 mb-3 mt-0">{children}</h1>
          ),
          h2: ({ children, id }) => (
            <h2 id={id} className="scroll-mt-20 text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b border-gray-200">
              <a href={`#${id}`} className="no-underline hover:text-amber">
                {children}
              </a>
            </h2>
          ),
          h3: ({ children, id }) => (
            <h3 id={id} className="scroll-mt-20 text-xl font-semibold text-gray-900 mt-8 mb-3">
              <a href={`#${id}`} className="no-underline hover:text-amber">
                {children}
              </a>
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-base font-semibold text-gray-900 mt-6 mb-2">{children}</h4>
          ),
          p: ({ children }) => (
            <p className="text-base leading-7 text-gray-700 my-4">{children}</p>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-amber hover:text-amber/80 underline underline-offset-2"
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {children}
            </a>
          ),
          ul: ({ children }) => (
            <ul className="my-4 pl-6 list-disc space-y-2 text-gray-700 marker:text-gray-400">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-4 pl-6 list-decimal space-y-2 text-gray-700 marker:text-gray-500">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-7 pl-1">{children}</li>,
          strong: ({ children }) => (
            <strong className="font-semibold text-gray-900">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
          code: ({ className, children }) => {
            const isBlock = className?.startsWith('language-')
            if (isBlock) {
              return (
                <code className="block bg-gray-900 text-gray-100 px-4 py-3 rounded-md text-sm font-mono overflow-x-auto">
                  {children}
                </code>
              )
            }
            return (
              <code className="bg-gray-100 text-forest px-1.5 py-0.5 rounded text-sm font-mono">
                {children}
              </code>
            )
          },
          pre: ({ children }) => <pre className="my-6 not-prose">{children}</pre>,
          hr: () => <hr className="my-10 border-gray-200" />,
          blockquote: ({ children }) => (
            <blockquote className="my-6 border-l-4 border-amber/60 bg-amber/5 px-5 py-3 text-gray-700 italic">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="my-6 overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 rounded-md overflow-hidden">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-gray-50">{children}</thead>,
          th: ({ children }) => (
            <th className="px-4 py-2 text-left font-semibold text-gray-700 text-xs uppercase tracking-wider border-b border-gray-200">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2 text-gray-700 border-b border-gray-100">{children}</td>
          ),
          tr: ({ children }) => <tr className="even:bg-gray-50/30">{children}</tr>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
