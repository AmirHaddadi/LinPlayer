import { Search, X } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchBar({ value, onChange, placeholder = 'Search your library…' }: SearchBarProps): JSX.Element {
  return (
    <div className="relative flex items-center">
      <Search size={16} className="absolute left-3 text-base-400 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-9 w-full rounded-lg border border-base-700 bg-base-900 pl-9 pr-8 text-sm text-base-100 placeholder:text-base-500 outline-none focus:border-accent transition-colors app-no-drag"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute right-2.5 text-base-500 hover:text-base-200"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}
