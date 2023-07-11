import { PROVIDERS } from '@/enums'
import { MetamaskProvider } from '@/providers'

describe('performs unit test MetamaskProvider', () => {
  test('should have correct providerType', () => {
    expect(MetamaskProvider.providerType).toBe(PROVIDERS.Metamask)
  })
})
