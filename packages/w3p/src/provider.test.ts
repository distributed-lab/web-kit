import { PROVIDERS } from '@/enums'
import { MetamaskProvider } from '@/providers'
import { mockWindow } from '@/tests'
import type { ProviderInstance } from '@/types'

import { Provider } from './Provider'

describe('performs provider unit test', () => {
  mockWindow({
    ethereum: {
      once: jest.fn(),
      on: jest.fn(),
      off: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
      removeAllListeners: jest.fn(),
      providers: [MetamaskProvider],
      selectedAddress: 'testAddress',
      request: jest.fn(),
    },
  })
  const providerInstance: ProviderInstance = {
    name: PROVIDERS.Metamask,
    instance: window.ethereum,
  }
  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('performs provider init', () => {
    test('should throw an error if no provider instance is injected', async () => {
      const provider = new Provider(MetamaskProvider)
      await expect(
        provider.init({ name: PROVIDERS.Metamask }),
      ).rejects.toThrow()
    })

    test('should initialize the proxy and set the selected provider', async () => {
      const mockInit = jest.fn()
      jest
        .spyOn(MetamaskProvider.prototype, 'init')
        .mockImplementation(mockInit)
      const provider = new Provider(MetamaskProvider)
      await provider.init(providerInstance)
      expect(provider.providerType).toBe(PROVIDERS.Metamask)
      expect(provider.isConnected).toBe(false)
    })
  })
  describe('performs connect', () => {
    test('should throw an error if the proxy is not initialized', async () => {
      const provider = new Provider(MetamaskProvider)
      await expect(provider.connect()).rejects.toThrow()
    })

    test('should connect the proxy', async () => {
      const mockConnectFn = jest.fn()
      const mockInit = jest.fn()
      jest
        .spyOn(MetamaskProvider.prototype, 'init')
        .mockImplementation(mockInit)
      const provider = new Provider(MetamaskProvider)
      await provider.init(providerInstance)
      jest.spyOn(provider, 'connect').mockImplementation(mockConnectFn)
      await provider.connect()
      expect(mockConnectFn).toHaveBeenCalled()
    })
  })

  describe('performs switchChain', () => {
    test('should switch the chain', async () => {
      const switchChainFn = jest.fn()
      const mockInit = jest.fn()
      jest
        .spyOn(MetamaskProvider.prototype, 'init')
        .mockImplementation(mockInit)
      const provider = new Provider(MetamaskProvider)
      await provider.init(providerInstance)
      jest.spyOn(provider, 'switchChain').mockImplementation(switchChainFn)
      await provider.switchChain('1')
      expect(switchChainFn).toHaveBeenCalledWith('1')
    })
  })
  describe('performs sign and sent tx', () => {
    test('should throw an error if the proxy is not initialized', async () => {
      const provider = new Provider(MetamaskProvider)
      await expect(provider.signAndSendTx('0x1test')).rejects.toThrow()
    })

    test('should sign and sent tx', async () => {
      const mockSignAndSentTxFn = jest.fn()
      const mockInit = jest.fn()
      jest
        .spyOn(MetamaskProvider.prototype, 'init')
        .mockImplementation(mockInit)
      const provider = new Provider(MetamaskProvider)
      await provider.init(providerInstance)
      jest
        .spyOn(provider, 'signAndSendTx')
        .mockImplementation(mockSignAndSentTxFn)
      await provider.signAndSendTx('0x1test')
      expect(mockSignAndSentTxFn).toHaveBeenCalled()
    })
  })
})
