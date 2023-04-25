import { hexToDecimal } from '@/helpers'

describe('performs amount unit test', () => {
  test('hexToDecimal should return correct value', () => {
    expect(hexToDecimal(667)).toBe(667)
    expect(hexToDecimal('667')).toBe(1639)
    expect(hexToDecimal('667ae')).toBe(419758)
  })
})
