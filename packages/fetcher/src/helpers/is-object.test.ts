import { isObject } from './is-object'

describe('performs isObject unit test', () => {
  test('returns true for object', () => {
    expect(isObject({})).toBe(true)
  })

  test('returns false for array', () => {
    expect(isObject([])).toBe(false)
  })

  test('returns false for NaN', () => {
    expect(isObject(NaN)).toBe(false)
  })

  test('returns false for null', () => {
    expect(isObject(null)).toBe(false)
  })

  test('returns false for String instance', () => {
    expect(isObject(new String(''))).toBe(false)
  })

  test('returns false for Function instance', () => {
    const x = function () {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.a = 1
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(isObject(new x())).toBe(false)
  })
})
