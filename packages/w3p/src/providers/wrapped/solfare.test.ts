import { PROVIDERS } from '@/enums'
import { SolflareProvider } from '@/providers'

describe('performs unit test SolflareProvider', () => {
  test('should have the correct providerType', () => {
    expect(SolflareProvider.providerType).toEqual(PROVIDERS.Solflare)
  })
})
