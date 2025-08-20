import { defineButlerConfig } from '../../src/config'

export default defineButlerConfig({
  'config-provider': {
    actions: [
      {
        name: 'Action In Config 1',
        handler: () => {
          console.log('Running action in config 1.')
        },
      },
      {
        name: 'Action In Config 2',
        handler: () => {
          console.log('Running action in config 2.')
        },
      },
    ],
    include: ['Action In Config 1'],
  },
})
