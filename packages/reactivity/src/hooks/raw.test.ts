import { computed } from '@/hooks/computed'
import { toRaw } from '@/hooks/raw'
import { ref } from '@/hooks/ref'

const mockedAge = 20

describe('performs raw hook test', () => {
  test('should return raw object', () => {
    const target = {
      name: 'test',
      age: mockedAge,
      isNew: true,
    }

    const newObj = () => {
      return toRaw(target)
    }

    expect(newObj()).toStrictEqual(target)
  })

  test('should return object with the same functions', () => {
    const newObj = () => {
      return toRaw({ getAge: () => mockedAge })
    }

    expect(newObj().getAge()).toBe(mockedAge)
  })

  describe('should unwrap ref', () => {
    test('with the correct value', () => {
      const newObj = () => {
        return toRaw({ age: ref(mockedAge) })
      }

      expect(newObj().age).toBe(mockedAge)
    })

    test('with the correct value and reactivity connection', () => {
      const changedAge = 27

      const newObj = () => {
        const age = ref(mockedAge)

        const changeAge = (newAge: number) => {
          age.value = newAge
        }

        return toRaw({ age, changeAge })
      }

      const obj = newObj()

      expect(obj.age).toBe(mockedAge)
      obj.changeAge(changedAge)
      expect(obj.age).toBe(changedAge)
    })
  })

  describe('should unwrap computed', () => {
    test('with the correct value', () => {
      const newObj = () => {
        return toRaw({ age: computed(() => mockedAge) })
      }

      expect(newObj().age).toBe(mockedAge)
    })

    test('with the correct value and reactivity connection', () => {
      let ageRaw = mockedAge
      const changedAge = 27

      const newObj = () => {
        const age = computed(() => ageRaw)

        const changeAge = (newAge: number) => {
          ageRaw = newAge
        }

        return toRaw({ age, changeAge })
      }

      const obj = newObj()

      expect(obj.age).toBe(ageRaw)
      obj.changeAge(changedAge)
      expect(obj.age).toBe(changedAge)
    })
  })
})
