import { hexToDecimal } from '@/helpers'

test('performs amount unit test', () => {
  expect(hexToDecimal(667)).toBe(667)
  expect(hexToDecimal('667')).toBe(1639)
  expect(hexToDecimal('667ae')).toBe(419758)
})
