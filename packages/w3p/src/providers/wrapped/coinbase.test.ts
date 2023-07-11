import { PROVIDERS } from '@/enums'
import { CoinbaseProvider } from '@/providers'

describe('performs unit test CoinBase', () => {
  test('should have correct providerType', () => {
    expect(CoinbaseProvider.providerType).toBe(PROVIDERS.Coinbase)
  })
})
