import { ProviderDetector } from '@/provider-detector'

describe('performs provider detector unit test', () => {
  describe('performs init', () => {
    let providerDetector: ProviderDetector

    beforeEach(() => {
      providerDetector = new ProviderDetector()
    })

    test('should initialize the provider detector', async () => {
      const spyDetectRawProviders = jest.spyOn(
        providerDetector,
        '#detectRawProviders',
      )
      const spyDefineProviders = jest.spyOn(
        providerDetector,
        '#defineProviders',
      )

      await providerDetector.init()

      expect(spyDetectRawProviders).toHaveBeenCalledTimes(1)
      expect(spyDefineProviders).toHaveBeenCalledTimes(1)
      expect(providerDetector.isInitiated).toBe(true)
    })
  })
})
