# @distributedlab/w3p
These packages aim to provide developers with a set of commonly used functions and features for building web applications, such as handling big numbers, date manipulation, subscribing to and receiving notifications when certain events occur with EventEmitter, and more.

![version (scoped package)](https://badgen.net/npm/v/@distributedlab/w3p)
![types](https://badgen.net/npm/types/@distributedlab/w3p)
![tree-shaking](https://badgen.net/bundlephobia/tree-shaking/@distributedlab/w3p)
![checks](https://badgen.net/github/checks/distributed-lab/web-kit/main)

## Getting Started

### Installing

```
yarn add @distributedlab/w3p
```

## Example

In the case, when you need to check which injected providers do user have in his browser

```ts
import {
  ProviderDetector,
  MetamaskProvider,
  CoinbaseProvider,
  ProviderProxyConstructor,
  PROVIDERS,
  createProvider,
} from "@distributedlab/w3p"

const providerDetector = new ProviderDetector()

await providerDetector.init()

const supportedProviders = {
  [PROVIDERS.Metamask]: MetamaskProvider as ProviderProxyConstructor,
  [PROVIDERS.Coinbase]: CoinbaseProvider as ProviderProxyConstructor,
} as Record<PROVIDERS, ProviderProxyConstructor>

const providerProxyConstructor = supportedProviders[providerType] as ProviderProxyConstructor

const provider = await createProvider(providerProxyConstructor, {
  providerDetectorInstance: providerDetector,
  listeners: {
    ...yourListeners,
  },
})

await provider.connect()
```

Or if you sure, that you will use only one provider, e.g. Metamask

```ts
import { MetamaskProvider } from "@distributedlab/w3p"

const provider = await createProvider(MetamaskProvider)

await provider.connect()
```

## License

This project is licensed under the MIT License - see the [LICENSE.md](../../LICENSE) file for details
