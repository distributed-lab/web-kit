import { DECIMALS } from '@distributedlab/tools'
import Provider, { EthereumProvider } from '@walletconnect/ethereum-provider'
import { providers, utils } from 'ethers'

import {
  CHAIN_TYPES,
  PROVIDER_EVENT_BUS_EVENTS,
  PROVIDER_EVENTS,
  PROVIDERS,
} from '@/enums'
import { getEthExplorerAddressUrl, getEthExplorerTxUrl } from '@/helpers'
import type {
  Chain,
  ChainId,
  EthTransactionResponse,
  ProviderEventPayload,
  ProviderProxy,
  RawProvider,
  SolanaTransactionResponse,
  TransactionResponse,
  TxRequestBody,
  WalletConnectInitArgs,
} from '@/types'

import { ProviderEventBus } from './_event-bus'

export class WalletConnectEvmProvider
  extends ProviderEventBus
  implements ProviderProxy
{
  #provider: Provider
  #ethProvider: providers.Web3Provider

  #chainId?: ChainId
  #address?: string
  #connectUri?: string

  readonly #projectId: string
  readonly #currentChains: WalletConnectInitArgs['currentChains']
  readonly #optionalChains: WalletConnectInitArgs['optionalChains']

  constructor(provider: RawProvider) {
    super()

    if (!(provider as WalletConnectInitArgs).projectId) {
      throw new Error('projectId is required for WalletConnect provider')
    }

    const { projectId, currentChains, optionalChains } =
      provider as WalletConnectInitArgs
    this.#projectId = projectId
    this.#currentChains = currentChains
    this.#optionalChains = optionalChains
    this.#provider = new Provider()
    this.#ethProvider = new providers.Web3Provider(this.#provider)
  }

  static get providerType(): PROVIDERS {
    return PROVIDERS.WalletConnect
  }

  get rawProvider() {
    return this.#provider as unknown as RawProvider
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

  get connectUri(): string | undefined {
    return this.#connectUri
  }

  get address(): string | undefined {
    return this.#address
  }

  get #defaultEventPayload() {
    return {
      address: this.#address,
      chainId: this.#chainId,
      isConnected: this.isConnected,
      connectUri: this.#connectUri,
    }
  }

  async init(): Promise<void> {
    this.#provider = await EthereumProvider.init({
      projectId: this.#projectId,
      chains: this.#currentChains,
      optionalChains: this.#optionalChains as number[],
      showQrModal: false,
      methods: [
        'wallet_switchEthereumChain',
        'wallet_addEthereumChain',
        'eth_requestAccounts',

        'eth_sendTransaction',

        'eth_sign',
        'personal_sign',
        'eth_signTypedData',
      ],
      events: [
        PROVIDER_EVENTS.Connect,
        PROVIDER_EVENTS.Disconnect,
        PROVIDER_EVENTS.ChainChanged,
        PROVIDER_EVENTS.AccountsChanged,
      ],
      optionalEvents: [],
    })

    this.#ethProvider = new providers.Web3Provider(this.#provider)

    await this.#checkForPersistedSession()

    await this.#setListeners()

    this.emit(PROVIDER_EVENT_BUS_EVENTS.Initiated, this.#defaultEventPayload)
  }

  async connect(): Promise<void> {
    await this.#provider.connect()

    await this.#provider.enable()

    const accounts = await this.#provider.request<string[]>({
      method: 'eth_requestAccounts',
    })

    this.#chainId =
      this.#provider?.session?.namespaces?.eip155?.chains?.[0]?.split(':')[1]

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
  }

  async #checkForPersistedSession() {
    if (!this.#provider) {
      throw new ReferenceError('EthereumProvider is not initialized.')
    }

    if (!this.#provider?.session) return

    this.#chainId =
      this.#provider?.session?.namespaces?.eip155?.chains?.[0]?.split(':')[1]

    this.#address =
      this.#provider?.session?.namespaces?.eip155?.accounts?.[0]?.split(
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
    return (txResponse as EthTransactionResponse)
      .transactionHash as SolanaTransactionResponse
  }

  async switchChain(chainId: ChainId): Promise<void> {
    await this.#ethProvider?.send?.('wallet_switchEthereumChain', [
      { chainId: utils.hexlify(chainId) },
    ])
  }

  async addChain(chain: Chain): Promise<void> {
    await this.#ethProvider?.send?.('wallet_addEthereumChain', [
      {
        chainId: utils.hexValue(Number(chain.id)),
        chainName: chain.name,
        ...(chain.token.name &&
          chain.token.symbol && {
            nativeCurrency: {
              name: chain.token.name,
              symbol: chain.token.symbol,
              decimals: chain.token.decimals ?? DECIMALS.WEI,
            },
          }),
        rpcUrls: [chain.rpcUrl],
        blockExplorerUrls: [...(chain.explorerUrl ? [chain.explorerUrl] : [])],
        ...(chain.icon && { iconUrls: [chain.icon] }),
      },
    ])
  }

  async signAndSendTx(tx: TxRequestBody): Promise<TransactionResponse> {
    if (!this.#provider) throw new TypeError(`Provider is not initialized`)

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
    if (!this.#provider || !this.#address)
      throw new TypeError(`Provider is not initialized`)

    return this.#ethProvider?.send('personal_sign', [
      utils.hexlify(utils.toUtf8Bytes(message)),
      this.#address.toLowerCase(),
    ])
  }

  public onUriUpdate(cb: (e?: ProviderEventPayload) => void): void {
    this.emitter.on(PROVIDER_EVENT_BUS_EVENTS.UriUpdate, cb)
  }

  async #setListeners() {
    this.#provider.on('session_event', e => {
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

    this.#provider.on('session_delete', () => {
      this.emit(PROVIDER_EVENT_BUS_EVENTS.Disconnect, this.#defaultEventPayload)
    })

    this.#provider.on('display_uri', uri => {
      this.#connectUri = uri
      this.emit(PROVIDER_EVENT_BUS_EVENTS.UriUpdate, this.#defaultEventPayload)
    })
  }
}
