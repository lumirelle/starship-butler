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
      'starship-butler',
      'config-provider',
      'utils',
      'types',
    ],
    fix: [
      'starship-butler',
      'config-provider',
      'utils',
      'types',
    ],
    refactor: [
      'starship-butler',
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
