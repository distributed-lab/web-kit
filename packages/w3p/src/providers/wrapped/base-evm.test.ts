import { CHAIN_TYPES } from '@/enums'
import { MetamaskProvider } from '@/providers'
import { BaseEVMProvider } from '@/providers'
import { mockWindow } from '@/tests'
import type { EthereumProvider } from '@/types'

describe('performs unit test BaseEVMProvider', () => {
  let provider: BaseEVMProvider
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
      listAccounts: jest.fn().mockResolvedValue(['01x']),
      getNetwork: jest.fn().mockResolvedValue(['test']),
    },
  })
  beforeEach(() => {
    provider = new BaseEVMProvider(window.ethereum as EthereumProvider)
  })

  test('should return the properties of an uninitialized provider', () => {
    expect(provider.chainType).toBe(CHAIN_TYPES.EVM)
    expect(provider.isConnected).toBe(false)
    expect(provider.chainId).toBeUndefined()
    expect(provider.address).toBeUndefined()
  })

  describe('signAndSendTx', () => {
    test('should been called with argument', async () => {
      const txBody = { to: '0x123', value: 100 }
      const mockSignAndSendTx = jest.fn()
      jest
        .spyOn(provider, 'signAndSendTx')
        .mockImplementation(mockSignAndSendTx)
      await provider.signAndSendTx(txBody)

      expect(mockSignAndSendTx).toHaveBeenCalledWith(txBody)
    })
  })
})
