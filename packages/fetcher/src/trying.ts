import { Fetcher } from '@/fetcher'

type resp = {
  count: number
  entries: {
    API: string
    Description: string
    Auth: string
    HTTPS: boolean
    Cors: string
    Link: string
    Category: string
  }[]
}

const BASE_URL = 'https://jsonplaceholder.typicode.com'

const trying = async () => {
  const fetcher = new Fetcher({
    baseUrl: BASE_URL,
  })

  fetcher.useInterceptor({
    request: async config => {
      // eslint-disable-next-line no-param-reassign
      config.url = 'https://jsonplaceholder.typicode.com/todos/1'
      return config
    },
    // error: async response => {
    //   if (response.status === 404) {
    //     return fetcher.get<resp>('/todos/1')
    //   }
    //
    //   return response
    // },
  })

  const response = await fetcher.get<resp>('/todos/0')

  // eslint-disable-next-line no-console
  console.log(response.data)
}

trying()
