import type { JsonApiClient } from '@/json-api'
import { JsonApiResponse } from '@/response'
import type { JsonApiDefaultMeta, JsonApiResponseRaw } from '@/types'

export const parseJsonApiResponse = <T, U = JsonApiDefaultMeta>(opts: {
  raw: JsonApiResponseRaw
  apiClient: JsonApiClient
  isNeedRaw: boolean
}) => {
  return new JsonApiResponse<T, U>(opts)
}
