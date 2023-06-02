import { ref } from './ref'

describe('performs ref hook', () => {
  test('should be able to read ref value', () => {
    const age = ref(27)
    expect(age.value).toBe(27)
  })

  test('should be able to write ref value', () => {
    const age = ref(27)
    expect(age.value).toBe(27)
    age.value = 30
    expect(age.value).toBe(30)
  })
})
