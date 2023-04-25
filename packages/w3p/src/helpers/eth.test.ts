import { CHAIN_TYPES } from '@/enums'
import { getEthExplorerAddressUrl, getEthExplorerTxUrl } from '@/helpers'

const exampleChain = {
  id: 1,
  name: 'Example',
  rpcUrl: 'https://mainnet.example.io/v3/',
  explorerUrl: 'https://example.io',
  token: { name: 'Example', symbol: 'ex', decimals: 18 },
  type: CHAIN_TYPES.EVM,
  icon: 'https://example.com/image.svg',
}

describe('performs eth helper unit test', () => {
  describe('performs get url', () => {
    test('getEthExplorerTxUrl should return correct value', () => {
      expect(
        getEthExplorerTxUrl(
          exampleChain,
          '0x2446f1fd773fbb9f080e674b60c6a033c7ed7427b8b9413cf28a2a4a6da9b56c',
        ),
      ).toBe(
        'https://example.io/tx/0x2446f1fd773fbb9f080e674b60c6a033c7ed7427b8b9413cf28a2a4a6da9b56c',
      )
    })
    test('getEthExplorerAddressUrl should return correct value', () => {
      expect(
        getEthExplorerAddressUrl(
          exampleChain,
          '0xFeebabE6b0418eC13b30aAdF129F5DcDd4f70CeA',
        ),
      ).toBe(
        'https://example.io/address/0xFeebabE6b0418eC13b30aAdF129F5DcDd4f70CeA',
      )
    })
  })
})
