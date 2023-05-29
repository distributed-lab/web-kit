import { CHAIN_TYPES } from '@/enums'
import { MetamaskProvider } from '@/providers'
import { mockWindow } from '@/tests'
import type { EthereumProvider } from '@/types'

import { BaseEVMProvider } from './_base-evm'

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

  test('should have a chainType property set to CHAIN_TYPES.EVM', () => {
    expect(provider.chainType).toBe(CHAIN_TYPES.EVM)
  })

  test('should have an isConnected property that returns false', () => {
    expect(provider.isConnected).toBe(false)
  })

  test('should have a chainId property that returns undefined when not set', () => {
    expect(provider.chainId).toBeUndefined()
  })

  test('should have an address property that returns undefined when not set', () => {
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
