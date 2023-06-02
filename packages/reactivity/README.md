# @distributedlab/reactivity
Implementation of the reactivity connections to propagate changes between objects.

![version (scoped package)](https://badgen.net/npm/v/@distributedlab/reactivity)
![types](https://badgen.net/npm/types/@distributedlab/reactivity)
![tree-shaking](https://badgen.net/bundlephobia/tree-shaking/@distributedlab/reactivity)
![checks](https://badgen.net/github/checks/distributed-lab/web-kit/main)

## Example

Basic usage:
```ts
import { ref, computed, toRaw } from '@distributedlab/reactivity'

const newPerson = () => {
  const age = ref(30)
  const name = computed('John')

  const changeAge = (newAge: number) => {
    age.value = newAge
  }

  return toRaw({ age, name, changeAge })
}

const john = newPerson()

console.log(john.age) // 30
console.log(john.name) // John

obj.changeAge(35)

console.log(john.age) // 35
```

Usage with extending:

```ts
const newHuman = () => {
  const age = ref(25)

  const changeAge = (newAge: number) => {
    age.value = newAge
  }

  return toRaw({ age, changeAge })
}

const newPerson = () => {
  const parent = newHuman()
  const name = computed(() => 'John')
  return toRaw(extend(parent, { name }))
}

const child = createChild()

console.log(child.age) // 25

child.changeAge(30)

console.log(child.age) // 30
```

## Changelog

For the change log, see [CHANGELOG.md](https://github.com/distributed-lab/web-kit/blob/main/CHANGELOG.md).
