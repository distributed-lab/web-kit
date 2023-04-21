import type {
  FetcherConfig,
  FetcherRequestBody,
  FetcherRequestConfig,
  FetcherRequestQueryValue,
  FetcherResponse,
} from '@distributedlab/fetcher'

export enum JsonApiLinkFields {
  first = 'first',
  last = 'last',
  next = 'next',
  prev = 'prev',
  self = 'self',
}

export type URL = string
export type Endpoint = string // e.g. `/users`

export type JsonApiClientConfig = FetcherConfig
export type JsonApiClientRequestConfig = FetcherRequestConfig
export type JsonApiClientRequestConfigHeaders = HeadersInit
export type JsonApiClientRequestBody = FetcherRequestBody
export type JsonApiErrorMetaType = Record<string, unknown> | unknown[] | unknown
export type JsonApiResponseRawData = Record<string, unknown>
export type JsonApiResponseRaw = FetcherResponse<JsonApiResponseRawData>
export type JsonApiClientRequestQueryValue = FetcherRequestQueryValue
export type JsonApiClientRequestQueryValueUnion =
  | JsonApiClientRequestQueryValue
  | JsonApiClientRequestQueryValue[]
  | JsonApiClientRequestQueryValue[][]

export type JsonApiClientRequestQuery = Record<
  string,
  | JsonApiClientRequestQueryValueUnion
  | Record<string, JsonApiClientRequestQueryValueUnion>
>

export type JsonApiRelationship<T extends string> = Record<
  string,
  JsonApiRecordBase<T>
> &
  JsonApiLinks

export type JsonApiRelationships<T extends string = string> = Record<
  string,
  JsonApiRelationship<T>
>

// Can be used in client code to extend and cast own entity types
export type JsonApiRecordBase<T extends string> = {
  id: string
  type: T
}

export type JsonApiResponseLinks = {
  first?: Endpoint
  last?: Endpoint
  next?: Endpoint
  prev?: Endpoint
  self?: Endpoint
}

export type JsonApiClientRequestOpts = FetcherRequestConfig & {
  isNeedRaw?: boolean
}

export type JsonApiResponseError = {
  id?: string | number
  code?: string
  title?: string
  detail?: string
  status?: string
  source?: {
    pointer?: string
    parameter?: string
    header?: string
  }
  meta?: JsonApiErrorMetaType
  links?: JsonApiResponseLinks
}

export type JsonApiResponseNestedErrors = JsonApiResponseError[]

export type JsonApiResponseErrors = {
  errors?: JsonApiResponseNestedErrors
}

export type JsonApiDefaultMeta = Record<string, unknown>

export type JsonApiRecord = {
  data: JsonApiRecordData
  included?: JsonApiRecord[]
} & JsonApiLinks

export type JsonApiRecordData<T extends string = string> = Omit<
  JsonApiRecordBase<T>,
  'id'
> &
  Partial<Pick<JsonApiRecordBase<T>, 'id'>> &
  JsonApiLinks & {
    attributes?: JsonApiAttributes
    relationships?: JsonApiRelationships
  }

export type JsonApiLinks = {
  links?: { [key in JsonApiLinkFields]?: Endpoint }
}

export type JsonApiAttributes = Record<string, unknown>
