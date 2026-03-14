// oxlint-disable no-console
/* eslint-disable antfu/no-top-level-await */
import { loadConfig } from 'starship-butler'

console.log('Hello playground!', await loadConfig())
