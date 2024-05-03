# @distributedlab/jac
A library for constructing [JSON-API](https://jsonapi.org/) compliant requests and responses.

![version (scoped package)](https://badgen.net/npm/v/@distributedlab/jac)
![types](https://badgen.net/npm/types/@distributedlab/jac)
![tree-shaking](https://badgen.net/bundlephobia/tree-shaking/@distributedlab/jac)
![checks](https://badgen.net/github/checks/distributed-lab/web-kit/main)

## Example

#### Bearer token

`interceptors.ts`

```typescript
import {
  Fetcher,
  FetcherErrorResponseInterceptor,
  FetcherRequest,
  FetcherRequestInterceptor,
  FetcherResponse,
  HTTP_METHODS,
  HTTP_STATUS_CODES,
} from '@distributedlab/fetcher'

import { DEFAULT_BUS_EVENTS } from '@/enums'
import { toolkitBus } from '@/globals'
import { i18n } from '@/localization'

export const bearerAttachInterceptor: FetcherRequestInterceptor = async (
  request: FetcherRequest,
) => {
  const accessToken = localStorage.getItem('accessToken')

  if (!accessToken) return request

  if (!request.headers) request.headers = {}

  // Attach bearer token to every request
  request.headers = {
    ...request.headers,
    Authorization: `Bearer ${accessToken}`,
  }

  return request
}

export const refreshTokenInterceptor: FetcherErrorResponseInterceptor = async (
  response: FetcherResponse<unknown>,
) => {
  const config = response?.request
  const isUnauthorized = response.status === HTTP_STATUS_CODES.UNAUTHORIZED

  // If error isn't unauthorized - return error
  if (
    !isUnauthorized
    // Add if you use a refresh token (as 'refresh_token_url' there should be refresh token endpoint)
    // && config.url !== 'refresh_token_url'
  )
    return response

  // Some authentication store in the client app
  const { t } = i18n.global

  try {
    const accessToken = localStorage.getItem('accessToken')

    // Executes some refresh token logic in the client app
    toolkitBus.emit(DEFAULT_BUS_EVENTS.refreshToken)

    const url = new URL(config.url)

    return new Fetcher({ baseUrl: url.origin }).request({
      endpoint: url.pathname,
      method: config.method as HTTP_METHODS,
      ...(config.body ? { body: config.body } : {}),
      headers: {
        ...config.headers,
        // Reset default authorization header with new token
        Authorization: `Bearer ${accessToken}`,
      },
    })
  } catch (error) {
    /** Example of handling refresh token error in the client app
     *
     * Implementation may differ from example
     *
     * We can logout user and redirect him to the login page and
     * emit bus error event to show user that session expired
     */

    toolkitBus.emit(DEFAULT_BUS_EVENTS.logout)
    toolkitBus.emit(DEFAULT_BUS_EVENTS.error, {
      title: t('api-errors.session-expired-title'),
      message: t('api-errors.session-expired-desc'),
    })
    return Promise.reject(error)
  }
}

```

`api.ts`
```typescript
import { JsonApiClient } from '@distributedlab/jac';
import { bearerAttachInterceptor, refreshTokenInterceptor } from '@/interceptors';

export const api = new JsonApiClient(
  { baseUrl: 'https://api.example.com' },
  [{ request: bearerAttachInterceptor, error: refreshTokenInterceptor }],
)
```

## Changelog

For the change log, see [CHANGELOG.md](https://github.com/distributed-lab/web-kit/blob/main/CHANGELOG.md).
