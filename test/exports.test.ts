import { Glob, YAML } from 'bun'
import { describe, expect, it } from 'bun:test'
import fs from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { getPackageExportsManifest } from 'vitest-package-exports'
import { workspaces } from '../package.json'

describe('exports-snapshot', async () => {
  const root = join(import.meta.dir, '..')
  /**
   * FIXME: If `bun` support command like `pnpm ls --only-projects`, we may no longer need this, see https://github.com/oven-sh/bun/issues/25114
   */
  for (const pkg of workspaces.packages) {
    const glob = new Glob(`${pkg}/package.json`)
    for await (const pkgJsonPath of glob.scan({ cwd: root, absolute: true })) {
      const pkgJson = await import(pkgJsonPath).then(m => m.default) as { name?: string, private?: boolean }
      if (!pkgJson.name || pkgJson.private)
        continue
      it(`${pkgJson.name}`, async () => {
        const manifest = await getPackageExportsManifest({
          importMode: 'src',
          cwd: dirname(pkgJsonPath),
        })
        // TODO: Workaround. Bun currently does not support file snapshot like Vitest, see https://github.com/oven-sh/bun/issues/13096
        const exports = YAML.stringify(manifest.exports, null, 2)
        const pkgPaths = pkgJson.name!.split('/')
        pkgPaths[pkgPaths.length - 1] += '.yaml'
        const output = join(root, 'test', 'exports', ...pkgPaths)
        await fs.mkdir(dirname(output), { recursive: true })
        await fs.writeFile(output, exports)
        expect(exports).toEqual(await fs.readFile(output, { encoding: 'utf-8' }))
      })
    }
  }
})
