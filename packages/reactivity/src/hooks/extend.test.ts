import { computed } from './computed'
import { extend } from './extend'
import { toRaw } from './raw'
import { ref } from './ref'

const mockedAge = 10
const changedAge = 20
const mockedName = 'John'
const mockedSex = 'male'

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
        extend(
          {
            name,
          },
          parent,
        ),
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
        extend(
          {
            name,
          },
          parent,
        ),
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
        extend(
          {
            name,
          },
          parent,
        ),
      )
    }

    const child = createChild()

    expect(child.age).toBe(mockedAge)
    child.changeAge(changedAge)
    expect(child.age).toBe(changedAge)
  })

  test('should correctly override value of the extended parent', () => {
    const createParent = () => {
      const age = ref(mockedAge)

      return toRaw({
        age,
      })
    }

    const createChild = () => {
      const parent = createParent()
      const age = ref(changedAge)

      return toRaw(
        extend(
          {
            age,
          },
          parent,
        ),
      )
    }

    const child = createChild()

    expect(child.age).toBe(changedAge)
  })

  test('should extend multiple parents', () => {
    const createParent1 = () => {
      const age = ref(mockedAge)

      return toRaw({
        age,
      })
    }

    const createParent2 = () => {
      const name = ref(mockedName)

      return toRaw({
        name,
      })
    }

    const createChild = () => {
      const parent1 = createParent1()
      const parent2 = createParent2()
      const sex = ref(mockedSex)

      return toRaw(extend({ sex }, parent1, parent2))
    }

    const child = createChild()

    expect(child).toHaveProperty('age')
    expect(child).toHaveProperty('name')
    expect(child).toHaveProperty('sex')
    expect(child.age).toBe(mockedAge)
    expect(child.name).toBe(mockedName)
    expect(child.sex).toBe(mockedSex)
  })
})
