import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { clsx } from '@renderer/utils/clsx'

export interface LinSelectOption {
  value: string
  label: string
}

interface LinSelectProps {
  value: string
  onChange: (value: string) => void
  options: LinSelectOption[]
  label?: string
  disabled?: boolean
  className?: string
}

export function LinSelect({ value, onChange, options, label, disabled, className }: LinSelectProps): JSX.Element {
  const [open, setOpen] = useState(false)
  const [openUpward, setOpenUpward] = useState(false)
  const [highlighted, setHighlighted] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const selectedIndex = Math.max(
    0,
    options.findIndex((o) => o.value === value)
  )
  const selected = options[selectedIndex]

  useEffect(() => {
    if (!open) return

    const rect = rootRef.current?.getBoundingClientRect()
    if (rect) {
      const spaceBelow = window.innerHeight - rect.bottom
      const estimatedHeight = Math.min(options.length * 36 + 8, 280)
      setOpenUpward(spaceBelow < estimatedHeight && rect.top > estimatedHeight)
    }
    setHighlighted(selectedIndex)

    const onPointerDown = (event: PointerEvent): void => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false)
    }
    window.addEventListener('pointerdown', onPointerDown)
    return () => window.removeEventListener('pointerdown', onPointerDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    if (open) {
      listRef.current?.children[highlighted]?.scrollIntoView({ block: 'nearest' })
    }
  }, [open, highlighted])

  const commit = (index: number): void => {
    const option = options[index]
    if (!option) return
    onChange(option.value)
    setOpen(false)
  }

  const handleKeyDown = (event: React.KeyboardEvent): void => {
    if (disabled) return

    if (!open) {
      if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(event.key)) {
        event.preventDefault()
        setOpen(true)
      }
      return
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        setHighlighted((i) => Math.min(options.length - 1, i + 1))
        break
      case 'ArrowUp':
        event.preventDefault()
        setHighlighted((i) => Math.max(0, i - 1))
        break
      case 'Home':
        event.preventDefault()
        setHighlighted(0)
        break
      case 'End':
        event.preventDefault()
        setHighlighted(options.length - 1)
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        commit(highlighted)
        break
      case 'Escape':
        event.preventDefault()
        setOpen(false)
        break
    }
  }

  return (
    <div ref={rootRef} className={clsx('relative', className)}>
      <button
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={handleKeyDown}
        className={clsx(
          'flex h-9 min-w-[8rem] items-center justify-between gap-2 rounded-md border border-base-700 bg-base-900 px-2.5 text-sm text-base-100 outline-none transition-colors',
          'hover:border-base-600 focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/30',
          disabled && 'opacity-40 pointer-events-none'
        )}
      >
        <span className="truncate">{selected?.label ?? ''}</span>
        <ChevronDown size={14} className={clsx('shrink-0 text-base-400 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <ul
          ref={listRef}
          role="listbox"
          aria-label={label}
          className={clsx(
            'absolute z-50 max-h-64 min-w-full overflow-y-auto rounded-lg border border-base-700 bg-surface-raised py-1 shadow-panel animate-scale-in',
            openUpward ? 'bottom-full mb-1.5 origin-bottom' : 'top-full mt-1.5 origin-top'
          )}
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              onMouseEnter={() => setHighlighted(index)}
              onClick={() => commit(index)}
              className={clsx(
                'flex cursor-pointer items-center justify-between gap-2 px-3 py-1.5 text-sm transition-colors',
                index === highlighted ? 'bg-base-800 text-base-100' : 'text-base-200',
                option.value === value && 'text-accent'
              )}
            >
              <span className="truncate">{option.label}</span>
              {option.value === value && <Check size={14} className="shrink-0" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
