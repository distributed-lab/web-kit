import {
  getNearExplorerAddressUrl,
  getNearExplorerTxUrl,
  nearToYocto,
  yoctoToNear,
} from '@/helpers'

const exampleExplorerUrl = 'https://example.io'

describe('performs near helper unit test', () => {
  describe('performs get url', () => {
    test('getNearExplorerTxUrl should return correct value', () => {
      expect(
        getNearExplorerTxUrl(
          exampleExplorerUrl,
          'EL9cEcoiF1ThH1HXrdE5LBuJKzSe6dRr7tia61fohPrP',
        ),
      ).toBe(
        'https://example.io/transactions/EL9cEcoiF1ThH1HXrdE5LBuJKzSe6dRr7tia61fohPrP',
      )
    })
    test('getNearExplorerAddressUrl should return correct value', () => {
      expect(
        getNearExplorerAddressUrl(exampleExplorerUrl, 'example.address'),
      ).toBe('https://example.io/accounts/example.address')
    })
  })
  describe('performs convert near and yocto', () => {
    test('nearToYocto should return correct value', () => {
      expect(nearToYocto('1')).toBe('1000000000000000000000000')
      expect(nearToYocto('0.123')).toBe('123000000000000000000000')
      expect(nearToYocto('999')).toBe('999000000000000000000000000')
    })
    test('yoctoToNear should return correct value', () => {
      expect(yoctoToNear('1')).toBe('0.000000000000000000000001')
      expect(yoctoToNear('999000000000000000000000000')).toBe('999')
      expect(yoctoToNear('1000000000000000000000000')).toBe('1')
    })
  })
})
