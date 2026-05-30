type Props = {
  children: React.ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const paddingClass = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-5',
}

/**
 * Generic white card container. Use for lists, form groups, chart wrappers, etc.
 */
export default function Card({ children, className, padding = 'md' }: Props) {
  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg ${paddingClass[padding]}${
        className ? ' ' + className : ''
      }`}
    >
      {children}
    </div>
  )
}
