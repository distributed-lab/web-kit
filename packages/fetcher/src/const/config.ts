import type { FetcherConfig } from '@/types'

export const DEFAULT_CONFIG: Omit<FetcherConfig, 'baseUrl'> = {
  credentials: 'include',
  cache: 'no-store',
  referrerPolicy: 'strict-origin-when-cross-origin',
  mode: 'cors',
  timeout: 60000,
}
