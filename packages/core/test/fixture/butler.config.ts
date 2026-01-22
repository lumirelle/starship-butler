import { defineButlerConfig } from '../../src/config'

export default defineButlerConfig({
  'config-provider': {
    include: ['nushell'],
  },
}) as ReturnType<typeof defineButlerConfig>
