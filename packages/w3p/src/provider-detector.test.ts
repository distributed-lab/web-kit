import { PROVIDERS } from '@/enums'
import { ProviderDetector } from '@/provider-detector'
import { MetamaskProvider } from '@/providers'
import { clearWindowMock, mockWindow } from '@/tests'

describe('performs provider detector unit test', () => {
  describe('performs init', () => {
    let providerDetector: ProviderDetector

    beforeEach(() => {
      providerDetector = new ProviderDetector()
    })

    afterEach(clearWindowMock)

    test('should initialize the provider detector', async () => {
      mockWindow({ ethereum: {} })

      await providerDetector.init()

      expect(providerDetector.isInitiated).toBeTruthy()
      expect(providerDetector.isEnabled).toBeTruthy()
    })
  })
  describe('performs get and add providers', () => {
    let providerDetector: ProviderDetector

    beforeEach(() => {
      providerDetector = new ProviderDetector()
    })

    afterEach(clearWindowMock)

    test('should list empty providers', async () => {
      mockWindow({ ethereum: {} })
      expect(providerDetector.providers).toEqual({})
    })
    test('should add and return list providers', async () => {
      mockWindow({ ethereum: { providers: [MetamaskProvider] } })
      providerDetector.addProvider({ name: PROVIDERS.Metamask })
      providerDetector.addProvider({ name: PROVIDERS.Coinbase })
      expect(providerDetector.providers).toEqual({
        metamask: { name: 'metamask' },
        coinbase: { name: 'coinbase' },
      })
    })
    test('should add and return metamask provider', async () => {
      mockWindow({ ethereum: { providers: [MetamaskProvider] } })
      providerDetector.addProvider({ name: PROVIDERS.Metamask })
      expect(providerDetector.getProvider(PROVIDERS.Metamask)).toEqual({
        name: 'metamask',
      })
    })
  })
})
