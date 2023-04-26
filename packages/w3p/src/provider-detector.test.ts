import { ProviderDetector } from '@/provider-detector'
// import { CoinbaseProvider, MetamaskProvider } from '@/providers'
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
})
