import type { FetcherRequestQuery } from '@/types'

export const extractQueryParams = (url: URL): FetcherRequestQuery => {
  const query = {} as FetcherRequestQuery

  if (!url.searchParams.size) return query

  for (const [key, value] of url.searchParams.entries()) {
    query[key] = value
  }

  return query
}
