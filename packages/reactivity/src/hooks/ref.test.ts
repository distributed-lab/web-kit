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

  test('should be able to create empty ref', () => {
    const age = ref<number>()
    expect(age.value).toBeUndefined()
    age.value = 30
    expect(age.value).toBe(30)
  })

  test('should be able to paste another ref as value', () => {
    const age = ref<number>(12)
    expect(age.value).toBe(12)
    expect(ref(age).value).toBe(12)
  })
})
