# @distributedlab/fetcher
Fetch API wrapper with the extended functionality and simple interface.

![version (scoped package)](https://badgen.net/npm/v/@distributedlab/fetcher)
![types](https://badgen.net/npm/types/@distributedlab/fetcher)
![tree-shaking](https://badgen.net/bundlephobia/tree-shaking/@distributedlab/fetcher)
![checks](https://badgen.net/github/checks/distributed-lab/web-kit/main)

## Installing

```
yarn add @distributedlab/fetcher
```

## Usage

ECMAScript modules:

```ts
import { Fetcher } from '@distributedlab/fetcher'
```

CommonJS:
```ts
const { Fetcher } = require('@distributedlab/fetcher')
```

Via CDN:

In HTML:
```html
<script src="https://unpkg.com/@distributedlab/fetcher"></script>
```

In code:
```js
const api = new DL_fetcher.Fetcher({
  baseURL: 'https://api.example.com',
})
```

## Configuration

```ts
import { Fetcher } from '@distributedlab/fetcher'

const api = new Fetcher({
  baseURL: 'https://api.example.com',
  headers: {
    'Content-Type': 'application/json',
  },
  mode: 'cors',
  timeout: 10000,
  credentials: 'include',
  referrerPolicy: 'no-referrer',
})

// Override request headers for one request via request options argument:
const { data } = await api.get<{ name: string }>('/data', {}, {
  headers: {
    'Content-Type': 'text/html',
  }
})
```

## Usage

### Basics

`GET` request:

```ts
import { Fetcher } from '@distributedlab/fetcher'

const api = new Fetcher({
  baseURL: 'https://api.example.com',
})

const getData = async () => {
  const { data } = await api.get<{ name: string }>('/data')
  return data
}
```

`GET` request with the query params:

```ts
import { Fetcher } from '@distributedlab/fetcher'

const api = new Fetcher({
  baseURL: 'https://api.example.com',
})

const getDataWithQuery = async () => {
  const { data } = await api.get<{ name: string }>('/data', {
      filter: 'John',
      exists: true,
      'page[number]': 1,
      include: ['comments', 'posts'],
  })
  return data
}
```

`POST` request (`PUT`, `PATCH` request has pretty much the same interface, just use `put` or `patch` method instead of `post`):

```ts
import { Fetcher } from '@distributedlab/fetcher'

const api = new Fetcher({
  baseURL: 'https://api.example.com',
})

const postData = async () => {
  const { data } = await api.post<{ name: string }>('/data', {
      name: 'John',
  })
  return data
}
```

Posting the `FormData`:

```ts
import { Fetcher } from '@distributedlab/fetcher'

const api = new Fetcher({
  baseURL: 'https://api.example.com',
})

const postFormData = async () => {
  const formData = new FormData()

  formData.append('name', 'John')
  formData.append('age', '25')

  const { data } = await api.post<{ name: string, age: string }>('/data', formData)
  return data
}
```

### Advanced

Abort the request:

```ts
import { Fetcher } from '@distributedlab/fetcher'

const api = new Fetcher({
  baseURL: 'https://api.example.com',
})

const abortRequest = async () => {
  const requestId = api.createRequestId()

  setTimeout(() => {
    api.abort(requestId)
  }, 1000)

  const { data } = await api.get<{ name: string }>('/data', {}, {
      id: requestId,
  })
}
```

Using the interceptors:

```ts
import { Fetcher } from '@distributedlab/fetcher'

const api = new Fetcher({
  baseURL: 'https://api.example.com',
})

api.useInterceptor({
  request: async request => {
    // Do something before request is sent
    return { ...request, url: `${request.url}?foo=bar` }
  },
  response: async response => {
    // Do something with response
    if (response.ok) {
      return response
    }

    return api.get('/auth/refresh')
  },
  error: async response => {
    // Do something if response errored
    if (response.status === 401) {
      return api.get('/auth/refresh')
    }

    return response
  },
})

```

## Changelog

For the change log, see [CHANGELOG.md](https://github.com/distributed-lab/web-kit/blob/main/CHANGELOG.md).
