// @ts-check
import fs from 'node:fs'
import path from 'node:path'
import { definePrompt } from 'czg'

/* ----------------------------- Generate scopes ---------------------------- */

/**
 * @param {string} str
 * @param {number} length
 */
function formatName(str, length) {
  return str + ' '.repeat(length - str.length)
}

const packagesDir = 'packages'
const packages = fs.readdirSync(path.resolve(import.meta.dirname, packagesDir))
const maxLenPackageName = Math.max(...packages.map(pkg => pkg.length)) + 1 // +1 for `:`
const packageScopes = packages.map(pkg => ({
  value: pkg,
  name: `${formatName(`${pkg}:`, maxLenPackageName)} ${packagesDir}/${pkg}`,
}))

/* --------------------------------- Config --------------------------------- */

export default definePrompt({
  alias: {
    typo: 'docs: fix typos',
    readme: 'docs: update README.md',
    deps: 'chore: update dependencies',
  },

  scopes: packageScopes,
  scopeOverrides: {
    chore: [
      ...packageScopes,
      { value: 'deps', name: `${formatName('deps: ', maxLenPackageName)} A dependencies change` },
      { value: 'tools', name: `${formatName('tools: ', maxLenPackageName)} A tools and utilities change` },
    ],
  },

  allowBreakingChanges: ['feat', 'fix', 'chore'],
  markBreakingChangeMode: true,

  skipQuestions: ['footerPrefix', 'footer', 'confirmCommit'],
})
