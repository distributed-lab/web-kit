import { ref, toRaw } from '@distributedlab/reactivity'

import { isEmptyBodyStatusCode } from '@/helpers'
import type {
  FetcherRequest,
  FetcherResponse,
  FetcherResponseBuilder,
} from '@/types'

export const newFetcherResponseBuilder = <T>(
  req?: FetcherRequest,
  resp?: Response,
): FetcherResponseBuilder<T> => {
  let builder: FetcherResponseBuilder<T>
  const response = ref<Response>()

  const result = ref<FetcherResponse<T>>({
    ok: false,
    status: 0,
    statusText: '',
    headers: {} as Headers,
    url: '',
    request: req || { url: '' },
  })

  const build = async () => {
    if (!response.value || isEmptyBodyStatusCode(response.value.status)) {
      return result.value
    }

    await extractData()

    return result.value
  }

  const populateResponse = (r: Response) => {
    response.value = r.clone()
    result.value.ok = response.value.ok
    result.value.status = response.value.status
    result.value.statusText = response.value.statusText
    result.value.headers = response.value.headers
    result.value.url = response.value.url
    return builder
  }

  const extractData = async () => {
    if (!response.value || isEmptyBodyStatusCode(response.value.status)) {
      return
    }

    const parsers = [
      parseJson,
      parseFormData,
      ...(response.value.ok ? [parseBlob] : []),
    ]

    for (const parser of parsers) {
      const isParsed = await parser()
      if (isParsed) break
    }
  }

  /**
   * Clone response to be able to read response body multiple times
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/Response/bodyUsed}
   */
  const parseJson = () =>
    tryToParse(response.value?.clone()?.json() as Promise<T>)

  const parseBlob = () =>
    tryToParse(response.value?.clone()?.blob() as Promise<T>)

  const parseFormData = () =>
    tryToParse(response.value?.clone()?.formData() as Promise<T>)

  const tryToParse = async (promise: Promise<T>) => {
    try {
      result.value.data = (await promise) as T
      return true
    } catch (e) {
      return false
    }
  }

  if (resp) populateResponse(resp)

  builder = toRaw({
    build,
    populateResponse,
  })

  return builder
}
