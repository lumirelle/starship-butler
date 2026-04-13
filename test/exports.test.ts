import { Glob } from 'bun'
import { describe, expect, it } from 'bun:test'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { generateApiSnapshot } from 'tsnapi'
import { workspaces } from '../package.json'

interface PkgJson {
  name?: string
  private?: boolean
  exports?: Record<string, unknown>
}
type TestCase = [pkgName: string, pkgRoot: string, pkgEntry: string][]
/** Generate test cases from all entries of all packages in the workspace */
async function genTestCases(): Promise<TestCase> {
  const entries: TestCase = []
  /**
   * FIXME: If `bun` support command like `pnpm ls --only-projects`, we may no longer need this, see https://github.com/oven-sh/bun/issues/25114
   */
  for (const pkgPattern of workspaces.packages) {
    const glob = new Glob(`${pkgPattern}/package.json`)
    for await (const pkgJsonPath of glob.scan({ absolute: true })) {
      const pkgJson: PkgJson = await import(pkgJsonPath).then(m => m.default)
      const pkgName = pkgJson.name
      if (!pkgName || pkgJson.private || !pkgJson.exports)
        continue
      const pkgRoot = dirname(pkgJsonPath)
      const pkgEntries = Object.keys(pkgJson.exports).filter(key => !key.endsWith('.json'))
      for (const pkgEntry of pkgEntries) {
        entries.push([pkgName, pkgRoot, pkgEntry])
      }
    }
  }
  return entries
}

const testCases = await genTestCases()

describe.each(testCases)('exports-snapshot/%s', (pkgName, pkgRoot, pkgEntry) => {
  const isDistExists = existsSync(join(pkgRoot, 'dist'))

  it(`${pkgName} - dist should exist`, () => {
    expect(isDistExists, 'dist directory does not exist, please run `bun run build` first').toBe(true)
  })

  it.if(isDistExists)(`${pkgName}/${pkgEntry}/runtime`, () => {
    const api = generateApiSnapshot(pkgRoot)
    expect(api[pkgEntry]!.runtime).toMatchSnapshot()
  })

  it.if(isDistExists)(`${pkgName}/${pkgEntry}/dts`, () => {
    const api = generateApiSnapshot(pkgRoot)
    expect(api[pkgEntry]!.dts).toMatchSnapshot()
  })
})
