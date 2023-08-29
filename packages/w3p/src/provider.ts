import { PROVIDERS } from '@/enums'
import { errors } from '@/errors'
import { ProviderDetector } from '@/provider-detector'

import type {
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
  WalletConnectInitArgs,
} from './types'

export type CreateProviderOpts<T extends keyof Record<string, string>> = {
  providerDetector?: ProviderDetector<T>
  listeners?: ProviderListeners
  initArguments?: WalletConnectInitArgs
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
 *   // Connect to the Metamask wallet in the browser using ethers.js, using the MetamaskProvider interface to limit bundle size.
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

  public static chainsDetails?: Record<ChainId, Chain>

  constructor(proxyConstructor: ProviderProxyConstructor) {
    this.#selectedProvider = undefined
    this.#proxy = undefined
    this.#proxyConstructor = proxyConstructor
  }

  public get rawProvider() {
    return this.#proxy?.rawProvider
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

  public get chainDetails() {
    return Provider.chainsDetails?.[this.chainId!]
  }

  public async init(provider: ProviderInstance, listeners?: ProviderListeners) {
    if (!provider.instance)
      throw new errors.ProviderInjectedInstanceNotFoundError()

    this.#proxy = new this.#proxyConstructor(provider.instance)

    Object.entries(listeners || {}).forEach(([key, value]) => {
      this.#proxy?.[key as keyof ProviderListeners]?.(
        value as (e?: ProviderEventPayload) => void,
      )
    })

    this.#selectedProvider = provider.name
    await this.#proxy?.init()
    return this
  }

  public async connect() {
    if (!this.#proxy) throw new errors.ProviderNotInitializedError()

    await this.#proxy?.connect?.()
  }

  public async switchChain(chainId: ChainId) {
    await this.#proxy?.switchChain?.(chainId)
  }

  public async addChain(chain: Chain) {
    await this.#proxy?.addChain?.(chain)
  }

  public static setChainsDetails(chains: Record<ChainId, Chain>) {
    this.chainsDetails = chains
  }

  public async signAndSendTx(txRequestBody: TxRequestBody) {
    if (this.#proxy?.signAndSendTx) {
      return this.#proxy?.signAndSendTx?.(
        txRequestBody,
      ) as Promise<TransactionResponse>
    }

    throw new errors.ProviderMethodNotSupported()
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

  public onUriUpdate(cb: (e?: ProviderEventPayload) => void): void {
    if (this.#proxy?.onUriUpdate) {
      this.#proxy?.onUriUpdate(cb)
    }
  }

  public onAccountChanged(cb: (e?: ProviderEventPayload) => void): void {
    this.#proxy?.onAccountChanged(cb)
  }

  public onChainChanged(cb: (e?: ProviderEventPayload) => void): void {
    this.#proxy?.onChainChanged?.(cb)
  }

  public onConnect(cb: (e?: ProviderEventPayload) => void): void {
    this.#proxy?.onConnect(cb)
  }

  public onDisconnect(cb: (e?: ProviderEventPayload) => void): void {
    this.#proxy?.onDisconnect(cb)
  }

  public onInitiated(cb: (e?: ProviderEventPayload) => void): void {
    this.#proxy?.onInitiated(cb)
  }

  public clearHandlers(): void {
    this.#proxy?.clearHandlers()
  }

  public onBeforeTxSent(cb: (e?: ProviderEventPayload) => void) {
    this.#proxy?.onBeforeTxSent(cb)
  }

  public onTxSent(cb: (e?: ProviderEventPayload) => void) {
    this.#proxy?.onTxSent(cb)
  }

  public onTxConfirmed(cb: (e?: ProviderEventPayload) => void) {
    this.#proxy?.onTxConfirmed(cb)
  }

  public async disconnect() {
    await this.#proxy?.disconnect?.()
  }
}

/**
 * @description Creates an instance of a wallet provider
 *
 * @example
 * const provider = await createProvider(MetamaskProvider)
 * await provider.init()
 * // or
 * const providerDetectorInstance = await new ProviderDetector().init()
 * const metamaskProvider = await createProvider(MetamaskProvider, { providerDetectorInstance })
 * const phantomProvider = await createProvider(PhantomProvider, { providerDetectorInstance })
 */
export async function createProvider<T extends keyof Record<string, string>>(
  proxy: ProviderProxyConstructor,
  opts: CreateProviderOpts<T> = {},
): Promise<Provider> {
  const {
    providerDetector: providerDetectorInstance,
    listeners,
    initArguments,
  } = opts

  const provider = new Provider(proxy)
  const providerDetector = providerDetectorInstance || new ProviderDetector()

  if (
    !providerDetector.isInitiated &&
    proxy.providerType !== PROVIDERS.WalletConnect
  ) {
    await providerDetector.init()
    const providerInstance = providerDetector.getProvider(
      proxy.providerType as PROVIDERS,
    )

    if (!providerInstance)
      throw new errors.ProviderInjectedInstanceNotFoundError()
    return provider.init(providerInstance, listeners)
  }

  return provider.init(
    {
      name: proxy.providerType,
      instance: initArguments,
    } as ProviderInstance,
    listeners,
  )
}
