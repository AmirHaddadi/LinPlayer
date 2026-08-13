import { clsx } from '@renderer/utils/clsx'

interface LinSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  disabled?: boolean
}

/**
 * Custom animated switch. Uses a flex track + margin-inline-start:auto on the
 * thumb (instead of a translateX transform) so the ON position is always the
 * logical "end" of the track — this makes it correctly mirror under RTL
 * without any direction-specific code.
 */
export function LinSwitch({ checked, onChange, label, disabled }: LinSwitchProps): JSX.Element {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onChange(!checked)
        }
      }}
      className={clsx(
        'relative flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors duration-200',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        disabled && 'opacity-40 pointer-events-none',
        checked ? 'bg-accent' : 'bg-base-700 hover:bg-base-600'
      )}
    >
      <span
        className={clsx(
          'h-4 w-4 rounded-full bg-white shadow-subtle transition-[margin] duration-200 ease-premium',
          checked && 'ms-auto'
        )}
      />
    </button>
  )
}
