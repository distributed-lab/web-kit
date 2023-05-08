import { setupWalletSelector, WalletSelector } from '@near-wallet-selector/core'

import { NEAR_CHAINS } from '@/enums'
import { NearRawProvider } from '@/providers'

jest.mock('@near-wallet-selector/core', () => ({
  setupWalletSelector: jest.fn(() => ({
    isSignedIn: jest.fn().mockReturnValue(false),
    store: {
      getState: jest.fn().mockReturnValue({
        accounts: [{ accountId: 'test_account' }],
      }),
    },
    wallet: jest.fn().mockReturnValue({
      signIn: jest.fn(),
      signOut: jest.fn(),
      signAndSendTransactions: jest.fn(),
    }),
  })),
  setupMyNearWallet: jest.fn(),
}))
let mockWallet: {
  signIn: jest.Mock
  signOut: jest.Mock
  signAndSendTransactions: jest.Mock
}
describe('performs NearRawProvider unit testing', () => {
  let provider: NearRawProvider
  beforeEach(() => {
    provider = new NearRawProvider({ createAccessKeyFor: 'test' })
    mockWallet = {
      signIn: jest.fn(),
      signOut: jest.fn(),
      signAndSendTransactions: jest.fn(),
    }
  })
  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('performs init', () => {
    test('should setup wallet selector and check isSignedIn', async () => {
      const mockSelector = {
        isSignedIn: jest.fn().mockReturnValue(true),
        wallet: jest.fn().mockResolvedValue(mockWallet),
        store: {
          getState: jest.fn().mockReturnValue({
            accounts: [{ accountId: 'test' }],
          }),
        },
      }
      ;(
        setupWalletSelector as jest.MockedFunction<typeof setupWalletSelector>
      ).mockResolvedValue(mockSelector as unknown as WalletSelector)
      const result = await provider.init()

      expect(result).toBe(true)
      expect(setupWalletSelector).toHaveBeenCalledWith({
        network: NEAR_CHAINS.TestNet,
        modules: expect.any(Array<Array<Promise<WalletSelector>>>),
      })
      expect(mockSelector.isSignedIn).toHaveBeenCalled()
      expect(mockSelector.wallet).toHaveBeenCalled()
      expect(provider.selector).toEqual(mockSelector)
      expect(provider.wallet).toEqual(mockWallet)
      expect(provider.accountId).toBe('test')
    })
  })

  describe('performs signIn', () => {
    test('should signIn to MyNearWallet with the expected arguments', async () => {
      const mockSelector = {
        isSignedIn: jest.fn().mockReturnValue(false),
        wallet: jest.fn().mockResolvedValue(mockWallet),
        store: {
          getState: jest.fn().mockReturnValue({
            accounts: [{ accountId: '' }],
          }),
        },
      }
      ;(
        setupWalletSelector as jest.MockedFunction<typeof setupWalletSelector>
      ).mockResolvedValue(mockSelector as unknown as WalletSelector)
      await provider.init()
      await provider.signIn()

      expect(setupWalletSelector).toHaveBeenCalledWith({
        network: 'testnet',
        modules: expect.any(Array<Array<Promise<WalletSelector>>>),
      })

      expect(provider.wallet?.signIn).toHaveBeenCalledWith({
        contractId: 'test',
        methodNames: [],
        accounts: [],
      })
    })
  })
  describe('performs signOut', () => {
    test('should signOut', async () => {
      const mockSelector = {
        isSignedIn: jest.fn().mockReturnValue(true),
        wallet: jest.fn().mockResolvedValue(mockWallet),
        store: {
          getState: jest.fn().mockReturnValue({
            accounts: [{ accountId: '' }],
          }),
        },
      }
      ;(
        setupWalletSelector as jest.MockedFunction<typeof setupWalletSelector>
      ).mockResolvedValue(mockSelector as unknown as WalletSelector)
      await provider.init()
      await provider.signIn()

      expect(setupWalletSelector).toHaveBeenCalledWith({
        network: 'testnet',
        modules: expect.any(Array<Array<Promise<WalletSelector>>>),
      })

      expect(provider.wallet).toBeTruthy()
      await provider.signOut()

      expect(provider.wallet).not.toBeTruthy()
      expect(provider.accountId).toBe('')
    })
  })
})
