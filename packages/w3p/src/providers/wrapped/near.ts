import { NEAR_CHAINS, PROVIDER_EVENT_BUS_EVENTS, PROVIDERS } from '@/enums'
import {
  getNearExplorerAddressUrl,
  getNearExplorerTxUrl,
  handleNearError,
} from '@/helpers/near'
import type {
  Chain,
  ChainId,
  NearProviderRpcError,
  NearRawProvider,
  NearTransactionResponse,
  NearTxRequestBody,
  ProviderProxy,
  RawProvider,
  TransactionResponse,
  TxRequestBody,
} from '@/types'

import { ProviderEventBus } from './_event-bus'

export class NearProvider extends ProviderEventBus implements ProviderProxy {
  readonly #provider: NearRawProvider
  #rawProvider: RawProvider

  #chainId?: ChainId
  #address?: string

  constructor(provider: RawProvider) {
    super()

    this.#provider = provider as NearRawProvider
    this.#rawProvider = provider
  }
  static get providerType(): PROVIDERS {
    return PROVIDERS.Near
  }

  get rawProvider(): RawProvider {
    return this.#rawProvider
  }

  get isConnected(): boolean {
    return Boolean(this.#chainId && this.#address)
  }

  get chainId(): ChainId | undefined {
    return this.#chainId
  }

  get address(): string | undefined {
    return this.#address
  }

  get #defaultEventPayload() {
    return {
      chainId: this.#chainId,
      address: this.#address,
      isConnected: this.isConnected,
    }
  }

  async init(): Promise<void> {
    try {
      await this.#provider.init()
      this.#updateProviderState()

      this.emit(PROVIDER_EVENT_BUS_EVENTS.Initiated, this.#defaultEventPayload)
    } catch (error) {
      handleNearError(error as NearProviderRpcError)
    }
  }

  #updateProviderState(): void {
    const networkId = this.#provider.selector?.options.network.networkId

    this.#address = this.#provider?.accountId || ''
    this.#chainId = networkId || NEAR_CHAINS.TestNet
  }

  async switchChain(chainId: ChainId): Promise<void> {
    this.#chainId = chainId

    this.emit(PROVIDER_EVENT_BUS_EVENTS.ChainChanged, this.#defaultEventPayload)
  }

  async connect(): Promise<void> {
    try {
      await this.#provider.signIn()
      await this.#updateProviderState()

      this.emit(PROVIDER_EVENT_BUS_EVENTS.Connect, this.#defaultEventPayload)
    } catch (error) {
      handleNearError(error as NearProviderRpcError)
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.#provider.signOut()
      this.#updateProviderState()

      this.emit(PROVIDER_EVENT_BUS_EVENTS.Disconnect, this.#defaultEventPayload)
    } catch (error) {
      handleNearError(error as NearProviderRpcError)
    }
  }

  getHashFromTxResponse(txResponse: TransactionResponse): string {
    const transactionResponse = txResponse as NearTransactionResponse

    return transactionResponse.map(el => el.transaction.hash).join(',')
  }

  getTxUrl(chain: Chain, txHash: string): string {
    return getNearExplorerTxUrl(chain, txHash)
  }

  getAddressUrl(chain: Chain, address: string): string {
    return getNearExplorerAddressUrl(chain, address)
  }

  async signAndSendTx(
    txRequestBody: TxRequestBody,
  ): Promise<TransactionResponse> {
    try {
      this.emit(PROVIDER_EVENT_BUS_EVENTS.BeforeTxSent, {
        txBody: txRequestBody,
      })

      const txResponse = (await this.#provider.signAndSendTxs(
        txRequestBody as NearTxRequestBody,
      )) as TransactionResponse

      this.emit(PROVIDER_EVENT_BUS_EVENTS.TxSent, { txResponse })

      return txResponse
    } catch (error) {
      handleNearError(error as NearProviderRpcError)
    }
  }
}
