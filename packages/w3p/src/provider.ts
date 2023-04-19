import { PROVIDERS } from '@/enums'
import { errors } from '@/errors'
import { ProviderDetector } from '@/provider-detector'

import {
  Chain,
  ChainId,
  IProvider,
  ProviderEventPayload,
  ProviderInstance,
  ProviderListeners,
  ProviderProxy,
  ProviderProxyConstructor,
  TransactionResponse,
  TxRequestBody,
} from './types'

export type CreateProviderOpts = {
  web3Instance?: ProviderDetector
  listeners?: ProviderListeners
}

/**
 * @description Represents a browser-based wallet.
 *
 * To connect to a wallet, create an object to represent the wallet to access with the `createProvider()` method. These wallet objects implement the `Provider` interface so you can access different types of wallets in a consistent way.
 *
 * @example
 * ```js
 * import { createProvider, MetamaskProvider } from '@rarimo/provider'
 *
 * const getMetamaskWalletAddress = async () => {
 *   // Connect to the Metamask wallet in the browser using Web3.js, using the MetamaskProvider interface to limit bundle size.
 *   const provider = await createProvider(MetamaskProvider)
 *
 *   // Get the address of the wallet
 *   console.log(provider.address)
 * }
 * ```
 */
export class Provider implements IProvider {
  readonly #proxyConstructor: ProviderProxyConstructor
  #selectedProvider?: PROVIDERS
  #proxy?: ProviderProxy

  constructor(proxyConstructor: ProviderProxyConstructor) {
    this.#selectedProvider = undefined
    this.#proxy = undefined
    this.#proxyConstructor = proxyConstructor
  }

  public get chainType() {
    return this.#proxy?.chainType
  }

  public get providerType() {
    return this.#selectedProvider
  }

  public get isConnected() {
    return Boolean(this.chainId && this.address)
  }

  public get address() {
    return this.#proxy?.address
  }

  public get chainId() {
    return this.#proxy?.chainId
  }

  public async init(provider: ProviderInstance, listeners?: ProviderListeners) {
    if (provider.instance) {
      this.#proxy = new this.#proxyConstructor(provider.instance)

      Object.entries(listeners || {}).forEach(([key, value]) => {
        this.#proxy?.[key as keyof ProviderListeners]?.(
          value as (e: ProviderEventPayload) => void,
        )
      })
    }

    this.#selectedProvider = provider.name
    await this.#proxy?.init()
    return this
  }

  public async connect() {
    if (!this.#proxy) throw new errors.ProviderNotInitializedError()

    await this.#proxy.connect()
  }

  public async switchChain(chainId: ChainId) {
    await this.#proxy?.switchChain?.(chainId)
  }

  public async addChain(chain: Chain) {
    await this.#proxy?.addChain?.(chain)
  }

  public async signAndSendTx(txRequestBody: TxRequestBody) {
    return this.#proxy?.signAndSendTx?.(
      txRequestBody,
    ) as Promise<TransactionResponse>
  }

  public getHashFromTx(txResponse: TransactionResponse) {
    return this.#proxy?.getHashFromTx?.(txResponse) ?? ''
  }

  public getTxUrl(chain: Chain, txHash: string) {
    return this.#proxy?.getTxUrl?.(chain, txHash) ?? ''
  }

  public getAddressUrl(chain: Chain, address: string) {
    return this.#proxy?.getAddressUrl?.(chain, address) ?? ''
  }

  public async signMessage(message: string) {
    return this.#proxy?.signMessage?.(message) ?? ''
  }

  public get getRawProvider() {
    if (this.#proxy?.getRawProvider) {
      return this.#proxy?.getRawProvider
    }

    throw new errors.ProviderMethodNotSupported()
  }

  public get getRawSigner() {
    if (this.#proxy?.getRawSigner) {
      return this.#proxy?.getRawSigner
    }

    throw new errors.ProviderMethodNotSupported()
  }

  public onAccountChanged(cb: (e: ProviderEventPayload) => void): void {
    this.#proxy?.onAccountChanged(cb)
  }

  public onChainChanged(cb: (e: ProviderEventPayload) => void): void {
    this.#proxy?.onChainChanged?.(cb)
  }

  public onConnect(cb: (e: ProviderEventPayload) => void): void {
    this.#proxy?.onConnect(cb)
  }

  public onDisconnect(cb: (e: ProviderEventPayload) => void): void {
    this.#proxy?.onDisconnect(cb)
  }

  public onInitiated(cb: (e: ProviderEventPayload) => void): void {
    this.#proxy?.onInitiated(cb)
  }

  public clearHandlers(): void {
    this.#proxy?.clearHandlers()
  }

  public onBeforeTxSent(cb: (e: ProviderEventPayload) => void) {
    this.#proxy?.onBeforeTxSent(cb)
  }

  public onAfterTxSent(cb: (e: ProviderEventPayload) => void) {
    this.#proxy?.onAfterTxSent(cb)
  }

  public onAfterTxConfirmed(cb: (e: ProviderEventPayload) => void) {
    this.#proxy?.onAfterTxConfirmed(cb)
  }
}

/**
 * @description Creates an instance of a wallet provider
 *
 * @example
 * const provider = await createProvider(MetamaskProvider)
 * // or
 * const web3Instance = await new Web3().init()
 * const metamaskProvider = await createProvider(MetamaskProvider, { web3Instance })
 * const phantomProvider = await createProvider(PhantomProvider, { web3Instance })
 */
export const createProvider = async (
  proxy: ProviderProxyConstructor,
  opts: CreateProviderOpts = {},
): Promise<Provider> => {
  const { web3Instance, listeners } = opts

  const provider = new Provider(proxy)
  const web3 = web3Instance || new ProviderDetector()

  if (!web3.initiated) {
    await web3.init()
  }

  const injected = web3.getProvider(proxy.providerType)

  if (!injected) throw new errors.ProviderInjectedInstanceNotFoundError()

  return provider.init(injected, listeners)
}
