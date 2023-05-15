import { providers } from 'ethers'

import {
  CHAIN_TYPES,
  PROVIDER_EVENT_BUS_EVENTS,
  PROVIDER_EVENTS,
  PROVIDERS,
} from '@/enums'
import { ProviderMethodNotSupported } from '@/errors'
import {
  getEthExplorerAddressUrl,
  getEthExplorerTxUrl,
  hexToDecimal,
} from '@/helpers'
import { ProviderEventBus } from '@/providers'
import type {
  Chain,
  ChainId,
  EthTransactionResponse,
  ProviderProxy,
  RawProvider,
  SolanaTransactionResponse,
  TransactionResponse,
} from '@/types'

export class FallbackEvmProvider
  extends ProviderEventBus
  implements ProviderProxy
{
  #provider: providers.Web3Provider

  #chainId?: ChainId
  #address?: string

  constructor(provider: RawProvider) {
    super()
    this.#provider = provider as unknown as providers.Web3Provider
  }

  static get providerType(): PROVIDERS {
    return PROVIDERS.Fallback
  }

  get chainType(): CHAIN_TYPES {
    return CHAIN_TYPES.EVM
  }

  get isConnected(): boolean {
    return Boolean(this.#chainId)
  }

  get chainId(): ChainId | undefined {
    return this.#chainId
  }

  get address(): string | undefined {
    return this.#address
  }

  get #defaultEventPayload() {
    return {
      address: this.#address,
      chainId: this.#chainId,
      isConnected: this.isConnected,
    }
  }

  async init(): Promise<void> {
    await this.#setListeners()
    const network = await this.#provider.getNetwork()

    this.#chainId = hexToDecimal(network.chainId as ChainId)

    this.emit(PROVIDER_EVENT_BUS_EVENTS.Initiated, this.#defaultEventPayload)
  }

  async switchChain(chainId: ChainId): Promise<void> {
    this.#provider = new providers.JsonRpcProvider(
      String(chainId),
      'any',
    ) as unknown as providers.Web3Provider

    await this.init()
  }

  async connect(): Promise<void> {
    throw new ProviderMethodNotSupported()
  }

  getAddressUrl(chain: Chain, address: string): string {
    return getEthExplorerAddressUrl(chain, address)
  }

  getTxUrl(chain: Chain, txHash: string): string {
    return getEthExplorerTxUrl(chain, txHash)
  }

  getHashFromTx(txResponse: TransactionResponse): string {
    return (txResponse as EthTransactionResponse)
      .transactionHash as SolanaTransactionResponse
  }

  async #setListeners() {
    const stubProvider = this.#provider as providers.BaseProvider

    stubProvider.on(PROVIDER_EVENTS.ChainChanged, (chainId: ChainId) => {
      this.#chainId = hexToDecimal(chainId)

      this.emit(
        PROVIDER_EVENT_BUS_EVENTS.ChainChanged,
        this.#defaultEventPayload,
      )
    })
  }
}
