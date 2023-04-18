import { NEAR_CHAINS, PROVIDERS } from '@/enums'
import {
  getNearExplorerAddressUrl,
  getNearExplorerTxUrl,
  handleNearError,
} from '@/helpers'
import {
  Chain,
  ChainId,
  NearProviderRpcError,
  NearProviderType,
  NearTransactionResponse,
  NearTxRequestBody,
  ProviderProxy,
  RawProvider,
  TransactionResponse,
  TxRequestBody,
} from '@/types'

import { ProviderEventBus } from './_event-bus'

export class NearProvider extends ProviderEventBus implements ProviderProxy {
  readonly #provider: NearProviderType

  #chainId?: ChainId
  #address?: string

  constructor(provider: RawProvider) {
    super()
    this.#provider = provider as NearProviderType
  }
  static get providerType(): PROVIDERS {
    return PROVIDERS.Near
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

  async init(): Promise<void> {
    try {
      await this.#provider.init()
      this.#updateProviderState()

      this.emitInitiated({
        chainId: this.#chainId,
        address: this.#address,
        isConnected: this.isConnected,
      })
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
    this.emitChainChanged({ chainId })
  }

  async connect(): Promise<void> {
    try {
      await this.#provider.signIn()
      await this.#updateProviderState()
      this.emitConnect({
        address: this.#address,
        isConnected: this.isConnected,
      })
    } catch (error) {
      handleNearError(error as NearProviderRpcError)
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.#provider.signOut()
      this.#updateProviderState()
    } catch (error) {
      handleNearError(error as NearProviderRpcError)
    }
  }

  getHashFromTxResponse(txResponse: TransactionResponse): string {
    const transactionResponse = txResponse as NearTransactionResponse

    return transactionResponse.transaction.hash
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
      return await this.#provider.signAndSendTx(
        txRequestBody as NearTxRequestBody,
      )
    } catch (error) {
      handleNearError(error as NearProviderRpcError)
    }
  }
}
