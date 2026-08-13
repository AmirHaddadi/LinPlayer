import { Loader2 } from 'lucide-react'

export function LoadingState({ label = 'Loading…' }: { label?: string }): JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-base-400">
      <Loader2 className="animate-spin" size={24} />
      <span className="text-sm">{label}</span>
    </div>
  )
}
