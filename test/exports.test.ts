import { file, Glob, write, YAML } from 'bun'
import { describe, expect, it } from 'bun:test'
import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { getPackageExportsManifest } from 'vitest-package-exports'
import { workspaces } from '../package.json'

interface PkgJson {
  name?: string
  private?: boolean
}
type PkgInfo = [pkgName: string, pkgPath: string][]

const root = join(import.meta.dir, '..')

async function collectPackages(): Promise<PkgInfo> {
  const pkgs: PkgInfo = []
  /**
   * FIXME: If `bun` support command like `pnpm ls --only-projects`, we may no longer need this, see https://github.com/oven-sh/bun/issues/25114
   */
  for (const pkgPattern of workspaces.packages) {
    const glob = new Glob(`${pkgPattern}/package.json`)
    for await (const pkgJsonPath of glob.scan({ cwd: root, absolute: true })) {
      const pkgJson = await (import(pkgJsonPath) as Promise<{ default: PkgJson }>).then(
        (m) => m.default,
      )
      if (!pkgJson.name || pkgJson.private) {
        continue
      }
      pkgs.push([pkgJson.name, dirname(pkgJsonPath)])
    }
  }
  return pkgs
}

const pkgs = await collectPackages()

describe('exports-snapshot', () => {
  it.each(pkgs)('%s', async (pkgName, pkgPath) => {
    const manifest = await getPackageExportsManifest({
      importMode: 'package',
      cwd: pkgPath,
    })
    // TODO: Workaround. Bun currently does not support file snapshot like Vitest, see https://github.com/oven-sh/bun/issues/13096
    const exports = YAML.stringify(manifest.exports, null, 2)
    const pkgNameParts = pkgName.split('/')
    pkgNameParts[pkgNameParts.length - 1] += '.yaml'
    const output = join(root, 'test', 'exports', ...pkgNameParts)
    mkdirSync(dirname(output), { recursive: true })
    await write(output, exports)
    expect(exports).toEqual(await file(output).text())
  })
})
