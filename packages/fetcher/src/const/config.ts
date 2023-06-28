import type { FetcherConfig } from '@/types'

export const DEFAULT_CONFIG: Omit<FetcherConfig, 'baseUrl'> = {
  credentials: 'omit',
  cache: 'no-store',
  referrerPolicy: 'no-referrer',
  mode: 'cors',
  timeout: 60000,
}
