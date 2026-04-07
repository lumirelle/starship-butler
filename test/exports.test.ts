import { Glob, YAML } from 'bun'
import { describe, expect, it } from 'bun:test'
import { dirname, join } from 'node:path'
import { getPackageExportsManifest } from 'vitest-package-exports'
import { workspaces } from '../package.json'

interface PkgJson {
  name?: string
  private?: boolean
}
type PkgInfo = [pkgName: string, pkgPath: string][]
async function collectPackages(): Promise<PkgInfo> {
  const pkgs: PkgInfo = []
  /**
   * FIXME: If `bun` support command like `pnpm ls --only-projects`, we may no longer need this, see https://github.com/oven-sh/bun/issues/25114
   */
  for (const pkgPattern of workspaces.packages) {
    const glob = new Glob(`${pkgPattern}/package.json`)
    for await (const pkgJsonPath of glob.scan({ cwd: join(import.meta.dir, '..'), absolute: true })) {
      const pkgJson: PkgJson = await import(pkgJsonPath).then(m => m.default)
      if (!pkgJson.name || pkgJson.private)
        continue
      pkgs.push([pkgJson.name, dirname(pkgJsonPath)])
    }
  }
  return pkgs
}
const pkgs = await collectPackages()

describe('exports-snapshot', () => {
  it.each(pkgs)('%s', async (_, pkgPath) => {
    const manifest = await getPackageExportsManifest({
      importMode: 'src',
      cwd: pkgPath,
      resolveSourcePath: (element: any) => {
        let dist = ''
        if (typeof element === 'object')
          dist = element.default || element.require || element.import || ''
        else
          dist = element
        return dist.replace('dist', 'src').replace(/\.[mc]?js$/, '')
      },
    })
    // TODO: Workaround. Bun currently does not support file snapshot like Vitest, see https://github.com/oven-sh/bun/issues/13096
    expect(YAML.stringify(manifest.exports, null, 2)).toMatchSnapshot()
  })
})
