import { PublicKey } from '@solana/web3.js'

import { CHAIN_TYPES, PROVIDER_EVENTS, SOLANA_CHAINS } from '@/enums'
import { getSolExplorerAddressUrl, getSolExplorerTxUrl } from '@/helpers'
import { BaseSolanaProvider } from '@/providers'
import type {
  Chain,
  SolanaProvider,
  TransactionResponse,
  TxRequestBody,
} from '@/types'

const mockProvider: SolanaProvider = {
  publicKey: new PublicKey('HAE1oNnc3XBmPudphRcHhyCvGShtgDYtZVzx2MocKEr1'),
  connect: jest.fn(),
  on: jest.fn(),
  isConnected: null,
  signTransaction: jest.fn(),
  signAllTransactions: jest.fn(),
  signMessage: jest.fn(),
  signAndSendTransaction: jest.fn(),
  request: jest.fn(),
}

jest.mock('@/helpers', () => ({
  getSolExplorerAddressUrl: jest.fn().mockReturnValue('mockAddressUrl'),
  getSolExplorerTxUrl: jest.fn().mockReturnValue('mockTxUrl'),
  handleEthError: jest.fn(),
  handleSolError: jest.fn(),
}))

describe('performs unit test BaseSolanaProvider', () => {
  let provider: BaseSolanaProvider

  beforeEach(() => {
    provider = new BaseSolanaProvider(mockProvider)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('init', () => {
    test('should initialize the provider correctly', async () => {
      await provider.init()

      expect(mockProvider.on).toHaveBeenCalledWith(
        PROVIDER_EVENTS.Connect,
        expect.any(Function),
      )
      expect(mockProvider.on).toHaveBeenCalledWith(
        PROVIDER_EVENTS.Disconnect,
        expect.any(Function),
      )
      expect(mockProvider.on).toHaveBeenCalledWith(
        PROVIDER_EVENTS.AccountChanged,
        expect.any(Function),
      )

      expect(provider.address).toEqual(
        'HAE1oNnc3XBmPudphRcHhyCvGShtgDYtZVzx2MocKEr1',
      )
      expect(provider.chainId).toEqual(SOLANA_CHAINS.DevNet)
    })
  })

  describe('switching Chain', () => {
    test('should switch the chain correctly', async () => {
      const mockChainId = 'mockChainId'
      await provider.switchChain(mockChainId)

      expect(provider.chainId).toEqual(mockChainId)
    })
  })

  describe('connection', () => {
    test('should connect the provider correctly', async () => {
      await provider.connect()

      expect(mockProvider.connect).toHaveBeenCalled()
    })
  })

  describe('address and tx URLs', () => {
    const mockChain: Chain = {
      id: 'mockChainId',
      name: 'mockChainName',
      rpcUrl: 'mockRpcUrl',
      explorerUrl: 'mockExplorerUrl',
      icon: 'icon',
      type: CHAIN_TYPES.Solana,
      token: { name: 'name', decimals: 18, symbol: 'Mock' },
    }

    test('should return the address URL correctly', () => {
      const mockAddress = 'mockAddress'
      const mockAddressUrl = 'mockAddressUrl'

      const addressUrl = provider.getAddressUrl(mockChain, mockAddress)

      expect(getSolExplorerAddressUrl).toHaveBeenCalledWith(
        mockChain,
        mockAddress,
      )
      expect(addressUrl).toEqual(mockAddressUrl)
    })

    test('should return the transaction URL correctly', () => {
      const mockTxHash = 'mockTxHash'
      const mockTxUrl = 'mockTxUrl'

      const txUrl = provider.getTxUrl(mockChain, mockTxHash)

      expect(getSolExplorerTxUrl).toHaveBeenCalledWith(mockChain, mockTxHash)
      expect(txUrl).toEqual(mockTxUrl)
    })
  })

  describe('tx hash', () => {
    test('should return the transaction hash correctly', () => {
      const mockTxResponse: TransactionResponse = 'mockTxHash'

      const hash = provider.getHashFromTx(mockTxResponse)

      expect(hash).toEqual(mockTxResponse)
    })
  })

  describe('sign and send tx', () => {
    test('should throw a TypeError', async () => {
      await expect(provider.signAndSendTx({} as TxRequestBody)).rejects.toThrow(
        TypeError,
      )
    })
  })
})
