import { CHAIN_TYPES } from '@/enums'
import { getSolExplorerAddressUrl, getSolExplorerTxUrl } from '@/helpers'

const exampleChainDevnet = {
  id: 'devnet',
  name: 'Example',
  rpcUrl: 'https://devnet.example.io/v3/',
  explorerUrl: 'https://example.io',
  token: { name: 'Example', symbol: 'ex', decimals: 18 },
  type: CHAIN_TYPES.Solana,
  icon: 'https://example.com/image.svg',
}
const exampleChainMainnet = {
  id: 'mainnet',
  name: 'Example',
  rpcUrl: 'https://mainnet.example.io/v3/',
  explorerUrl: 'https://example.io',
  token: { name: 'Example', symbol: 'ex', decimals: 18 },
  type: CHAIN_TYPES.Solana,
  icon: 'https://example.com/image.svg',
}

describe('performs solana helper unit test', () => {
  describe('performs get url', () => {
    test('getSolExplorerTxUrl should return correct value', () => {
      expect(
        getSolExplorerTxUrl(
          exampleChainDevnet,
          '3StNaySNpdoEgJM8ZM8bxgvcZxGsbYb9QAwmczsGePGxW23etvsSCNJPLjYWH68Cdzv9o3a6W5CmQD3Pk8wqCtmj',
        ),
      ).toBe(
        'https://example.io/tx/3StNaySNpdoEgJM8ZM8bxgvcZxGsbYb9QAwmczsGePGxW23etvsSCNJPLjYWH68Cdzv9o3a6W5CmQD3Pk8wqCtmj?cluster=devnet',
      )
    })
    expect(
      getSolExplorerTxUrl(
        exampleChainMainnet,
        '3StNaySNpdoEgJM8ZM8bxgvcZxGsbYb9QAwmczsGePGxW23etvsSCNJPLjYWH68Cdzv9o3a6W5CmQD3Pk8wqCtmj',
      ),
    ).toBe(
      'https://example.io/tx/3StNaySNpdoEgJM8ZM8bxgvcZxGsbYb9QAwmczsGePGxW23etvsSCNJPLjYWH68Cdzv9o3a6W5CmQD3Pk8wqCtmj',
    )
  })
  test('getSolExplorerAddressUrl should return correct value', () => {
    expect(
      getSolExplorerAddressUrl(
        exampleChainDevnet,
        'E5y776YkgGtKz45KHVD9HohYb3qXNASQUQStQrsLqhkm',
      ),
    ).toBe(
      'https://example.io/address/E5y776YkgGtKz45KHVD9HohYb3qXNASQUQStQrsLqhkm?cluster=devnet',
    )
    expect(
      getSolExplorerAddressUrl(
        exampleChainMainnet,
        'E5y776YkgGtKz45KHVD9HohYb3qXNASQUQStQrsLqhkm',
      ),
    ).toBe(
      'https://example.io/address/E5y776YkgGtKz45KHVD9HohYb3qXNASQUQStQrsLqhkm',
    )
  })
})
