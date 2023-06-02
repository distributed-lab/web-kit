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

For the reactive frameworks such as Vue or react you need to create a wrapper for the provider, which will be used in the application.

here are the the examples for both of them:
- [Vue useProvider composable implementation](https://github.com/distributed-lab/web-kit/blob/main/packages/w3p/examples/vue-use-provider-composable.ts)
- [React useProvider hook implementation](https://github.com/distributed-lab/web-kit/blob/main/packages/w3p/examples/react-use-provider-hook.ts)

The Common usage of w3p with vue [here](https://github.com/distributed-lab/web-kit/blob/main/packages/w3p/examples/multiple-providers.ts)

You can setup pinia js and just copy file content, or use it's callback just for create your own composable

Or if you sure, that you will use only one provider, e.g. Metamask

```ts
import { MetamaskProvider } from "@distributedlab/w3p"

const provider = await createProvider(MetamaskProvider)

await provider.connect()
```

To create your own custom provider, you will need to develop a class that implements the `ProviderProxyConstructor` interface.

#### If your provider is fully EVM-compatible, similar to Metamask or Coinbase, you can extend the `BaseEVMProvider` class as in example.
```ts
export class MyProvider extends BaseEVMProvider implements ProviderProxy {
  constructor(provider: RawProvider) {
    super(provider)
  }

  static get providerType() {
    return EXTERNAL_PROVIDERS.MyProvider
  }
}
```

If your provider has additional functionalities or different implementation of switching, adding a chain, signing and sending transactions methods, and more, you can create a custom class that extends the [ProviderEventBus](https://github.com/distributed-lab/web-kit/blob/main/packages/w3p/src/providers/wrapped/_event-bus.ts) and implements the [ProviderProxy](https://github.com/distributed-lab/web-kit/blob/main/packages/w3p/src/types/provider.ts#L71) interface. This allows you to override functions according to your specific requirements.

To interact with contract check [this example](https://github.com/distributed-lab/web-kit/blob/main/packages/w3p/examples/eth-contract-call.ts)

## License

This project is licensed under the MIT License - see the [LICENSE.md](../../LICENSE) file for details
