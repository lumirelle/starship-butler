// @ts-check
import { definePrompt } from 'czg'

export default definePrompt({
  markBreakingChangeMode: true,
  allowBreakingChanges: ['feat', 'fix', 'chore'],
  alias: {
    typo: 'docs: fix typos',
    readme: 'docs: update README.md',
  },
  scopeOverrides: {
    feat: [
      'core',
      'config-provider',
      'utils',
      'types',
    ],
    fix: [
      'core',
      'config-provider',
      'utils',
      'types',
    ],
    refactor: [
      'core',
      'config-provider',
      'utils',
      'types',
    ],
    chore: [
      'config-provider',
      'deps',
      'tools',
    ],
  },
})
