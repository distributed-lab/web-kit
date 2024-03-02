import { RawProvider } from '@distributedlab/w3p'
import { providers } from 'ethers'
import { computed, MaybeRef, toValue } from 'vue'

import { Erc20__factory } from '@/types/contracts'

export const useErc20 = (address: string, provider: MaybeRef<RawProvider>) => {
  const contractInstance = computed(() => {
    const providerValue = toValue(provider)

    if (!providerValue) return null

    return Erc20__factory.connect(
      address,
      new providers.Web3Provider(providerValue as providers.ExternalProvider),
    )
  })

  const contractInterface = Erc20__factory.createInterface()

  return {
    contractInstance,
    contractInterface,
  }
}
