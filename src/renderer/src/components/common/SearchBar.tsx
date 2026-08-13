import { Search, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchBar({ value, onChange, placeholder }: SearchBarProps): JSX.Element {
  const { t } = useTranslation()

  return (
    <div className="relative flex items-center">
      <Search size={16} className="absolute start-3 text-base-400 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? t('topbar.searchPlaceholder')}
        className="h-9 w-full rounded-lg border border-base-700 bg-base-900 ps-9 pe-8 text-sm text-base-100 placeholder:text-base-500 outline-none focus:border-accent transition-colors app-no-drag"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          aria-label={t('topbar.clearSearch')}
          className="absolute end-2.5 text-base-500 hover:text-base-200"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}
