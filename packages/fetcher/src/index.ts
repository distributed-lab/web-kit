import { Fetcher } from '@/fetcher'

export * from './abort-manager'
export * from './const'
export * from './enums'
export * from './fetcher'
export * from './helpers'
export * from './response-builder'
export * from './types'

const fetcher = new Fetcher({
  baseUrl: 'https://jsonplaceholder.typicode.com',
})

fetcher.useInterceptor({
  request: async request => {
    return { ...request, url: `${request.url}?foo=bar` }
  },
  response: async response => {
    if (response.ok) {
      return response
    }

    return fetcher.get('/auth/refresh')
  },
  error: async response => {
    if (response.status === 401) {
      return fetcher.get('/auth/refresh')
    }

    return response
  },
})

fetcher.get(
  '/posts/1',
  {},
  {
    headers: {
      'X-Test': 'test',
    },
  },
)
