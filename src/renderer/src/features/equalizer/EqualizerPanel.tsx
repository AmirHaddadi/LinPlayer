import { useTranslation } from 'react-i18next'
import { LinSlider } from '@renderer/components/common/LinSlider'
import { Button } from '@renderer/components/common/Button'
import { useSettingsStore } from '@renderer/stores/settingsStore'
import { EQUALIZER_BAND_FREQUENCIES } from '@shared/types/settings'
import { EQUALIZER_PRESETS } from './presets'

const GAIN_MIN = -12
const GAIN_MAX = 12

function formatFrequencyLabel(hz: number): string {
  return hz >= 1000 ? `${hz / 1000}k` : String(hz)
}

export function EqualizerPanel(): JSX.Element {
  const { t } = useTranslation()
  const settings = useSettingsStore((s) => s.settings)
  const update = useSettingsStore((s) => s.update)
  const gains = settings.audio.equalizerGains

  const setBandGain = (index: number, value: number): void => {
    const nextGains = [...gains]
    nextGains[index] = value
    update('audio', { ...settings.audio, equalizerGains: nextGains, equalizerPreset: 'custom' })
  }

  const handleReset = (): void => {
    update('audio', { ...settings.audio, equalizerGains: EQUALIZER_PRESETS.flat, equalizerPreset: 'flat' })
  }

  return (
    <div dir="ltr" className="rounded-lg border border-base-800 bg-base-900/60 p-4">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs font-medium text-base-300">{t('equalizer.title')}</p>
        <Button variant="ghost" size="sm" onClick={handleReset}>
          {t('actions.reset')}
        </Button>
      </div>
      <div className="flex h-40 items-end justify-between gap-3">
        {EQUALIZER_BAND_FREQUENCIES.map((frequency, index) => (
          <div key={frequency} className="flex h-full flex-col items-center gap-2">
            <span className="text-[10px] tabular-nums text-base-500">{(gains[index] ?? 0).toFixed(0)}</span>
            <LinSlider
              label={`${formatFrequencyLabel(frequency)} Hz`}
              orientation="vertical"
              min={GAIN_MIN}
              max={GAIN_MAX}
              step={1}
              value={gains[index] ?? 0}
              onChange={(value) => setBandGain(index, value)}
              formatValue={(v) => `${v > 0 ? '+' : ''}${v} dB`}
              className="w-1.5 flex-1"
              disabled={!settings.audio.equalizerEnabled}
            />
            <span className="text-[10px] text-base-500">{formatFrequencyLabel(frequency)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
