import { describe, expect, it } from 'vitest'
import en from '@renderer/i18n/locales/en/common.json'
import fa from '@renderer/i18n/locales/fa/common.json'
import { isRtl } from '@renderer/i18n/rtl'

type Tree = { [key: string]: string | Tree }

function collectKeyPaths(tree: Tree, prefix = ''): string[] {
  return Object.entries(tree).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key
    return typeof value === 'string' ? [path] : collectKeyPaths(value, path)
  })
}

describe('i18n resources', () => {
  it('English and Persian translation files define exactly the same keys', () => {
    const enKeys = collectKeyPaths(en).sort()
    const faKeys = collectKeyPaths(fa).sort()

    const missingInFa = enKeys.filter((k) => !faKeys.includes(k))
    const missingInEn = faKeys.filter((k) => !enKeys.includes(k))

    expect(missingInFa, `Keys missing from fa/common.json: ${missingInFa.join(', ')}`).toEqual([])
    expect(missingInEn, `Keys missing from en/common.json: ${missingInEn.join(', ')}`).toEqual([])
  })

  it('no translation value is empty', () => {
    const enKeys = collectKeyPaths(en)
    for (const key of enKeys) {
      const value = key.split('.').reduce<unknown>((acc, part) => (acc as Tree)[part], en)
      expect(typeof value === 'string' && value.trim().length > 0, `Empty value for key "${key}"`).toBe(true)
    }
  })

  it('classifies RTL languages correctly', () => {
    expect(isRtl('fa')).toBe(true)
    expect(isRtl('en')).toBe(false)
  })
})
