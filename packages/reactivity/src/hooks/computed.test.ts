import { ref } from '@/hooks/ref'

import { computed } from './computed'

describe('performs computed hook', () => {
  test('should not be able to write to computed value', () => {
    const age = computed(() => 27)

    expect(() => {
      age.value = 2
    }).toThrow()
  })

  test('should be able to read computed value', () => {
    const age = computed(() => 27)
    expect(age.value).toBe(27)
  })

  test('should return actual value', () => {
    let ageRaw = 27

    const age = computed(() => ageRaw)

    expect(age.value).toBe(27)
    ageRaw = 30
    expect(age.value).toBe(30)
  })

  test('should return actual value with ref value', () => {
    const ageRaw = ref(27)

    const age = computed(() => ageRaw.value)

    expect(age.value).toBe(27)
    ageRaw.value = 30
    expect(age.value).toBe(30)
  })
})
