import { defineButlerConfig } from '../../src/config'

export default defineButlerConfig({
  'config-provider': {
    preset: {
      include: ['nushell'],
    },
  },
})
