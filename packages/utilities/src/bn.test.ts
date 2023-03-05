import { BN } from './bn'

describe('performs BN unit test', () => {
  describe('performs constructor', () => {
    test('formRaw should return correct value', () => {
      expect(BN.fromRaw(1, 1).valueOf()).toBe('10')
      expect(BN.fromRaw(1, 2).valueOf()).toBe('100')
      expect(BN.fromRaw(1, 3).valueOf()).toBe('1000')
      expect(BN.fromRaw(1, 18).valueOf()).toBe('1000000000000000000')
      expect(BN.fromRaw(0.1, 6).valueOf()).toBe('100000')
      expect(BN.fromRaw(0.123, 6).valueOf()).toBe('123000')
    })

    test('fromFraction should return correct value', () => {
      expect(
        BN.fromFraction('1000000000000000000', 18).fromFraction(18).valueOf(),
      ).toBe('1')
    })
  })

  describe('performs math operations', () => {
    test('multiply should return correct value', () => {
      expect(BN.fromRaw(1, 1).mul(BN.fromRaw(0, 1)).valueOf()).toBe('0')
      expect(BN.fromRaw(2, 1).mul(BN.fromRaw(3, 1)).valueOf()).toBe('60')

      expect(BN.fromRaw(2, 18).mul(BN.fromRaw(3, 12)).valueOf()).toBe(
        '6000000000000000000',
      )
    })
    test('divide should return correct value', () => {
      expect(BN.fromRaw(2, 1).div(BN.fromRaw(3, 1)).valueOf()).toBe('0.6')
      expect(BN.fromRaw(2, 18).div(BN.fromRaw(3, 16)).valueOf()).toBe(
        '0.666666666666666666',
      )
    })
    test('adding should return correct value', () => {
      expect(BN.fromRaw(2, 1).add(BN.fromRaw(3, 1)).valueOf()).toBe('50')
      expect(BN.fromRaw(2, 18).add(BN.fromRaw(3, 6)).valueOf()).toBe(
        '5000000000000000000',
      )
    })
    test('subtract should return correct value', () => {
      expect(BN.fromRaw(2, 1).sub(BN.fromRaw(3, 1)).valueOf()).toBe('-10')
      expect(BN.fromRaw(2, 18).sub(BN.fromRaw(3, 6)).valueOf()).toBe(
        '-1000000000000000000',
      )
    })
  })

  describe('performs formatting', () => {
    test('formatting should return correct string', () => {
      expect(
        BN.fromRaw(1, 1).mul(BN.fromRaw(0, 1)).format({
          decimals: 2,
        }),
      ).toBe('0.00')

      expect(
        BN.fromRaw(2, 18).mul(BN.fromRaw(3, 18)).format({
          decimals: 0,
          groupSeparator: ',',
        }),
      ).toBe('6,000,000,000,000,000,000')

      expect(
        BN.fromRaw(2, 18).mul(BN.fromRaw(3, 18)).format({
          decimals: 6,
          groupSeparator: ',',
        }),
      ).toBe('6,000,000,000,000,000,000.000000')

      expect(
        BN.fromRaw(2, 18).mul(BN.fromRaw(3, 18)).format({
          decimals: 6,
          groupSeparator: '.',
          decimalSeparator: ',', // FIXME: this is not working
        }),
      ).toBe('6.000.000.000.000.000.000,000000')

      expect(
        BN.fromRaw(2, 18).mul(BN.fromRaw(3, 18)).format({
          decimals: 6,
          groupSeparator: '.',
          decimalSeparator: ',', // FIXME: this is not working
          groupSize: 2,
        }),
      ).toBe('6.00.00.00.00.00.00.00.00.00,000000')
    })
  })
})
