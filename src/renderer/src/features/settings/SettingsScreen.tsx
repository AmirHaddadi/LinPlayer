import { Folder, Trash2 } from 'lucide-react'
import { useSettingsStore } from '@renderer/stores/settingsStore'
import { useLibraryStore } from '@renderer/stores/libraryStore'
import { useUiStore } from '@renderer/stores/uiStore'
import { Button } from '@renderer/components/common/Button'
import { IconButton } from '@renderer/components/common/IconButton'

export function SettingsScreen(): JSX.Element {
  const settings = useSettingsStore((s) => s.settings)
  const update = useSettingsStore((s) => s.update)
  const folders = useLibraryStore((s) => s.folders)
  const addFolder = useLibraryStore((s) => s.addFolder)
  const removeFolder = useLibraryStore((s) => s.removeFolder)
  const pushToast = useUiStore((s) => s.pushToast)

  const handleAddFolder = async (): Promise<void> => {
    const folderPath = await window.linplayer.media.openFolderDialog()
    if (folderPath) {
      await addFolder(folderPath)
      await update('library', { ...settings.library, folders: [...settings.library.folders, folderPath] })
    }
  }

  const handleRemoveMissing = async (): Promise<void> => {
    const removed = await window.linplayer.library.removeMissing()
    pushToast(`Removed ${removed} missing file${removed === 1 ? '' : 's'} from the library.`, 'info')
    await useLibraryStore.getState().loadItems()
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-6 space-y-8">
      <h1 className="text-xl font-semibold text-base-100">Settings</h1>

      <SettingsSection title="Appearance">
        <Field label="Theme">
          <Select
            value={settings.appearance.theme}
            onChange={(value) => update('appearance', { theme: value as 'dark' | 'light' | 'system' })}
            options={[
              { value: 'dark', label: 'Dark' },
              { value: 'light', label: 'Light' },
              { value: 'system', label: 'System' }
            ]}
          />
        </Field>
      </SettingsSection>

      <SettingsSection title="Playback">
        <Toggle
          label="Remember playback position"
          checked={settings.playback.rememberPosition}
          onChange={(checked) => update('playback', { ...settings.playback, rememberPosition: checked })}
        />
        <Field label="Default volume">
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={settings.playback.defaultVolume}
            onChange={(e) => update('playback', { ...settings.playback, defaultVolume: Number(e.target.value) })}
            className="w-40 accent-accent"
          />
        </Field>
        <Field label="Playback speed">
          <Select
            value={String(settings.playback.playbackSpeed)}
            onChange={(value) => update('playback', { ...settings.playback, playbackSpeed: Number(value) })}
            options={[0.5, 0.75, 1, 1.25, 1.5, 2].map((v) => ({ value: String(v), label: `${v}x` }))}
          />
        </Field>
        <Field label="Resume behavior">
          <Select
            value={settings.playback.resumeBehavior}
            onChange={(value) =>
              update('playback', { ...settings.playback, resumeBehavior: value as 'always' | 'ask' | 'never' })
            }
            options={[
              { value: 'always', label: 'Always resume' },
              { value: 'ask', label: 'Ask each time' },
              { value: 'never', label: 'Never resume' }
            ]}
          />
        </Field>
      </SettingsSection>

      <SettingsSection title="Library">
        <div className="space-y-1.5">
          {folders.length === 0 && <p className="text-sm text-base-500">No folders added yet.</p>}
          {folders.map((folder) => (
            <div key={folder.id} className="flex items-center justify-between rounded-md border border-base-800 px-3 py-2">
              <div className="flex min-w-0 items-center gap-2">
                <Folder size={14} className="shrink-0 text-base-400" />
                <span className="truncate text-sm text-base-200">{folder.path}</span>
              </div>
              <IconButton label="Remove folder" size="sm" onClick={() => removeFolder(folder.id)}>
                <Trash2 size={14} />
              </IconButton>
            </div>
          ))}
        </div>
        <Button variant="secondary" size="sm" onClick={handleAddFolder}>
          Add library folder
        </Button>
        <Toggle
          label="Automatically scan on startup"
          checked={settings.library.scanOnStartup}
          onChange={(checked) => update('library', { ...settings.library, scanOnStartup: checked })}
        />
        <div className="flex items-center justify-between">
          <p className="text-sm text-base-300">Remove missing files from library</p>
          <Button variant="secondary" size="sm" onClick={handleRemoveMissing}>
            Clean up now
          </Button>
        </div>
      </SettingsSection>

      <SettingsSection title="General">
        <Toggle
          label="Start minimized"
          checked={settings.general.startMinimized}
          onChange={(checked) => update('general', { ...settings.general, startMinimized: checked })}
        />
        <Toggle
          label="Remember window size"
          checked={settings.general.rememberWindowSize}
          onChange={(checked) => update('general', { ...settings.general, rememberWindowSize: checked })}
        />
        <Toggle
          label="Remember window position"
          checked={settings.general.rememberWindowPosition}
          onChange={(checked) => update('general', { ...settings.general, rememberWindowPosition: checked })}
        />
      </SettingsSection>
    </div>
  )
}

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }): JSX.Element {
  return (
    <section className="space-y-3 rounded-xl border border-base-800 bg-base-900/40 p-5">
      <h2 className="text-sm font-semibold text-base-100">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }): JSX.Element {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-base-300">{label}</span>
      {children}
    </div>
  )
}

function Toggle({
  label,
  checked,
  onChange
}: {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}): JSX.Element {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-base-300">{label}</span>
      <button
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative h-5 w-9 rounded-full transition-colors ${checked ? 'bg-accent' : 'bg-base-700'}`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-4' : 'translate-x-0.5'}`}
        />
      </button>
    </div>
  )
}

function Select({
  value,
  onChange,
  options
}: {
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
}): JSX.Element {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 rounded-md border border-base-700 bg-base-900 px-2.5 text-sm text-base-100 outline-none focus:border-accent"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
