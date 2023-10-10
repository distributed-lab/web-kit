import { WalletConnectModal } from '@walletconnect/modal'
import UniversalProvider from '@walletconnect/universal-provider'
import { providers, utils } from 'ethers'
import { isEmpty } from 'lodash'

import { CHAIN_TYPES, PROVIDER_EVENT_BUS_EVENTS, PROVIDERS } from '@/enums'
import { errors } from '@/errors'
import {
  createWalletConnectEthNamespace,
  getEthExplorerAddressUrl,
  getEthExplorerTxUrl,
  requestAddEthChain,
  requestSwitchEthChain,
} from '@/helpers'
import { Provider } from '@/provider'
import type {
  Chain,
  ChainId,
  EthTransactionResponse,
  ProviderProxy,
  RawProvider,
  TransactionResponse,
  TxRequestBody,
  WalletConnectInitArgs,
} from '@/types'

import { ProviderEventBus } from '../wrapped/_event-bus'

type WalletConnectSessionEvent = {
  params: {
    chainId: string
    event: {
      data: string[]
    }
  }
}

export class WalletConnectEvmProvider
  extends ProviderEventBus
  implements ProviderProxy
{
  #rawProvider: UniversalProvider | null
  #ethProvider: providers.Web3Provider | null

  #w3Modal: WalletConnectModal

  #chainId?: ChainId
  #address?: string

  readonly #projectId: string
  readonly #relayUrl?: string
  readonly #logger?: string

  constructor(provider: RawProvider) {
    super()

    const { projectId, relayUrl, logger } = provider as WalletConnectInitArgs

    if (!projectId) {
      throw new errors.ProviderParseError()
    }

    this.#projectId = projectId
    this.#relayUrl = relayUrl
    this.#logger = logger
    this.#rawProvider = null
    this.#ethProvider = null
    this.#w3Modal = new WalletConnectModal({
      projectId: this.#projectId,
    })
  }

  static get providerType(): PROVIDERS {
    return PROVIDERS.WalletConnect
  }

  get rawProvider(): RawProvider {
    if (!this.#rawProvider) {
      throw new errors.ProviderNotInitializedError()
    }
    return this.#rawProvider as unknown as RawProvider
  }

  get chainType(): CHAIN_TYPES {
    return CHAIN_TYPES.EVM
  }

  get isConnected(): boolean {
    return Boolean(this.#chainId) || Boolean(this.#address)
  }

  get chainId(): ChainId | undefined {
    return this.#chainId
  }

  get address(): string | undefined {
    return this.#address
  }

  async init(): Promise<void> {
    this.#rawProvider = await UniversalProvider.init({
      logger: this.#logger,
      relayUrl: this.#relayUrl,
      projectId: this.#projectId,
    })

    if (this.#rawProvider?.session) {
      this.#ethProvider = new providers.Web3Provider(this.#rawProvider)
    }

    await this.#checkForPersistedSession()

    await this.#setListeners()

    await this.setCustomRpcs()

    this.emit(PROVIDER_EVENT_BUS_EVENTS.Initiated, this.#defaultEventPayload)
  }

  async connect(): Promise<void> {
    if (!this.#rawProvider) {
      throw new errors.ProviderNotInitializedError()
    }

    try {
      await this.#rawProvider.connect({
        namespaces: createWalletConnectEthNamespace(),
        optionalNamespaces: createWalletConnectEthNamespace(),
        skipPairing: true,
      })

      await this.#rawProvider.enable()

      this.#ethProvider = new providers.Web3Provider(this.#rawProvider)

      const accounts = await this.#rawProvider.request<string[]>({
        method: 'eth_requestAccounts',
      })

      this.#chainId =
        this.#rawProvider?.session?.namespaces?.eip155?.chains?.[0]?.split(
          ':',
        )[1]

      this.#address = accounts?.[0]

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

      this.#w3Modal.closeModal()
    } catch (e) {
      this.#w3Modal.closeModal()
      throw e
    }
  }

  async disconnect() {
    if (!this.#rawProvider) {
      throw new errors.ProviderNotInitializedError()
    }
    await this.#rawProvider.disconnect()
    this.#chainId = undefined
    this.#address = undefined
    this.#ethProvider = null
    this.emit(PROVIDER_EVENT_BUS_EVENTS.Disconnect, this.#defaultEventPayload)
  }

  async #checkForPersistedSession() {
    if (!this.#rawProvider) {
      throw new errors.ProviderNotInitializedError()
    }

    if (!this.#rawProvider?.session) return

    this.#chainId = this.#rawProvider?.namespaces?.eip155.defaultChain

    this.#address =
      this.#rawProvider?.session?.namespaces?.eip155?.accounts?.[0]?.split(
        ':',
      )?.[2]
  }

  getAddressUrl(chain: Chain, address: string): string {
    return getEthExplorerAddressUrl(chain, address)
  }

  getTxUrl(chain: Chain, txHash: string): string {
    return getEthExplorerTxUrl(chain, txHash)
  }

  getHashFromTx(txResponse: TransactionResponse): string {
    return (txResponse as EthTransactionResponse).transactionHash
  }

  /**
   * @description Switch the chain with WalletConnect Provider.
   * You should always add a network first with the proper method
   * {@link Provider.setChainDetails} and then change it.
   */

  async switchChain(chainId: ChainId): Promise<void> {
    if (!this.#ethProvider) {
      throw new errors.ProviderDisconnected()
    }

    if (!Provider.chainsDetails) {
      throw new errors.ProviderChainDetailsNotFoundError()
    }

    const foundChain = Provider.chainsDetails[chainId]

    if (!foundChain) {
      throw new errors.ProviderChainNotFoundError()
    }

    await this.addChain(foundChain)

    this.#rawProvider?.setDefaultChain(
      `eip155:${Number(foundChain.id)}`,
      foundChain.rpcUrl,
    )

    await requestSwitchEthChain(this.#ethProvider, foundChain.id)
  }

  async setCustomRpcs() {
    if (isEmpty(Provider.chainsDetails)) {
      return
    }
    await Promise.all(
      Object.entries(Provider.chainsDetails).map(
        async ([chainId, chainInfo]) => {
          const rpcProvider =
            this.#rawProvider?.rpcProviders?.eip155?.httpProviders?.[chainId]
          if (rpcProvider) {
            await rpcProvider.connect(chainInfo.rpcUrl)
          }
        },
      ),
    )
  }

  async addChain(chain: Chain): Promise<void> {
    if (!this.#ethProvider) {
      throw new errors.ProviderDisconnected()
    }

    await requestAddEthChain(this.#ethProvider, chain)
  }

  async signAndSendTx(tx: TxRequestBody): Promise<TransactionResponse> {
    if (!this.#rawProvider) {
      throw new errors.ProviderNotInitializedError()
    }

    this.emit(PROVIDER_EVENT_BUS_EVENTS.BeforeTxSent, {
      txBody: tx,
    })

    const transactionResponse = await this.#ethProvider?.send(
      'eth_sendTransaction',
      [tx],
    )

    this.emit(PROVIDER_EVENT_BUS_EVENTS.TxSent, {
      txHash: transactionResponse?.hash,
    })

    const receipt = await transactionResponse?.wait()

    this.emit(PROVIDER_EVENT_BUS_EVENTS.TxConfirmed, {
      txResponse: receipt,
    })

    return receipt
  }

  async signMessage(message: string): Promise<string> {
    if (!this.#ethProvider || !this.#address) {
      throw new errors.ProviderDisconnected()
    }

    return this.#ethProvider?.send('personal_sign', [
      utils.hexlify(utils.toUtf8Bytes(message)),
      this.#address.toLowerCase(),
    ])
  }

  get #defaultEventPayload() {
    return {
      address: this.#address,
      chainId: this.#chainId,
      isConnected: this.isConnected,
    }
  }

  async #setListeners() {
    if (!this.#rawProvider) {
      throw new errors.ProviderNotInitializedError()
    }

    this.#rawProvider.on('session_event', (e: WalletConnectSessionEvent) => {
      this.#chainId = e?.params?.chainId.split(':')[1] ?? this.#chainId

      this.#address =
        e?.params?.event?.data?.[0]?.split(':')?.[2] ?? this.#address

      this.emit(
        PROVIDER_EVENT_BUS_EVENTS.AccountChanged,
        this.#defaultEventPayload,
      )

      this.emit(
        PROVIDER_EVENT_BUS_EVENTS.ChainChanged,
        this.#defaultEventPayload,
      )

      this.emit(
        this.isConnected
          ? PROVIDER_EVENT_BUS_EVENTS.Connect
          : PROVIDER_EVENT_BUS_EVENTS.Disconnect,
        this.#defaultEventPayload,
      )
    })

    this.#rawProvider.on('session_delete', () => {
      this.emit(PROVIDER_EVENT_BUS_EVENTS.Disconnect, this.#defaultEventPayload)
    })

    this.#rawProvider.on('display_uri', (uri: string) => {
      this.#w3Modal.openModal({ uri })
    })
  }
}
