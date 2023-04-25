import { createProvider } from '@/provider'
import { MetamaskProvider } from '@/providers'
import type { IProvider } from '@/types'

describe('performs Base evm provider unit test', () => {
  let provider: IProvider
  beforeEach(async () => {
    provider = await createProvider(MetamaskProvider)
  })
  describe('performs constructor', () => {
    test('should get chain type', async () => {
      expect(provider.chainType).toBe('1')
    })
  })
})
