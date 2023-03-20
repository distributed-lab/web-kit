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
import { HTTPS_STATUS_CODES } from '@distributedlab/jac'
import { AxiosInstance, AxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/store'
import { router } from '@/router'
import { Bus } from '@/utils'
import { ROUTE_NAMES } from '@/enums'
import { useI18n } from '@/localization'

export function attachBearerInjector(axios: AxiosInstance): void {
  axios.interceptors.request.use((request): AxiosRequestConfig => {
    // Some authentication store in the client app
    const authStore = useAuthStore()
    if (!authStore.accessToken) return request

    if (!request.headers) request.headers = {}
    // Attach bearer token to every request
    request.headers['Authorization'] = `Bearer ${authStore.accessToken}`
    return request
  })
}

export function attachStaleTokenHandler(axios: AxiosInstance): void {
  axios.interceptors.response.use(
    response => response,
    async error => {
      const config = error?.config
      const isUnauthorized = (
        error?.response?.status === HTTPS_STATUS_CODES.UNAUTHORIZED &&
        !config?._retry
      )

      // If error isn't unauthorized or request was already retried - return error
      if (!isUnauthorized
        // Add if you use a refresh token (as 'refresh_token_url' there should be refresh token endpoint)
        // && error.config.url !== 'refresh_token_url'
      ) return Promise.reject(error)

      // Some authentication store in the client app
      const authStore = useAuthStore()
      const { $t } = useI18n()

      try {
        config._retry = true
        // Executes some refresh token logic in the client app
        await authStore.refreshToken()

        // Reset default axios authorization header witn new token
        axios.defaults.headers.common['Authorization'] = `Bearer ${authStore.accessToken}`

        return axios(config)
      } catch (_error) {

        /** Example of handling refresh token error in the client app
         *
         * Implementation may differ from example
         *
         * We can logout user and redirect him to the login page and
         * emit bus error event to show user that session expired
        */
        authStore.logout()
        router.push({ name: ROUTE_NAMES.login })
        Bus.error({
          title: $t('api-errors.session-expired-title'),
          message: $t('api-errors.session-expired-desc'),
        })
        return Promise.reject(_error)
      }
    },
  )
}
```

`api.ts`
```typescript
import { JsonApiClient } from '@distributedlab/jac';
import { attachBearerInjector, attachStaleTokenHandler } from '@/interceptors';

const axiosInstance = axios.create()
attachBearerInjector(axiosInstance)
attachStaleTokenHandler(axiosInstance)

export const api = new JsonApiClient({
  baseUrl: 'https://api.example.com',
  axios: axiosInstance,
});
```

## Changelog

For the change log, see [CHANGELOG.md](https://github.com/distributed-lab/web-kit/blob/main/CHANGELOG.md).
