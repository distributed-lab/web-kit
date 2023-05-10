import type { TransactionRequest } from '@ethersproject/abstract-provider'
import type { Deferrable } from '@ethersproject/properties'
import { providers } from 'ethers'

import {
  CHAIN_TYPES,
  PROVIDER_EVENT_BUS_EVENTS,
  PROVIDER_EVENTS,
} from '@/enums'
import {
  connectEthAccounts,
  getEthExplorerAddressUrl,
  getEthExplorerTxUrl,
  handleEthError,
  hexToDecimal,
  requestAddEthChain,
  requestSwitchEthChain,
} from '@/helpers'
import type {
  Chain,
  ChainId,
  EthProviderRpcError,
  EthTransactionResponse,
  ProviderProxy,
  RawProvider,
  SolanaTransactionResponse,
  TransactionResponse,
  TxRequestBody,
} from '@/types'

import { ProviderEventBus } from './_event-bus'

export class BaseEVMProvider extends ProviderEventBus implements ProviderProxy {
  readonly #provider: providers.Web3Provider

  #chainId?: ChainId
  #address?: string

  constructor(provider: RawProvider) {
    super()
    this.#provider = new providers.Web3Provider(
      wrapExternalProvider(provider as providers.ExternalProvider),
      'any',
    )
  }

  get chainType(): CHAIN_TYPES {
    return CHAIN_TYPES.EVM
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
      address: this.#address,
      chainId: this.#chainId,
      isConnected: this.isConnected,
    }
  }

  async init(): Promise<void> {
    await this.#setListeners()
    const currentAccounts = await this.#provider.listAccounts()
    const network = await this.#provider.getNetwork()

    this.#address = currentAccounts[0]
    this.#chainId = hexToDecimal(network.chainId as ChainId)

    this.emit(PROVIDER_EVENT_BUS_EVENTS.Initiated, this.#defaultEventPayload)
  }

  async switchChain(chainId: ChainId): Promise<void> {
    try {
      await requestSwitchEthChain(this.#provider, chainId)
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  async addChain(chain: Chain): Promise<void> {
    try {
      await requestAddEthChain(
        this.#provider,
        Number(chain.id),
        chain.name,
        chain.rpcUrl,
      )
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  async connect(): Promise<void> {
    try {
      await connectEthAccounts(this.#provider)
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
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

  async signAndSendTx(tx: TxRequestBody): Promise<TransactionResponse> {
    try {
      this.emit(PROVIDER_EVENT_BUS_EVENTS.BeforeTxSent, {
        txBody: tx,
      })
      const transactionResponse = await this.#provider
        .getSigner()
        .sendTransaction(tx as Deferrable<TransactionRequest>)

      this.emit(PROVIDER_EVENT_BUS_EVENTS.TxSent, {
        txHash: transactionResponse.hash,
      })

      const receipt = await transactionResponse.wait()

      this.emit(PROVIDER_EVENT_BUS_EVENTS.TxConfirmed, {
        txResponse: receipt,
      })

      return receipt
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }

    return ''
  }

  async #setListeners() {
    const stubProvider = this.#provider.provider as providers.BaseProvider

    stubProvider.on(PROVIDER_EVENTS.AccountsChanged, async () => {
      const currentAccounts = await this.#provider.listAccounts()
      this.#address = currentAccounts[0] ?? ''

      this.emit(
        PROVIDER_EVENT_BUS_EVENTS.AccountChanged,
        this.#defaultEventPayload,
      )
      this.emit(
        this.isConnected
          ? PROVIDER_EVENT_BUS_EVENTS.Connect
          : PROVIDER_EVENT_BUS_EVENTS.Disconnect,
        this.#defaultEventPayload,
      )
    })

    stubProvider.on(PROVIDER_EVENTS.ChainChanged, (chainId: ChainId) => {
      this.#chainId = hexToDecimal(chainId)

      this.emit(
        PROVIDER_EVENT_BUS_EVENTS.ChainChanged,
        this.#defaultEventPayload,
      )
    })
  }
}

const wrapExternalProvider = (
  provider: providers.ExternalProvider,
): providers.ExternalProvider => ({
  ...provider,
  sendAsync: provider?.sendAsync?.bind(provider),
  send: provider?.send?.bind(provider),
  async request(request: {
    method: string
    params?: Array<unknown>
  }): Promise<unknown> {
    let result: unknown
    try {
      result = await provider?.request?.(request)
    } catch (e) {
      handleEthError(e as EthProviderRpcError)
    }
    return result
  },
})
