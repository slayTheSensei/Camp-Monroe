type Props = {
  message: string
  action?: React.ReactNode
}

export default function EmptyState({ message, action }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-10 text-center">
      <p className="text-sm text-gray-400">{message}</p>
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  )
}
