import { DEFAULT_BN_PRECISION } from '@/const'

import { BN } from './bn'

describe('performs BN unit test', () => {
  beforeEach(() => {
    BN.setConfig({ precision: DEFAULT_BN_PRECISION })
  })

  const decimals = 6

  describe('performs static methods', () => {
    describe('fromBigInt should return correct value', () => {
      describe('if value is string', () => {
        test('and integer', () => {
          const value = '1000000'
          const bn = BN.fromBigInt(value, decimals)
          expect(bn.value).toBe(value)
          expect(bn.decimals).toBe(decimals)
          expect(bn.raw).toBe(1000000000000000000000000n)
        })

        describe('and hex string', () => {
          const value = '8c50ed21'

          test('without 0x prefix error will be thrown', () => {
            expect(() => BN.fromBigInt(value, decimals)).toThrowError()
          })

          test('with 0x prefix', () => {
            const bn = BN.fromBigInt(`0x${value}`, decimals)
            expect(bn.value).toBe('2354113825')
            expect(bn.decimals).toBe(decimals)
            expect(bn.raw).toBe(2354113825000000000000000000n)
          })
        })
      })

      describe('if value is number', () => {
        test('with normal notation', () => {
          const value = 2451222523
          const bn = BN.fromBigInt(value, decimals)
          expect(bn.value).toBe(value.toString())
          expect(bn.decimals).toBe(decimals)
          expect(bn.raw).toBe(2451222523000000000000000000n)
        })

        test('with scientific notation', () => {
          const bn = BN.fromBigInt(3e5, decimals)
          expect(bn.value).toBe('300000')
          expect(bn.decimals).toBe(decimals)
          expect(bn.raw).toBe(300000000000000000000000n)
        })
      })
    })

    describe('fromRaw should return correct value', () => {
      describe('if value is type number', () => {
        test('and has no decimals', () => {
          const bn = BN.fromRaw(22, decimals)
          expect(bn.value).toBe('22000000')
          expect(bn.decimals).toBe(decimals)
          expect(bn.raw).toBe(22000000000000000000000000n)
        })

        test('and has decimals', () => {
          const bn = BN.fromRaw(3.14, decimals)
          expect(bn.value).toBe('3140000')
          expect(bn.decimals).toBe(decimals)
          expect(bn.raw).toBe(3140000000000000000000000n)
        })

        test('and negative', () => {
          const bn = BN.fromRaw(-3.14, decimals)
          expect(bn.value).toBe('-3140000')
          expect(bn.decimals).toBe(decimals)
          expect(bn.raw).toBe(-3140000000000000000000000n)
        })
      })

      describe('if value is type string', () => {
        test('and has no decimals', () => {
          const bn = BN.fromRaw('22', decimals)
          expect(bn.value).toBe('22000000')
          expect(bn.decimals).toBe(decimals)
          expect(bn.raw).toBe(22000000000000000000000000n)
        })

        test('if has 0 as decimal', () => {
          const bn = BN.fromRaw('5.0', decimals)
          expect(bn.value).toBe('5000000')
          expect(bn.decimals).toBe(decimals)
          expect(bn.raw).toBe(5000000000000000000000000n)
        })

        test('if has trailing 0 decimals', () => {
          const bn = BN.fromRaw('4.000', decimals)
          expect(bn.value).toBe('4000000')
          expect(bn.decimals).toBe(decimals)
          expect(bn.raw).toBe(4000000000000000000000000n)
        })

        test('if has 1 decimal', () => {
          const bn = BN.fromRaw('2.3', decimals)
          expect(bn.value).toBe('2300000')
          expect(bn.decimals).toBe(decimals)
          expect(bn.raw).toBe(2300000000000000000000000n)
        })

        test('if has 3 decimals', () => {
          const bn = BN.fromRaw('1.123', decimals)
          expect(bn.value).toBe('1123000')
          expect(bn.decimals).toBe(decimals)
          expect(bn.raw).toBe(1123000000000000000000000n)
        })

        test('if negative', () => {
          const bn = BN.fromRaw('-1.123', decimals)
          expect(bn.value).toBe('-1123000')
          expect(bn.decimals).toBe(decimals)
          expect(bn.raw).toBe(-1123000000000000000000000n)
        })

        test('if has decimals overflow', () => {
          const bn = BN.fromRaw('2.12333344', decimals)
          expect(bn.value).toBe('2123333')
          expect(bn.decimals).toBe(decimals)
          expect(bn.raw).toBe(2123333440000000000000000n)
        })

        test('if has precision overflow', () => {
          const bn = BN.fromRaw('3.14159265358979323846264338327950', decimals)
          expect(bn.value).toBe('3141592')
          expect(bn.decimals).toBe(decimals)
          expect(bn.raw).toBe(3141592653589793238462643n)
        })

        test('if has 0 whole part', () => {
          const bn = BN.fromRaw('0.123', decimals)
          expect(bn.value).toBe('123000')
          expect(bn.decimals).toBe(decimals)
          expect(bn.raw).toBe(123000000000000000000000n)
        })

        test('if has only trailing 0 whole part', () => {
          const bn = BN.fromRaw('000.123', decimals)
          expect(bn.value).toBe('123000')
          expect(bn.decimals).toBe(decimals)
          expect(bn.raw).toBe(123000000000000000000000n)
        })

        test('if has trailing 0 and whole part', () => {
          const bn = BN.fromRaw('0004.78', decimals)
          expect(bn.value).toBe('4780000')
          expect(bn.decimals).toBe(decimals)
          expect(bn.raw).toBe(4780000000000000000000000n)
        })

        describe('if value is zero', () => {
          const checkZeroValue = (bn: BN) => {
            expect(bn.value).toBe('0')
            expect(bn.decimals).toBe(decimals)
            expect(bn.raw).toBe(0n)
          }

          test('without fractional part', () => {
            checkZeroValue(BN.fromRaw('0', decimals))
          })

          test('with 0 fractional part', () => {
            checkZeroValue(BN.fromRaw('0.0', decimals))
          })

          test('with whole and fractional parts with trailing 0', () => {
            checkZeroValue(BN.fromRaw('00.0000', decimals))
          })

          test('is trailing 0', () => {
            checkZeroValue(BN.fromRaw('000', decimals))
          })
        })

        describe('if value has empty space', () => {
          const intValue = '2840000'
          const precisionValue = 2840000000000000000000000n

          test('in the beginning', () => {
            const bn = BN.fromRaw('  2.84', decimals)
            expect(bn.value).toBe(intValue)
            expect(bn.decimals).toBe(decimals)
            expect(bn.raw).toBe(precisionValue)
          })

          test('in the end', () => {
            const bn = BN.fromRaw('2.84   ', decimals)
            expect(bn.value).toBe(intValue)
            expect(bn.decimals).toBe(decimals)
            expect(bn.raw).toBe(precisionValue)
          })

          test('in the beginning and in the end', () => {
            const bn = BN.fromRaw('  2.84    ', decimals)
            expect(bn.value).toBe(intValue)
            expect(bn.decimals).toBe(decimals)
            expect(bn.raw).toBe(precisionValue)
          })
        })
      })
    })

    test('setConfig should override default config', () => {
      expect(BN.config.precision).toBe(DEFAULT_BN_PRECISION)
      BN.setConfig({ precision: 24 })
      expect(BN.config.precision).toBe(24)
    })

    describe('isBn should return', () => {
      test('true if value is  BN', () => {
        expect(BN.isBn(BN.fromRaw(1, decimals))).toBeTruthy()
      })
      test('false if value is not BN', () => {
        expect(BN.isBn(BN.fromRaw(1, decimals))).toBeTruthy()
      })
    })

    describe('performs min max operations', () => {
      const bn1 = BN.fromRaw(1, decimals)
      const bn2 = BN.fromRaw(2, decimals)
      const bn3 = BN.fromRaw(3, decimals)
      const bn4 = BN.fromRaw(4, decimals)
      const bn5 = BN.fromRaw(5, decimals)
      const args = [bn1, bn2, bn3, bn4, bn5]

      test('min should return min value', () => {
        expect(BN.min(...args).raw).toBe(bn1.raw)
      })

      test('max should return max value', () => {
        expect(BN.max(...args).raw).toBe(bn5.raw)
      })
    })
  })

  describe('performs getters', () => {
    const bn = BN.fromRaw(1, decimals)

    test('get value', () => {
      expect(bn.value).toBe('1000000')
    })

    test('get raw', () => {
      expect(bn.raw).toBe(1000000000000000000000000n)
    })

    test('get decimals', () => {
      expect(bn.decimals).toBe(decimals)
    })

    test('get config', () => {
      expect(bn.config).toStrictEqual({ decimals })
    })

    test('isZero', () => {
      expect(BN.fromRaw(0, decimals).isZero).toBeTruthy()
      expect(BN.fromRaw(1, decimals).isZero).toBeFalsy()
    })

    test('isNegative', () => {
      expect(BN.fromRaw(-1, decimals).isNegative).toBeTruthy()
      expect(BN.fromRaw(1, decimals).isNegative).toBeFalsy()
    })

    test('isPositive', () => {
      expect(BN.fromRaw(1, decimals).isPositive).toBeTruthy()
      expect(BN.fromRaw(-1, decimals).isPositive).toBeFalsy()
    })
  })

  describe('performs arithmetic operations', () => {
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

    test('compare should return correct value', () => {
      expect(BN.fromRaw(2, 18).gt(BN.fromRaw(1, 18))).toBeTruthy()
      expect(BN.fromRaw(1, 18).lt(BN.fromRaw(2, 18))).toBeTruthy()
      expect(BN.fromRaw(2, 18).gte(BN.fromRaw(2, 18))).toBeTruthy()
      expect(BN.fromRaw(2, 18).lte(BN.fromRaw(2, 18))).toBeTruthy()
      expect(BN.fromRaw(2, 18).eq(BN.fromRaw(2, 18))).toBeTruthy()
      expect(
        BN.fromBigInt('2000000000000000000', 18).eq(
          BN.fromBigInt('2000000000000000000', 18),
        ),
      ).toBeTruthy()
    })

    test('performs negated, should return correct value', () => {
      expect(BN.fromRaw(1, decimals).negated().value).toBe('-1000000')
      expect(BN.fromRaw(-1, decimals).negated().value).toBe('1000000')
    })

    test('abs should return correct value', () => {
      expect(BN.fromRaw(4, 6).sub(BN.fromRaw(9, 6)).abs().value).toBe('5000000')
    })

    describe('performs percent calculations', () => {
      const value = '0.002433'
      const decimals = 18

      test('percent from this should return correct value', () => {
        expect(BN.fromRaw(value, decimals).percent(5).value).toBe(
          '121650000000000',
        )
      })

      test('addPercent to this should return correct value', () => {
        expect(BN.fromRaw(value, decimals).addPercent(5).value).toBe(
          '2554650000000000',
        )
      })

      test('subPercent from this should return correct value', () => {
        expect(BN.fromRaw(value, decimals).subPercent(2.5).value).toBe(
          '2373658536585365',
        )
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
          const amount = BN.fromBigInt('2595', 6).toGreaterDecimals(18)
          expect(amount.value).toBe('2595000000000000')
          expect(amount.decimals).toBe(18)
        })
      })

      describe('toLessDecimals', () => {
        test('should throw error if the decimals is greater then current', () => {
          expect(
            () => BN.fromBigInt('2595', 6).toLessDecimals(7).value,
          ).toThrowError()
        })

        test('should return correct value if the decimals is less then current', () => {
          const amount = BN.fromBigInt('2595000000000000', 18).toLessDecimals(6)
          expect(amount.value).toBe('2595')
          expect(amount.decimals).toBe(6)
        })
      })

      describe('toDecimals', () => {
        test('should return correct value if the decimals is less then current', () => {
          const amount = BN.fromBigInt('2595000000000000', 18).toDecimals(6)
          expect(amount.value).toBe('2595')
          expect(amount.decimals).toBe(6)
        })

        test('should return correct value if the decimals is greater then current', () => {
          const amount = BN.fromBigInt('2595', 6).toDecimals(18)
          expect(amount.value).toBe('2595000000000000')
          expect(amount.decimals).toBe(18)
        })
      })
    })

    describe('performs sqrt', () => {
      test('sqrt should return correct value', () => {
        expect(BN.fromRaw(4, 6).sqrt().value).toBe('2000000')
        expect(BN.fromRaw(9, 18).sqrt().value).toBe('3000000000000000000')
        expect(BN.fromRaw(0.25, 6).sqrt().value).toBe('500000')
        expect(BN.fromRaw(1, 6).sqrt().value).toBe('1000000')
      })

      test('should throw error if precision is odd number', () => {
        BN.setConfig({ precision: 5 })
        expect(() => BN.fromRaw(0.25, 6).sqrt()).toThrowError()
      })
    })
  })

  test('MAX_UINT256 should return correct value', () => {
    expect(BN.MAX_UINT256.value).toBe(
      '115792089237316195423570985008687907853269984665640564039457584007913129639935',
    )
  })

  describe('performs toString, should return correct value', () => {
    expect(BN.fromRaw('3.14', decimals).toString()).toBe('3.140000')
    expect(BN.fromRaw('-3.14', decimals).toString()).toBe('-3.140000')
    expect(BN.fromBigInt('-1123', decimals).toString()).toBe('-0.001123')
    expect(BN.fromBigInt('22', decimals).toString()).toBe('0.000022')
    expect(BN.fromBigInt('0', decimals).toString()).toBe('0.000000')
    expect(BN.fromBigInt('231221312312323', decimals).toString()).toBe(
      '231221312.312323',
    )
  })
})
