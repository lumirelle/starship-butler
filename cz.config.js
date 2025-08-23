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
      'butler',
      'config-provider',
      'utils',
      'types',
    ],
    fix: [
      'butler',
      'config-provider',
      'utils',
      'types',
    ],
    refactor: [
      'butler',
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
