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

or when you need to implement a custom provider outside of the library

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

enum EXTERNAL_PROVIDERS {
    TokenE = 'tokene',
}

type SUPPORTED_PROVIDERS = EXTERNAL_PROVIDERS | PROVIDERS

const providerDetector = new ProviderDetector<EXTERNAL_PROVIDERS>()

const init = async (providerType: SUPPORTED_PROVIDERS) => {
  await providerDetector.init()

  const supportedProviders: {
    [key in SUPPORTED_PROVIDERS]?: ProviderProxyConstructor
  } = {
    [PROVIDERS.Fallback]: FallbackProvider,
    [PROVIDERS.Metamask]: MetamaskProvider,
    [PROVIDERS.Coinbase]: CoinbaseProvider,
    [EXTERNAL_PROVIDERS.TokenE]: TokenEProvider,
  }

  const currentProviderType: SUPPORTED_PROVIDERS =
    providerType ?? storageState.value.providerType ?? PROVIDERS.Fallback

  const providerProxyConstructor: ProviderProxyConstructor =
    supportedProviders[currentProviderType]!

  const provider = await createProvider(providerProxyConstructor, {
    providerDetectorInstance: providerDetector,
    listeners: {
      ...yourListeners,
    },
  })

  await provider.connect()
}

init()
```

Or if you sure, that you will use only one provider, e.g. Metamask

```ts
import { MetamaskProvider } from "@distributedlab/w3p"

const provider = await createProvider(MetamaskProvider)

await provider.connect()
```

To implement your own custom provider, you need to create class, which implement `ProviderProxyConstructor` interface.

### For example your provider is fully evm compatible as like as metamask or coinbase, so you can use `BaseEVMProvider` class
```ts
export class TokenEProvider extends BaseEVMProvider implements ProviderProxy {
  constructor(provider: RawProvider) {
    super(provider)
  }

  static get providerType() {
    return EXTERNAL_PROVIDERS.TokenE
  }
}
```

Or if your provider has its own method to switch, add chain, sign and send transactions, ...etc, you can create your own class, extends [`ProviderEventBus`](./src/providers/wrapped/_event-bus.ts) and implements [`ProviderProxy`](./src/types/provider.ts?plain=71), then override functions as you wish

## More examples
Check out more examples and use-cases:

- [Vue useProvider hook implementation](./examples/vue-use-provider-hook.ts)
- [React useProvider hook implementation](./examples/react-use-provider-hook.ts)
- [Multiple providers with the current selected one](./examples/multiple-providers.ts)
- [Ethereum contract interaction](./examples/eth-contract-call.ts)

## License

This project is licensed under the MIT License - see the [LICENSE.md](../../LICENSE) file for details
