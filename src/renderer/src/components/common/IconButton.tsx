import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { clsx } from '@renderer/utils/clsx'

type Size = 'sm' | 'md' | 'lg'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: Size
  active?: boolean
  label: string
}

const SIZE_CLASSES: Record<Size, string> = {
  sm: 'h-7 w-7',
  md: 'h-9 w-9',
  lg: 'h-11 w-11'
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ size = 'md', active, className, children, label, ...props }, ref) => {
    return (
      <button
        ref={ref}
        aria-label={label}
        title={label}
        className={clsx(
          'inline-flex items-center justify-center rounded-full transition-colors duration-150',
          'text-base-300 hover:text-base-100 hover:bg-base-800',
          'disabled:opacity-40 disabled:pointer-events-none',
          active && 'text-accent',
          SIZE_CLASSES[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

IconButton.displayName = 'IconButton'
