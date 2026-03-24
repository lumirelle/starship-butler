import { defineButlerConfig } from '../../src/config'

export default defineButlerConfig({
  'config-provider': {
    preset: {
      include: ['nushell'],
      // @ts-expect-error Testing version override
      version: '0.0.0',
    },
  },
})
