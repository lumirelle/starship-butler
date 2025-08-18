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
    refactor: [
      'butler',
      'config-provider',
      'utils',
      'types',
    ],
    chore: [
      'deps',
      'tools',
    ],
  },
})
