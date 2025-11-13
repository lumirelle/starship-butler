// @ts-check
import { definePrompt } from 'czg'

export default definePrompt({
  alias: {
    typo: 'docs: fix typos',
    readme: 'docs: update README.md',
    deps: 'chore: update dependencies',
  },

  allowBreakingChanges: ['feat', 'fix', 'chore'],
  markBreakingChangeMode: true,

  skipQuestions: ['footerPrefix', 'footer', 'confirmCommit'],
})
