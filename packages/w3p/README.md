# @distributedlab/w3p

The Web3 provider wrapper with a common interface to easily interact with different types of blockchains.

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
  ProviderConstructorMap,
  createProvider,
} from "@distributedlab/w3p"

const providerDetector = new ProviderDetector()

await providerDetector.init()

const supportedProviders: ProviderConstructorMap = {
  [PROVIDERS.Metamask]: MetamaskProvider,
  [PROVIDERS.Coinbase]: CoinbaseProvider,
}

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

## More examples
Check out more examples and use-cases:

- [Vue useProvider hook implementation](./examples/vue-use-provider-hook.ts)
- [React useProvider hook implementation](./examples/react-use-provider-hook.ts)
- [Multiple providers with the current selected one](./examples/multiple-providers.ts)
- [Ethereum contract interaction](./examples/eth-contract-call.ts)

## License

This project is licensed under the MIT License - see the [LICENSE.md](../../LICENSE) file for details
