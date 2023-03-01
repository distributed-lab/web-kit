import { AxiosResponse } from 'axios'

import { JsonApiClient } from '@/json-api'
import { JsonApiResponse } from '@/response'
import { JsonApiDefaultMeta } from '@/types'

export const parseJsonApiResponse = <T, U = JsonApiDefaultMeta>(opts: {
  raw: AxiosResponse
  apiClient: JsonApiClient
  isNeedRaw: boolean
  withCredentials: boolean
}) => {
  return new JsonApiResponse<T, U>(opts)
}
