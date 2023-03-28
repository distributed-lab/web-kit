import { Fetcher } from '@/index'

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

const BASE_URL = 'https://api.publicapis.org/'
const ENDPOINT = '/entries'

const test = async () => {
  const fetcher = new Fetcher({
    baseUrl: BASE_URL,
  })

  const response = await fetcher.get<resp>(ENDPOINT)

  // eslint-disable-next-line no-console
  console.log(response.data)
}

test()
