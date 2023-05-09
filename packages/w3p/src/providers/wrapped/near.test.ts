import { CHAIN_TYPES, PROVIDERS } from '@/enums'
import { getNearExplorerAddressUrl, getNearExplorerTxUrl } from '@/helpers'
import { NearProvider } from '@/providers'
import type { TransactionResponse } from '@/types'

const mockProvider = {
  signIn: jest.fn(),
  signOut: jest.fn(),
  init: jest.fn(),
  signAndSendTxs: jest.fn(),
  emit: jest.fn(),
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const nearProvider = new NearProvider(mockProvider as any)

describe('performs unit test NearProvider', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should return Near provider type', () => {
    expect(NearProvider.providerType).toBe(PROVIDERS.Near)
  })

  test('should initialize provider', async () => {
    await nearProvider.init()
    expect(mockProvider.init).toHaveBeenCalled()
    expect(nearProvider.chainId).toBeDefined()
    expect(nearProvider.address).toBeDefined()
  })

  test('should switch chain', async () => {
    const newChainId = 'test'
    await nearProvider.switchChain(newChainId)
    expect(nearProvider.chainId).toBe(newChainId)
  })

  test('should sign in to the provider', async () => {
    await nearProvider.connect()
    expect(mockProvider.signIn).toHaveBeenCalled()
  })

  test('should sign out from the provider', async () => {
    await nearProvider.disconnect()
    expect(mockProvider.signOut).toHaveBeenCalled()
    expect(nearProvider.isConnected).toBe(false)
  })

  test('should get transaction hash from response', () => {
    const txResponse = [
      { transaction: { hash: '0x1' } },
      { transaction: { hash: '0x2' } },
    ] as TransactionResponse
    const hash = nearProvider.getHashFromTxResponse(txResponse)
    expect(hash).toBe('0x1,0x2')
  })

  test('should get transaction URL', () => {
    const chain = {
      id: 'test',
      name: 'name',
      rpcUrl: 'test.io',
      explorerUrl: 'test.io',
      token: {
        name: 'tokenName',
        symbol: 'testSymbol',
        decimals: 6,
      },
      type: CHAIN_TYPES.Near,
      icon: 'icon',
    }
    const txHash = '0x1'
    const url = nearProvider.getTxUrl(chain, txHash)
    expect(url).toBe(getNearExplorerTxUrl(chain, txHash))
  })

  test('should get address URL', () => {
    const chain = {
      id: 'test',
      name: 'name',
      rpcUrl: 'test.io',
      explorerUrl: 'test.io',
      token: {
        name: 'tokenName',
        symbol: 'testSymbol',
        decimals: 6,
      },
      type: CHAIN_TYPES.Near,
      icon: 'icon',
    }
    const address = '0x1'
    const url = nearProvider.getAddressUrl(chain, address)
    expect(url).toBe(getNearExplorerAddressUrl(chain, address))
  })
})
