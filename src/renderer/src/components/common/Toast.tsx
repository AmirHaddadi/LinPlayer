import { useEffect } from 'react'
import { CheckCircle2, Info, XCircle } from 'lucide-react'
import { useUiStore } from '@renderer/stores/uiStore'
import { clsx } from '@renderer/utils/clsx'

const ICONS = { info: Info, success: CheckCircle2, error: XCircle }
const COLORS = {
  info: 'text-accent',
  success: 'text-success',
  error: 'text-danger'
}

export function ToastContainer(): JSX.Element {
  const toasts = useUiStore((s) => s.toasts)
  const dismissToast = useUiStore((s) => s.dismissToast)

  return (
    <div className="fixed bottom-24 right-6 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} id={toast.id} message={toast.message} variant={toast.variant} onDismiss={dismissToast} />
      ))}
    </div>
  )
}

function ToastItem({
  id,
  message,
  variant,
  onDismiss
}: {
  id: string
  message: string
  variant: 'info' | 'success' | 'error'
  onDismiss: (id: string) => void
}): JSX.Element {
  const Icon = ICONS[variant]

  useEffect(() => {
    const timer = setTimeout(() => onDismiss(id), 4000)
    return () => clearTimeout(timer)
  }, [id, onDismiss])

  return (
    <div
      className={clsx(
        'flex items-center gap-2.5 rounded-lg border border-base-700 bg-surface-raised px-4 py-3 shadow-panel'
      )}
      role="status"
    >
      <Icon size={16} className={COLORS[variant]} />
      <span className="text-sm text-base-100">{message}</span>
    </div>
  )
}
