import { BN, DEFAULT_BN_PRECISION } from '@/bn'

describe('performs BN unit test', () => {
  beforeEach(() => {
    BN.setConfig({ precision: DEFAULT_BN_PRECISION })
  })

  describe('performs static methods', () => {
    const decimals = 6

    describe('fromBigInt should return correct value', () => {
      describe('if value is string', () => {
        test('and integer', () => {
          const value = '1000000'
          const bn = BN.fromBigInt(value, decimals)
          expect(bn.value).toBe(value)
          expect(bn.decimals).toBe(decimals)
          expect(bn.raw).toBe(1_000_000_000_000_000_000_000_000n)
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
            expect(bn.raw).toBe(2_354_113_825_000_000_000_000_000_000n)
          })
        })
      })

      describe('if value is number', () => {
        test('with normal notation', () => {
          const value = 2451222523
          const bn = BN.fromBigInt(value, decimals)
          expect(bn.value).toBe(value.toString())
          expect(bn.decimals).toBe(decimals)
          expect(bn.raw).toBe(2_451_222_523_000_000_000_000_000_000n)
        })

        test('with scientific notation', () => {
          const bn = BN.fromBigInt(3e5, decimals)
          expect(bn.value).toBe('300000')
          expect(bn.decimals).toBe(decimals)
          expect(bn.raw).toBe(3_000_000_000_000_000_000_000_00n)
        })
      })
    })

    describe('fromRaw should return correct value', () => {
      describe('if value is type number', () => {
        test('and has no decimals', () => {
          const bn = BN.fromRaw(22, decimals)
          expect(bn.value).toBe('22000000')
          expect(bn.decimals).toBe(decimals)
          expect(bn.raw).toBe(22_000_000_000_000_000_000_000_000n)
        })

        test('and has decimals', () => {
          const bn = BN.fromRaw(3.14, decimals)
          expect(bn.value).toBe('3140000')
          expect(bn.decimals).toBe(decimals)
          expect(bn.raw).toBe(3_140_000_000_000_000_000_000_000n)
        })
      })

      describe('if value is type string', () => {
        test('and has no decimals', () => {
          const bn = BN.fromRaw('22', decimals)
          expect(bn.value).toBe('22000000')
          expect(bn.decimals).toBe(decimals)
          expect(bn.raw).toBe(22_000_000_000_000_000_000_000_000n)
        })

        test('if has 0 as decimal', () => {
          const bn = BN.fromRaw('5.0', decimals)
          expect(bn.value).toBe('5000000')
          expect(bn.decimals).toBe(decimals)
          expect(bn.raw).toBe(5_000_000_000_000_000_000_000_000n)
        })

        test('if has trailing 0 decimals', () => {
          const bn = BN.fromRaw('4.000', decimals)
          expect(bn.value).toBe('4000000')
          expect(bn.decimals).toBe(decimals)
          expect(bn.raw).toBe(4_000_000_000_000_000_000_000_000n)
        })

        test('if has 1 decimal', () => {
          const bn = BN.fromRaw('2.3', decimals)
          expect(bn.value).toBe('2300000')
          expect(bn.decimals).toBe(decimals)
          expect(bn.raw).toBe(2_300_000_000_000_000_000_000_000n)
        })

        test('if has 3 decimals', () => {
          const bn = BN.fromRaw('1.123', decimals)
          expect(bn.value).toBe('1123000')
          expect(bn.decimals).toBe(decimals)
          expect(bn.raw).toBe(1_123_000_000_000_000_000_000_000n)
        })

        test('if has decimals overflow', () => {
          const bn = BN.fromRaw('2.12333344', decimals)
          expect(bn.value).toBe('2123333')
          expect(bn.decimals).toBe(decimals)
          expect(bn.raw).toBe(2_123_333_440_000_000_000_000_000n)
        })

        test('if has precision overflow', () => {
          const bn = BN.fromRaw('3.14159265358979323846264338327950', decimals)
          expect(bn.value).toBe('3141592')
          expect(bn.decimals).toBe(decimals)
          expect(bn.raw).toBe(3_141_592_653_589_793_238_462_643n)
        })

        test('if has 0 whole part', () => {
          const bn = BN.fromRaw('0.123', decimals)
          expect(bn.value).toBe('123000')
          expect(bn.decimals).toBe(decimals)
          expect(bn.raw).toBe(1_230_000_000_000_000_000_000_00n)
        })

        test('if has only trailing 0 whole part', () => {
          const bn = BN.fromRaw('000.123', decimals)
          expect(bn.value).toBe('123000')
          expect(bn.decimals).toBe(decimals)
          expect(bn.raw).toBe(1_230_000_000_000_000_000_000_00n)
        })

        test('if has trailing 0 and whole part', () => {
          const bn = BN.fromRaw('0004.78', decimals)
          expect(bn.value).toBe('4780000')
          expect(bn.decimals).toBe(decimals)
          expect(bn.raw).toBe(4_780_000_000_000_000_000_000_000n)
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
          const precisionValue = 2_840_000_000_000_000_000_000_000n

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
      BN.setConfig({ precision: 18 })
      expect(BN.config.precision).toBe(18)
    })

    describe('isBn should return', () => {
      test('true if value is  BN', () => {
        expect(BN.isBn(BN.fromRaw(1, decimals))).toBeTruthy()
      })
      test('false if value is not BN', () => {
        expect(BN.isBn(BN.fromRaw(1, decimals))).toBeTruthy()
      })
    })
  })
})
