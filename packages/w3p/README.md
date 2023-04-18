# @web-kit/w3p
Features of the Rarimo SDK that provide access to users' wallets and map extensions for multiple types of wallets (EVM and non-EVM) to a common wallet interface.

![version (scoped package)](https://badgen.net/npm/v/@rarimo/provider)
![types](https://badgen.net/npm/types/@rarimo/provider)
![tree-shaking](https://badgen.net/bundlephobia/tree-shaking/@rarimo/provider)
![checks](https://badgen.net/github/checks/rarimo/js-sdk/main)

## Example

For example applications, see [@distributedlab/js-sdk-examples](https://github.com/rarimo/js-sdk-examples/) on GitHub.

Here is an example that creates a `MetamaskProvider` object for a MetaMask wallet and prints its address:

```js
import { createProvider, MetamaskProvider } from '@rarimo/provider'

const getMetamaskWalletAddress = async () => {
  // Connect to the Metamask wallet in the browser using Web3.js, using the MetamaskProvider interface to limit bundle size.
  const provider = await createProvider(MetamaskProvider)
  await provider.connect()

  // Get the address of the wallet
  console.log(provider.address)
}
```

## Changelog

For the change log, see [CHANGELOG.md](https://github.com/rarimo/js-sdk/blob/main/CHANGELOG.md).
