import { go } from './go'

describe('preforms go unit test', () => {
  describe('async callback should return', () => {
    test('null result if error thrown', async () => {
      const [err, result] = await go(async () => {
        throw new Error('test error')
      })

      expect(err).toBeInstanceOf(Error)
      expect(result).toBeNull()
    })

    test('result if no error thrown', async () => {
      const [err, result] = await go(async () => {
        return 'test result'
      })
      expect(err).toBeNull()
      expect(result).toBe('test result')
    })
  })

  describe('sync callback should return', () => {
    test('null result if error thrown', async () => {
      const [err, result] = await go(() => {
        throw new Error('test error')
      })
      expect(err).toBeInstanceOf(Error)
      expect(result).toBeNull()
    })

    test('result if no error thrown', async () => {
      const [err, result] = await go(() => {
        return 'test result'
      })
      expect(err).toBeNull()
      expect(result).toBe('test result')
    })
  })

  test('should redeclare error during few executions', async () => {
    let [err, result] = await go(async () => {
      throw new Error('test error')
    })

    expect(err).toBeInstanceOf(Error)
    expect(result).toBeNull()
    ;[err] = await go(async () => {
      return 'success'
    })
    expect(err).toBeNull()
  })
})
