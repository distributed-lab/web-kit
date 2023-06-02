import { computed } from './computed'
import { extend } from './extend'
import { toRaw } from './raw'
import { ref } from './ref'

const mockedAge = 10
const changedAge = 20
const mockedName = 'John'

describe('performs extend hook unit test', () => {
  test('should basically extend child with parent', () => {
    const createParent = () => {
      return toRaw({
        age: ref(mockedAge),
      })
    }

    const createChild = () => {
      const parent = createParent()
      const name = computed(() => mockedName)

      return toRaw(
        extend(parent, {
          name,
        }),
      )
    }

    const child = createChild()

    expect(child).toHaveProperty('age')
    expect(child).toHaveProperty('name')
    expect(child.name).toBe(mockedName)
    expect(child.age).toBe(mockedAge)
  })

  test('should correctly extend parent with functions', () => {
    const createParent = () => {
      const age = ref(mockedAge)

      const getAge = () => {
        return age.value
      }

      return toRaw({
        age,
        getAge,
      })
    }

    const createChild = () => {
      const parent = createParent()
      const name = computed(() => mockedName)

      return toRaw(
        extend(parent, {
          name,
        }),
      )
    }

    const child = createChild()

    expect(child.getAge).not.toThrow()
    expect(child.getAge()).toBe(mockedAge)
  })

  test('should correctly return value of the extended parent after change', () => {
    const createParent = () => {
      const age = ref(mockedAge)

      const changeAge = (newAge: number) => {
        age.value = newAge
      }

      return toRaw({
        age,
        changeAge,
      })
    }

    const createChild = () => {
      const parent = createParent()
      const name = computed(() => mockedName)

      return toRaw(
        extend(parent, {
          name,
        }),
      )
    }

    const child = createChild()

    expect(child.age).toBe(mockedAge)
    child.changeAge(changedAge)
    expect(child.age).toBe(changedAge)
  })
})
