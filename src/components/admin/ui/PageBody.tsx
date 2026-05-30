type Props = {
  children: React.ReactNode
}

/**
 * Vertical rhythm container for a page. Between direct children (typically
 * <Section>s), adds a compact 24px gap — enough to separate concepts
 * without making the page feel airy.
 */
export default function PageBody({ children }: Props) {
  return (
    <div
      className={
        'flex flex-col ' +
        // 24px between sections, no dividers — sections speak for themselves
        '[&>*:not(:first-child)]:mt-6'
      }
    >
      {children}
    </div>
  )
}
