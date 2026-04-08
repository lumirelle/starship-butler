import { file } from 'bun'
import { join } from 'node:path'
import process from 'node:process'
import consola from 'consola'
import { recommendations as defaultRecommendations } from '../packages/config-provider/assets/editor/vscode/default/extensions.json' with { type: 'jsonc' }
import { recommendations as jsRecommendations } from '../packages/config-provider/assets/editor/vscode/js/extensions.json' with { type: 'jsonc' }
import { recommendations as zigRecommendations } from '../packages/config-provider/assets/editor/vscode/zig/extensions.json' with { type: 'jsonc' }

const update = process.argv.includes('--update')

function toValue<V, U extends unknown[]>(functionable: V | ((...args: U) => V), ...args: U): V {
  if (typeof functionable === 'function')
    return (functionable as (...args: U) => V)(...args)
  return functionable as V
}

type App = 'VSCODE' | 'CURSOR'
type ProfileNames = 'Default' | 'JavaScript' | 'Zig'
type Replacer = (match: string, app: App, p2: string, offset: number, string: string) => string
type ProfileConfig<DependentProfile, ThisProfile extends ProfileNames> = [DependentProfile] extends [never]
  ? {
      count: Record<App, number>
      source: string
      replacer: (profiles: Pick<Profiles, DependentProfile | ThisProfile>) => Replacer
    }
  : DependentProfile extends ProfileNames
    ? {
        count: Record<App, number>
        source: string
        replacer: (profiles: Pick<Profiles, DependentProfile | ThisProfile>) => Replacer
      }
    : never
interface Profiles {
  Default: ProfileConfig<never, 'Default'>
  JavaScript: ProfileConfig<'Default', 'JavaScript'>
  Zig: ProfileConfig<'Default', 'Zig'>
}
const PROFILES: Profiles = {
  Default: {
    count: {
      VSCODE: defaultRecommendations.length,
      CURSOR: defaultRecommendations.length - 1,
    },
    source: join(import.meta.dir, '../packages/config-provider/assets/editor/vscode/default/extensions.json'),
    replacer: (profiles) => {
      const countByApp = profiles.Default.count
      return (_, app) => {
        const count = app === 'VSCODE' ? countByApp[app] : `$VSCODE - 1 = ${countByApp[app]}`
        return `  // ${app}: ${count}\n`
      }
    },
  },
  JavaScript: {
    count: {
      VSCODE: jsRecommendations.length,
      CURSOR: jsRecommendations.length,
    },
    source: join(import.meta.dir, '../packages/config-provider/assets/editor/vscode/js/extensions.json'),
    replacer: (profiles) => {
      const defaultCountByApp = profiles.Default.count
      const countByApp = toValue(profiles.JavaScript.count, profiles)
      return (_, app) => (`  // ${app}: ${countByApp[app]} + $DEFAULT_${app.toUpperCase()} = ${countByApp[app] + defaultCountByApp[app]}\n`)
    },
  },
  Zig: {
    count: {
      VSCODE: zigRecommendations.length,
      CURSOR: zigRecommendations.length,
    },
    source: join(import.meta.dir, '../packages/config-provider/assets/editor/vscode/zig/extensions.json'),
    replacer: (profiles) => {
      const defaultCountByApp = profiles.Default.count
      const countByApp = toValue(profiles.Zig.count, profiles)
      return (_, app) => (`  // ${app}: ${countByApp[app]} + $DEFAULT_${app.toUpperCase()} = ${countByApp[app] + defaultCountByApp[app]}\n`)
    },
  },
}

for (const [
  name,
  { count, source, replacer },
] of (
    Object.entries(PROFILES) as [ProfileNames, ProfileConfig<any, any>][])
) {
  for (const app of ['VSCODE', 'CURSOR'] as App[]) {
    consola.info(`${name} (${app}): ${toValue(count, PROFILES)[app]} extensions`)
  }

  if (update) {
    const resolvedSource = file(source)
    const content = await resolvedSource.text()
    const updatedContent = content.replace(/ {2}\/\/ (VSCODE|CURSOR): ([^\n]+)\n/g, replacer(PROFILES))
    await resolvedSource.write(updatedContent)
  }
}
