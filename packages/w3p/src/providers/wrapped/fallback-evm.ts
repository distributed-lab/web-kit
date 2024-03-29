import { providers } from 'ethers'

import { CHAIN_TYPES, PROVIDER_EVENT_BUS_EVENTS, PROVIDERS } from '@/enums'
import {
  getEthExplorerAddressUrl,
  getEthExplorerTxUrl,
  hexToDecimal,
} from '@/helpers'
import type {
  Chain,
  ChainId,
  EthTransactionResponse,
  ProviderProxy,
  RawProvider,
  SolanaTransactionResponse,
  TransactionResponse,
} from '@/types'

import { ProviderEventBus } from './_event-bus'

export class FallbackEvmProvider
  extends ProviderEventBus
  implements ProviderProxy
{
  provider: providers.Web3Provider
  rawProvider: RawProvider

  chainId?: ChainId
  address?: string

  constructor(provider: RawProvider) {
    super()

    this.provider = provider as unknown as providers.Web3Provider
    this.rawProvider = provider
  }

  static get providerType(): string {
    return PROVIDERS.Fallback
  }

  get chainType(): CHAIN_TYPES {
    return CHAIN_TYPES.EVM
  }

  get isConnected(): boolean {
    return Boolean(this.chainId)
  }

  get defaultEventPayload() {
    return {
      address: this.address,
      chainId: this.chainId,
      isConnected: this.isConnected,
    }
  }

  async init(): Promise<void> {
    const network = await this.provider.getNetwork()

    this.chainId = hexToDecimal(network.chainId as ChainId)

    this.emit(PROVIDER_EVENT_BUS_EVENTS.Initiated, this.defaultEventPayload)
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
}
