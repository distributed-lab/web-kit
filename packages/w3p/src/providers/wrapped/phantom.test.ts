import { PROVIDERS } from '@/enums'
import { PhantomProvider } from '@/providers'

describe('performs unit test PhantomProvider', () => {
  test('should have the correct providerType', () => {
    expect(PhantomProvider.providerType).toEqual(PROVIDERS.Phantom)
  })
})
