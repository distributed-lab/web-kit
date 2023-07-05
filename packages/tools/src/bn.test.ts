import { BN } from './bn'

describe('performs BN unit test', () => {
  describe('performs constructor', () => {
    test('formRaw should return correct value', () => {
      expect(BN.fromRaw(1, 1).value).toBe('10')
      expect(BN.fromRaw(1, 2).value).toBe('100')
      expect(BN.fromRaw(1, 3).value).toBe('1000')
      expect(BN.fromRaw(1, 18).value).toBe('1000000000000000000')
      expect(BN.fromRaw(0.1, 6).value).toBe('100000')
      expect(BN.fromRaw(0.123, 6).value).toBe('123000')
      expect(BN.fromRaw(9, 18).value).toBe('9000000000000000000')
      expect(BN.fromRaw(99999, 18).value).toBe('99999000000000000000000')
      expect(BN.fromBigInt('99999000000000000000000', 18).toString()).toBe(
        '99999',
      )
    })

    test('fromFraction should return correct value', () => {
      expect(
        BN.fromBigInt('1000000000000000000', 18).fromFraction(18).value,
      ).toBe('1')

      expect(BN.fromBigInt('1000000000000000000', 18).value).toBe(
        BN.fromRaw(1, 18).value,
      )
    })
  })

  describe('performs math operations', () => {
    test('multiply should return correct value', () => {
      expect(BN.fromRaw(1, 1).mul(BN.fromRaw(0, 1)).value).toBe('0')
      expect(BN.fromRaw(2, 1).mul(BN.fromRaw(3, 1)).value).toBe('60')

      expect(BN.fromRaw(2, 18).mul(BN.fromRaw(3, 12)).value).toBe(
        '6000000000000000000',
      )
    })
    test('multiply should drop decimal part if value overflows decimals', () => {
      expect(
        BN.fromBigInt('194287666397830', 18).mul(BN.fromRaw(1.02, 18)).value,
      ).toBe('198173419725786')
    })
    test('divide should return correct value', () => {
      expect(BN.fromRaw(2, 1).div(BN.fromRaw(3, 1)).value).toBe('6')
      expect(BN.fromRaw(2, 18).div(BN.fromRaw(3, 16)).value).toBe(
        '666666666666666666',
      )
    })
    test('adding should return correct value', () => {
      expect(BN.fromRaw(2, 1).add(BN.fromRaw(3, 1)).value).toBe('50')
      expect(BN.fromRaw(2, 18).add(BN.fromRaw(3, 6)).value).toBe(
        '5000000000000000000',
      )
    })
    test('subtract should return correct value', () => {
      expect(BN.fromRaw(2, 1).sub(BN.fromRaw(3, 1)).value).toBe('-10')
      expect(BN.fromRaw(2, 18).sub(BN.fromRaw(3, 6)).value).toBe(
        '-1000000000000000000',
      )
    })
    test('compare should return correct value', () => {
      expect(BN.fromRaw(2, 18).isGreaterThan(BN.fromRaw(1, 18))).toBe(true)
      expect(BN.fromRaw(1, 18).isLessThan(BN.fromRaw(2, 18))).toBe(true)
      expect(BN.fromRaw(2, 18).isGreaterThanOrEqualTo(BN.fromRaw(2, 18))).toBe(
        true,
      )
      expect(BN.fromRaw(2, 18).isLessThanOrEqualTo(BN.fromRaw(2, 18))).toBe(
        true,
      )
      expect(BN.fromRaw(2, 18).isEqualTo(BN.fromRaw(2, 18))).toBe(true)
      expect(
        BN.fromBigInt('2000000000000000000', 18).isEqualTo(
          BN.fromBigInt('2000000000000000000', 18),
        ),
      ).toBe(true)
    })
    test('sqrt should return correct value', () => {
      expect(BN.fromRaw(4, 6).sqrt().value).toBe('2000000')
      expect(BN.fromRaw(4, 6).sqrt().toString()).toBe('2')

      expect(BN.fromRaw(9, 18).sqrt().value).toBe('3000000000000000000')
      expect(BN.fromRaw(9, 18).sqrt().toString()).toBe('3')

      expect(BN.fromRaw(0.25, 6).sqrt().value).toBe('500000')
      expect(BN.fromRaw(0.25, 6).sqrt().toString()).toBe('0.5')

      expect(() => BN.fromRaw(0.25, 5).sqrt()).toThrowError(
        'SQRT requires decimals to be even number, {"number":"25000","decimals":5}',
      )
    })
    test('abs should return correct value', () => {
      expect(BN.fromRaw(4, 6).sub(BN.fromRaw(9, 6)).abs().value).toBe('5000000')
    })
  })

  describe('performs decimals conversion', () => {
    describe('toGreaterDecimals', () => {
      test('should throw error if the decimals is less then current', () => {
        expect(
          () => BN.fromBigInt('2595', 6).toGreaterDecimals(5).value,
        ).toThrowError()
      })
      test('should return correct value if the decimals is greater then current', () => {
        expect(BN.fromBigInt('2595', 6).toGreaterDecimals(18).value).toBe(
          '2595000000000000',
        )
      })
    })

    describe('toLessDecimals', () => {
      test('should throw error if the decimals is greater then current', () => {
        expect(
          () => BN.fromBigInt('2595', 6).toLessDecimals(7).value,
        ).toThrowError()
      })
      test('should return correct value if the decimals is less then current', () => {
        expect(
          BN.fromBigInt('2595000000000000', 18).toLessDecimals(6).value,
        ).toBe('2595')
      })
    })

    describe('toDecimals', () => {
      test('should return correct value if the decimals is less then current', () => {
        expect(BN.fromBigInt('2595130808637828', 18).toDecimals(6).value).toBe(
          '2595',
        )
      })
      test('should return correct value if the decimals is greater then current', () => {
        expect(BN.fromBigInt('2595', 6).toDecimals(18).value).toBe(
          '2595000000000000',
        )
      })
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
          decimalSeparator: ',',
        }),
      ).toBe('6.000.000.000.000.000.000,000000')

      expect(
        BN.fromRaw(2, 18).mul(BN.fromRaw(3, 18)).format({
          decimals: 6,
          groupSeparator: '.',
          decimalSeparator: ',',
          groupSize: 2,
        }),
      ).toBe('6.00.00.00.00.00.00.00.00.00,000000')
    })
  })

  test('MAX_UINT256 should return correct value', () => {
    expect(BN.MAX_UINT256.value).toBe(
      '115792089237316195423570985008687907853269984665640564039457584007913129639935',
    )
  })

  describe('performs values', () => {
    test('performs value, getter should return correct uint value', () => {
      expect(BN.fromRaw(1, 18).value).toBe('1000000000000000000')
    })

    test('preforms toString, should return correct humanized value and not mutate value', () => {
      expect(BN.fromRaw(1, 18).toString()).toBe('1')
      expect(BN.fromRaw(1, 18).value).toBe('1000000000000000000')
    })
  })
})
