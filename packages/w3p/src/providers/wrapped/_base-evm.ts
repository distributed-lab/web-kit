import { TransactionRequest } from '@ethersproject/abstract-provider'
import { Deferrable } from '@ethersproject/properties'
import { ethers, providers } from 'ethers'

import { CHAIN_TYPES, PROVIDER_EVENTS } from '@/enums'
import {
  connectEthAccounts,
  getEthExplorerAddressUrl,
  getEthExplorerTxUrl,
  handleEthError,
  hexToDecimal,
  requestAddEthChain,
  requestSwitchEthChain,
} from '@/helpers'
import {
  Chain,
  ChainId,
  EthProviderRpcError,
  ProviderProxy,
  RawProvider,
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
    this.#provider = new ethers.providers.Web3Provider(
      provider as ethers.providers.ExternalProvider,
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

  getRawProvider(): providers.Web3Provider {
    return this.#provider
  }

  getRawSigner(): providers.JsonRpcSigner {
    return this.#provider.getSigner()
  }

  async init(): Promise<void> {
    await this.#setListeners()
    const currentAccounts = await this.#provider.listAccounts()
    this.#address = currentAccounts[0]

    this.emitInitiated({
      chainId: this.#chainId,
      address: this.#address,
      isConnected: this.isConnected,
    })
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

  async signAndSendTx(tx: TxRequestBody): Promise<TransactionResponse> {
    try {
      this.emitBeforeTxSent(tx)
      const transactionResponse = await this.#provider
        .getSigner()
        .sendTransaction(tx as Deferrable<TransactionRequest>)

      this.emitAfterTxSent({
        txHash: transactionResponse.hash,
      })

      const receipt = await transactionResponse.wait()

      this.emitAfterTxConfirmed(receipt)

      return receipt
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }

    return ''
  }

  async #setListeners() {
    const stubProvider = this.#provider.provider as providers.BaseProvider

    stubProvider.on(PROVIDER_EVENTS.Connect, async () => {
      const currentAccounts = await this.#provider.listAccounts()
      this.#address = currentAccounts[0] ?? ''

      this.emitConnect({
        address: this.#address,
        isConnected: this.isConnected,
      })
    })

    stubProvider.on(PROVIDER_EVENTS.Disconnect, () => {
      this.#address = ''

      this.emitDisconnect({
        address: this.#address,
        isConnected: this.isConnected,
      })
    })

    stubProvider.on(PROVIDER_EVENTS.AccountsChanged, async () => {
      const currentAccounts = await this.#provider.listAccounts()
      this.#address = currentAccounts[0] ?? ''

      this.emitAccountChanged({
        address: this.#address,
        isConnected: this.isConnected,
      })
    })

    stubProvider.on(PROVIDER_EVENTS.ChainChanged, (chainId: ChainId) => {
      this.#chainId = hexToDecimal(chainId)

      this.emitChainChanged({
        chainId: this.#chainId,
      })
    })
  }
}
