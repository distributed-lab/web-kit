import { PROVIDERS } from '@/enums'
import { ProviderDetector } from '@/provider-detector'
import { MetamaskProvider } from '@/providers'
import { clearWindowMock, mockWindow } from '@/tests'

describe('performs provider detector unit test', () => {
  describe('performs init', () => {
    let providerDetector: ProviderDetector<keyof Record<string, string>>

    beforeEach(() => {
      providerDetector = new ProviderDetector()
      mockWindow({ ethereum: {} })
    })

    afterEach(clearWindowMock)

    test('should initialize the provider detector', async () => {
      await providerDetector.init()

      expect(providerDetector.isInitiated).toBeTruthy()
      expect(providerDetector.isEnabled).toBeTruthy()
    })
  })

  describe('performs get, add, and remove providers', () => {
    let providerDetector: ProviderDetector<keyof Record<string, string>>

    beforeEach(() => {
      providerDetector = new ProviderDetector()
    })

    afterEach(clearWindowMock)

    test('should list empty providers', async () => {
      expect(providerDetector.providers).toEqual({})
    })
    test('should add and return list providers', async () => {
      mockWindow({ ethereum: { providers: [MetamaskProvider] } })
      providerDetector.addProvider({ name: PROVIDERS.Metamask })
      providerDetector.addProvider({ name: PROVIDERS.Coinbase })
      expect(providerDetector.providers).toEqual({
        metamask: { name: PROVIDERS.Metamask },
        coinbase: { name: PROVIDERS.Coinbase },
      })
    })
    test('should add and return metamask provider', async () => {
      mockWindow({ ethereum: { providers: [MetamaskProvider] } })
      providerDetector.addProvider({ name: PROVIDERS.Metamask })
      expect(providerDetector.getProvider(PROVIDERS.Metamask)).toEqual({
        name: PROVIDERS.Metamask,
      })
    })

    test('should remove a provider', async () => {
      mockWindow({ ethereum: { providers: [MetamaskProvider] } })
      providerDetector.addProvider({ name: PROVIDERS.Metamask })
      providerDetector.addProvider({ name: PROVIDERS.Coinbase })

      expect(providerDetector.providers).toEqual({
        metamask: { name: PROVIDERS.Metamask },
        coinbase: { name: PROVIDERS.Coinbase },
      })

      providerDetector.removeProvider({ name: PROVIDERS.Metamask })

      expect(providerDetector.providers).toEqual({
        coinbase: { name: PROVIDERS.Coinbase },
      })
    })
  })
})
