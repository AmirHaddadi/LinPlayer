import { useEffect, useRef } from 'react'
import { clsx } from '@renderer/utils/clsx'

export interface ContextMenuItem {
  label: string
  onSelect: () => void
  danger?: boolean
  disabled?: boolean
}

interface ContextMenuProps {
  x: number
  y: number
  items: ContextMenuItem[]
  onClose: () => void
}

export function ContextMenu({ x, y, items, onClose }: ContextMenuProps): JSX.Element {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onClick = (event: MouseEvent): void => {
      if (ref.current && !ref.current.contains(event.target as Node)) onClose()
    }
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('mousedown', onClick)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('mousedown', onClick)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose])

  return (
    <div
      ref={ref}
      style={{ top: y, left: x }}
      className="fixed z-50 min-w-[180px] rounded-lg border border-base-700 bg-surface-raised py-1.5 shadow-panel"
      role="menu"
    >
      {items.map((item) => (
        <button
          key={item.label}
          role="menuitem"
          disabled={item.disabled}
          onClick={() => {
            item.onSelect()
            onClose()
          }}
          className={clsx(
            'flex w-full items-center px-3.5 py-2 text-left text-sm transition-colors',
            'hover:bg-base-800 disabled:opacity-40 disabled:pointer-events-none',
            item.danger ? 'text-danger' : 'text-base-200'
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}
