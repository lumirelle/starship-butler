import { describePackagesApiSnapshots } from 'tsnapi/vitest'

describePackagesApiSnapshots({
  filter: ({ packageName }) => ['docs', 'playground'].includes(packageName),
})
