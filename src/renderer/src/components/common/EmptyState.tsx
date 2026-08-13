import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps): JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24 px-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-base-800 text-base-400 mb-5">
        <Icon size={28} strokeWidth={1.5} />
      </div>
      <h3 className="text-base font-semibold text-base-100">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm text-base-400">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
