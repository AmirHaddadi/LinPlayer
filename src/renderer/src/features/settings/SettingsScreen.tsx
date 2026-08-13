import { Folder, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSettingsStore } from '@renderer/stores/settingsStore'
import { useLibraryStore } from '@renderer/stores/libraryStore'
import { useUiStore } from '@renderer/stores/uiStore'
import { Button } from '@renderer/components/common/Button'
import { IconButton } from '@renderer/components/common/IconButton'
import { LinSwitch } from '@renderer/components/common/LinSwitch'
import { LinSelect } from '@renderer/components/common/LinSelect'
import { LinSlider } from '@renderer/components/common/LinSlider'
import type { AppLanguage, AppearanceTheme, EqualizerPresetName, ResumeBehavior } from '@shared/types/settings'
import { EQUALIZER_PRESETS } from '@renderer/features/equalizer/presets'
import { EqualizerPanel } from '@renderer/features/equalizer/EqualizerPanel'

export function SettingsScreen(): JSX.Element {
  const { t } = useTranslation()
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
    pushToast(t('toast.removedMissing', { count: removed }), 'info')
    await useLibraryStore.getState().loadItems()
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-6 space-y-6">
      <h1 className="text-xl font-semibold text-base-100">{t('settings.title')}</h1>

      <SettingsSection title={t('settings.sections.appearance')}>
        <SettingRow title={t('settings.appearance.theme')}>
          <LinSelect
            value={settings.appearance.theme}
            onChange={(value) => update('appearance', { ...settings.appearance, theme: value as AppearanceTheme })}
            label={t('settings.appearance.theme')}
            options={[
              { value: 'dark', label: t('settings.appearance.themeDark') },
              { value: 'light', label: t('settings.appearance.themeLight') },
              { value: 'system', label: t('settings.appearance.themeSystem') }
            ]}
          />
        </SettingRow>
        <SettingRow title={t('settings.appearance.language')}>
          <LinSelect
            value={settings.appearance.language}
            onChange={(value) => update('appearance', { ...settings.appearance, language: value as AppLanguage })}
            label={t('settings.appearance.language')}
            options={[
              { value: 'en', label: t('settings.appearance.languageEnglish') },
              { value: 'fa', label: t('settings.appearance.languagePersian') }
            ]}
          />
        </SettingRow>
        <SettingRow title={t('settings.appearance.reducedMotion')}>
          <LinSwitch
            label={t('settings.appearance.reducedMotion')}
            checked={settings.appearance.reducedMotion}
            onChange={(checked) => update('appearance', { ...settings.appearance, reducedMotion: checked })}
          />
        </SettingRow>
      </SettingsSection>

      <SettingsSection title={t('settings.sections.playback')}>
        <SettingRow title={t('settings.playback.rememberPosition')}>
          <LinSwitch
            label={t('settings.playback.rememberPosition')}
            checked={settings.playback.rememberPosition}
            onChange={(checked) => update('playback', { ...settings.playback, rememberPosition: checked })}
          />
        </SettingRow>
        <SettingRow title={t('settings.playback.defaultVolume')}>
          <LinSlider
            label={t('settings.playback.defaultVolume')}
            min={0}
            max={1}
            step={0.01}
            value={settings.playback.defaultVolume}
            onChange={(value) => update('playback', { ...settings.playback, defaultVolume: value })}
            className="w-32"
            formatValue={(v) => `${Math.round(v * 100)}%`}
          />
        </SettingRow>
        <SettingRow title={t('settings.playback.playbackSpeed')}>
          <LinSelect
            value={String(settings.playback.playbackSpeed)}
            onChange={(value) => update('playback', { ...settings.playback, playbackSpeed: Number(value) })}
            label={t('settings.playback.playbackSpeed')}
            options={[0.5, 0.75, 1, 1.25, 1.5, 2].map((v) => ({ value: String(v), label: `${v}x` }))}
          />
        </SettingRow>
        <SettingRow title={t('settings.playback.resumeBehavior')}>
          <LinSelect
            value={settings.playback.resumeBehavior}
            onChange={(value) =>
              update('playback', { ...settings.playback, resumeBehavior: value as ResumeBehavior })
            }
            label={t('settings.playback.resumeBehavior')}
            options={[
              { value: 'always', label: t('settings.playback.resumeAlways') },
              { value: 'ask', label: t('settings.playback.resumeAsk') },
              { value: 'never', label: t('settings.playback.resumeNever') }
            ]}
          />
        </SettingRow>
      </SettingsSection>

      <SettingsSection title={t('settings.sections.audio')}>
        <SettingRow title={t('settings.audio.equalizerEnable')}>
          <LinSwitch
            label={t('settings.audio.equalizerEnable')}
            checked={settings.audio.equalizerEnabled}
            onChange={(checked) => update('audio', { ...settings.audio, equalizerEnabled: checked })}
          />
        </SettingRow>
        <SettingRow title={t('settings.audio.preset')}>
          <LinSelect
            value={settings.audio.equalizerPreset}
            onChange={(value) =>
              update('audio', {
                ...settings.audio,
                equalizerPreset: value as EqualizerPresetName,
                equalizerGains: EQUALIZER_PRESETS[value as EqualizerPresetName] ?? settings.audio.equalizerGains
              })
            }
            label={t('settings.audio.preset')}
            options={Object.keys(EQUALIZER_PRESETS).map((key) => ({
              value: key,
              label: t(`equalizer.presets.${key}`)
            }))}
          />
        </SettingRow>
        <SettingRow title={t('settings.audio.visualizerEnable')}>
          <LinSwitch
            label={t('settings.audio.visualizerEnable')}
            checked={settings.audio.visualizerEnabled}
            onChange={(checked) => update('audio', { ...settings.audio, visualizerEnabled: checked })}
          />
        </SettingRow>
        {settings.audio.equalizerEnabled && <EqualizerPanel />}
      </SettingsSection>

      <SettingsSection title={t('settings.sections.library')}>
        <div className="space-y-1.5">
          {folders.length === 0 && <p className="text-sm text-base-500">{t('settings.library.noFolders')}</p>}
          {folders.map((folder) => (
            <div key={folder.id} className="flex min-w-0 items-center justify-between rounded-md border border-base-800 px-3 py-2">
              <div className="flex min-w-0 items-center gap-2">
                <Folder size={14} className="shrink-0 text-base-400" />
                <span className="truncate text-sm text-base-200">{folder.path}</span>
              </div>
              <IconButton label={t('actions.removeFolder')} size="sm" onClick={() => removeFolder(folder.id)}>
                <Trash2 size={14} />
              </IconButton>
            </div>
          ))}
        </div>
        <Button variant="secondary" size="sm" onClick={handleAddFolder}>
          {t('actions.addLibraryFolder')}
        </Button>
        <SettingRow title={t('settings.library.scanOnStartup')}>
          <LinSwitch
            label={t('settings.library.scanOnStartup')}
            checked={settings.library.scanOnStartup}
            onChange={(checked) => update('library', { ...settings.library, scanOnStartup: checked })}
          />
        </SettingRow>
        <SettingRow title={t('settings.library.removeMissing')}>
          <Button variant="secondary" size="sm" onClick={handleRemoveMissing}>
            {t('actions.cleanUpNow')}
          </Button>
        </SettingRow>
      </SettingsSection>

      <SettingsSection title={t('settings.sections.general')}>
        <SettingRow title={t('settings.general.startMinimized')}>
          <LinSwitch
            label={t('settings.general.startMinimized')}
            checked={settings.general.startMinimized}
            onChange={(checked) => update('general', { ...settings.general, startMinimized: checked })}
          />
        </SettingRow>
        <SettingRow title={t('settings.general.rememberWindowSize')}>
          <LinSwitch
            label={t('settings.general.rememberWindowSize')}
            checked={settings.general.rememberWindowSize}
            onChange={(checked) => update('general', { ...settings.general, rememberWindowSize: checked })}
          />
        </SettingRow>
        <SettingRow title={t('settings.general.rememberWindowPosition')}>
          <LinSwitch
            label={t('settings.general.rememberWindowPosition')}
            checked={settings.general.rememberWindowPosition}
            onChange={(checked) => update('general', { ...settings.general, rememberWindowPosition: checked })}
          />
        </SettingRow>
      </SettingsSection>
    </div>
  )
}

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }): JSX.Element {
  return (
    <section className="min-w-0 space-y-3 rounded-xl border border-base-800 bg-base-900/40 p-5">
      <h2 className="text-sm font-semibold text-base-100">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  )
}

function SettingRow({ title, children }: { title: string; children: React.ReactNode }): JSX.Element {
  return (
    <div className="flex min-w-0 flex-wrap items-center justify-between gap-x-4 gap-y-2">
      <span className="min-w-0 flex-1 text-sm text-base-300">{title}</span>
      <div className="shrink-0">{children}</div>
    </div>
  )
}
