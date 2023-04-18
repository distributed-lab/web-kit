import { PROVIDER_CHECKS, PROVIDERS } from '@/enums'
import { sleep } from '@/helpers'

import { NearRawProvider } from './providers'
import {
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

export class ProviderDetector {
  #providers: ProviderInstance[]
  #rawProviders: RawProvider[]
  #initiated = false

  constructor() {
    this.#providers = []
    this.#rawProviders = []
  }

  public async init(): Promise<ProviderDetector> {
    await sleep(500)
    this.#detectRawProviders()
    await this.#defineProviders()
    await sleep(500)
    this.#initiated = true
    return this
  }

  get initiated(): boolean {
    return this.#initiated
  }

  public get providers(): Record<PROVIDERS, ProviderInstance> {
    return this.#providers.reduce((acc, el) => {
      const name = el.name.toLowerCase() as PROVIDERS

      acc[name] = {
        ...el,
        name,
      }
      return acc
    }, {} as Record<PROVIDERS, ProviderInstance>)
  }

  public get isEnabled(): boolean {
    return Boolean(this.#providers.length)
  }

  public getProvider(provider: PROVIDERS): ProviderInstance | undefined {
    return this.providers[provider]
  }

  #detectRawProviders(): void {
    const ethProviders = window?.ethereum
      ? window?.ethereum?.providers || [window?.ethereum]
      : undefined
    const phantomProvider = window?.solana
    const solflareProvider = window?.solflare
    const nearProvider = new NearRawProvider({})

    this.#rawProviders = [
      ...(ethProviders ? ethProviders : []),
      ...(nearProvider ? [nearProvider] : []),
      ...(phantomProvider ? [phantomProvider] : []),
      ...(solflareProvider ? [solflareProvider] : []),
    ] as RawProvider[]
  }

  async #defineProviders(): Promise<void> {
    if (this.#rawProviders.length) {
      this.#designateProviders()
    } else {
      await sleep(3000)
      await this.#detectRawProviders()
      this.#designateProviders()
    }
  }

  #designateProviders(): void {
    if (!this.#rawProviders.length) return

    const browserProviders = this.#rawProviders.map(el => {
      const appropriatedProviderName: PROVIDERS =
        this.#getAppropriateProviderName(el)

      return {
        name: appropriatedProviderName,
        instance: el,
      } as ProviderInstance
    })

    this.#providers = browserProviders.filter(
      (el, idx, arr) => arr.findIndex(sec => sec.name === el.name) === idx,
    )
  }

  #getAppropriateProviderName(provider: RawProvider): PROVIDERS {
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
