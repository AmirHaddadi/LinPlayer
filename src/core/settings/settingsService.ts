import type { SettingsRepository } from '@core/database'
import type { AppSettings } from '@shared/types/settings'

export class SettingsService {
  constructor(private readonly repository: SettingsRepository) {}

  getAll(): AppSettings {
    return this.repository.getAll()
  }

  get<K extends keyof AppSettings>(key: K): AppSettings[K] {
    return this.repository.get(key)
  }

  set<K extends keyof AppSettings>(key: K, value: AppSettings[K]): void {
    this.repository.set(key, value)
  }
}
