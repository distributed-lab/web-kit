import { PublicKey } from '@solana/web3.js'

import {
  CHAIN_TYPES,
  PROVIDER_EVENT_BUS_EVENTS,
  PROVIDER_EVENTS,
  SOLANA_CHAINS,
} from '@/enums'
import {
  getSolExplorerAddressUrl,
  getSolExplorerTxUrl,
  handleSolError,
} from '@/helpers/solana'
import type {
  Chain,
  ChainId,
  ProviderProxy,
  RawProvider,
  SolanaProvider,
  SolanaProviderRpcError,
  SolanaTransactionResponse,
  TransactionResponse,
  TxRequestBody,
} from '@/types'

import { ProviderEventBus } from './_event-bus'

const getAddress = (publicKey: PublicKey | null): string => {
  return publicKey ? new PublicKey(publicKey).toBase58() : ''
}

export class BaseSolanaProvider
  extends ProviderEventBus
  implements ProviderProxy
{
  readonly #provider: SolanaProvider
  #rawProvider: RawProvider

  #chainId?: ChainId
  #address?: string

  constructor(provider: RawProvider) {
    super()
    this.#provider = provider as SolanaProvider

    this.#rawProvider = provider
  }

  get chainType(): CHAIN_TYPES {
    return CHAIN_TYPES.Solana
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

  get provider(): SolanaProvider {
    return this.#provider
  }

  get rawProvider(): RawProvider {
    return this.#rawProvider
  }

  get #defaultEventPayload() {
    return {
      chainId: this.#chainId,
      address: this.#address,
      isConnected: this.isConnected,
    }
  }

  async init(): Promise<void> {
    this.#setListeners()
    this.#address = getAddress(this.#provider.publicKey)
    this.#chainId = SOLANA_CHAINS.DevNet

    this.emit(PROVIDER_EVENT_BUS_EVENTS.Initiated, this.#defaultEventPayload)
  }

  async switchChain(chainId: ChainId) {
    try {
      this.#chainId = chainId
      this.emit(
        PROVIDER_EVENT_BUS_EVENTS.ChainChanged,
        this.#defaultEventPayload,
      )
    } catch (error) {
      handleSolError(error as SolanaProviderRpcError)
    }
  }

  async connect(): Promise<void> {
    try {
      await this.#provider.connect()
    } catch (error) {
      handleSolError(error as SolanaProviderRpcError)
    }
  }

  getAddressUrl(chain: Chain, address: string): string {
    return getSolExplorerAddressUrl(chain, address)
  }

  getTxUrl(chain: Chain, txHash: string): string {
    return getSolExplorerTxUrl(chain, txHash)
  }

  getHashFromTx(txResponse: TransactionResponse): string {
    return txResponse as SolanaTransactionResponse
  }

  async signAndSendTx(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    txRequestBody: TxRequestBody,
  ): Promise<TransactionResponse> {
    throw new TypeError('Method should be implemented in extender class')
  }

  #setListeners() {
    this.#provider.on(PROVIDER_EVENTS.Connect, () => {
      this.#address = getAddress(this.#provider.publicKey)

      this.emit(PROVIDER_EVENT_BUS_EVENTS.Connect, this.#defaultEventPayload)
    })

    this.#provider.on(PROVIDER_EVENTS.Disconnect, () => {
      this.#address = getAddress(this.#provider.publicKey)

      this.emit(PROVIDER_EVENT_BUS_EVENTS.Disconnect, this.#defaultEventPayload)
    })

    this.#provider.on(PROVIDER_EVENTS.AccountChanged, () => {
      this.#address = getAddress(this.#provider.publicKey)

      this.emit(
        PROVIDER_EVENT_BUS_EVENTS.AccountChanged,
        this.#defaultEventPayload,
      )
    })
  }
}
