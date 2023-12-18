import type { FetcherRequestQuery } from '@/types'

export const extractQueryParams = (url: string): FetcherRequestQuery => {
  const parsedUrl = new URL(url)

  if (!parsedUrl.search.startsWith('?')) return {}

  return parsedUrl.search
    .substring(1)
    .split('&')
    .map(item => {
      const d = item.split('=')

      const res = {} as FetcherRequestQuery

      res[d.shift() || ''] = decodeURIComponent(d.join('='))

      return res
    })
    .reduce((a, b) => ({ ...a, ...b }), {})
}
