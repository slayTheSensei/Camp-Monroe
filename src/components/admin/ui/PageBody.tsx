type Props = {
  children: React.ReactNode
}

/**
 * Vertical rhythm container for a page. Between direct children (typically
 * <Section>s), adds a subtle divider + 40px top padding on all but the first.
 *
 * CSS via Tailwind arbitrary variants — sidesteps the space-y-* specificity
 * quirks in Tailwind v4.
 */
export default function PageBody({ children }: Props) {
  return (
    <div
      className={
        'flex flex-col ' +
        // Every direct child except the first gets a top border + breathing room
        '[&>*:not(:first-child)]:border-t [&>*:not(:first-child)]:border-gray-100 ' +
        '[&>*:not(:first-child)]:pt-10 [&>*:not(:first-child)]:mt-10'
      }
    >
      {children}
    </div>
  )
}
