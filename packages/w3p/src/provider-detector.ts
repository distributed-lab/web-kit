import { CHAIN_TYPES, PROVIDER_CHECKS, PROVIDERS } from '@/enums'
import { wrapExternalEthProvider } from '@/helpers/eth'
import { sleep } from '@/helpers/promise'

import type {
  EthereumProvider,
  ProviderInstance,
  RawProvider,
  SolanaProvider,
} from './types'

declare global {
  interface Window {
    ethereum?: EthereumProvider
    solana?: SolanaProvider
    solflare?: SolanaProvider & {
      isSolflare: boolean
    }
  }
}

type ErrorHandlersMap = {
  [key in CHAIN_TYPES]: (error: Error) => unknown
}

type ProviderDetectorConfig = {
  isWrapDefaultProviders: boolean
}

export class ProviderDetector<T extends keyof Record<string, string>> {
  pureProviders: ProviderInstance<T>[]
  rawProviders: RawProvider[]
  isInitiated = false

  public static errorHandlers?: ErrorHandlersMap
  public static cfg: ProviderDetectorConfig

  constructor() {
    this.pureProviders = []
    this.rawProviders = []

    ProviderDetector.setCfg({
      isWrapDefaultProviders: true,
    })
  }

  public static defineErrorHandlers(handlersMap: ErrorHandlersMap) {
    ProviderDetector.errorHandlers = handlersMap
  }

  public static setCfg(cfg: Partial<typeof ProviderDetector.cfg>) {
    ProviderDetector.cfg = {
      ...ProviderDetector.cfg,
      ...cfg,
    }
  }

  public async init(): Promise<ProviderDetector<T>> {
    this.detectRawProviders()
    await this.defineProviders()
    this.isInitiated = true
    return this
  }

  public get providers(): Record<PROVIDERS | T, ProviderInstance> {
    return this.pureProviders.reduce((acc, el) => {
      const name = el.name.toLowerCase() as PROVIDERS

      acc[name] = {
        ...el,
        name,
      }
      return acc
    }, {} as Record<PROVIDERS | T, ProviderInstance>)
  }

  public get isEnabled(): boolean {
    return Boolean(this.pureProviders.length)
  }

  public getProvider(provider: PROVIDERS | T): ProviderInstance | undefined {
    return this.providers[provider]
  }

  public addProvider(provider: ProviderInstance<T>): void {
    this.pureProviders.push(provider)
  }

  public removeProvider(providerToRemove: ProviderInstance<T>): void {
    this.pureProviders = this.pureProviders.filter(
      provider => provider.name !== providerToRemove.name,
    )
  }

  detectRawProviders(): void {
    const ethProviders = window?.ethereum
      ? window?.ethereum?.providers || [window?.ethereum]
      : []
    const phantomProvider = window?.solana
    const solflareProvider = window?.solflare

    const proxyEthProviders = ethProviders?.map(el =>
      wrapExternalEthProvider(
        el,
        ProviderDetector.errorHandlers?.[CHAIN_TYPES.EVM],
      ),
    )

    this.rawProviders = [
      ...(ProviderDetector.cfg?.isWrapDefaultProviders && proxyEthProviders
        ? proxyEthProviders
        : ethProviders),
      ...(phantomProvider ? [phantomProvider] : []),
      ...(solflareProvider ? [solflareProvider] : []),
    ] as RawProvider[]
  }

  async defineProviders(): Promise<void> {
    if (!this.rawProviders.length) {
      await sleep(3000)
      this.detectRawProviders()
    }

    this.designateProviders()
  }

  designateProviders(): void {
    if (!this.rawProviders.length) return

    const browserProviders = this.rawProviders.map(el => {
      const appropriatedProviderName: PROVIDERS =
        this.getAppropriateProviderName(el)

      return {
        name: appropriatedProviderName,
        instance: el,
      } as ProviderInstance
    })

    this.pureProviders = [
      ...this.pureProviders,
      ...browserProviders.filter(
        (el, idx, arr) => arr.findIndex(sec => sec.name === el.name) === idx,
      ),
    ]
  }

  getAppropriateProviderName(provider: RawProvider): PROVIDERS {
    const providerName = Object.entries(PROVIDER_CHECKS).find(el => {
      const [, value] = el

      return ((<unknown>provider) as { [key in PROVIDER_CHECKS]: boolean })[
        value
      ]
    })

    return (
      ((providerName && providerName[0]) as PROVIDERS) || PROVIDERS.Fallback
    )
  }
}
