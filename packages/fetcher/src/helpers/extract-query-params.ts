import type { FetcherRequestQuery } from '@/types'

export const extractQueryParams = (url: string): FetcherRequestQuery => {
  const parsedUrl = new URL(url)

  if (!parsedUrl.search.startsWith('?')) return {}

  return parsedUrl.search
    .split(/[?&]/g)
    .map(item => {
      if (!item) return {}

      const d = item.split('=')

      const res = {} as FetcherRequestQuery

      res[d.shift() || ''] = decodeURIComponent(d.join('='))

      return res
    })
    .reduce((a, b) => ({ ...a, ...b }), {})
}
