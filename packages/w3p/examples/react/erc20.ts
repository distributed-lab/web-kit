import { RawProvider } from '@distributedlab/w3p'
import { providers } from 'ethers'
import { useMemo } from 'react'

import { Erc20__factory } from '@/types/contracts'

export const useErc20 = (address: string, provider: RawProvider | undefined) => {
  const contractInstance = useMemo(() => {
    if (!provider) return

    return Erc20__factory.connect(
      address,
      new providers.Web3Provider(provider as providers.ExternalProvider),
    )
  }, [address, provider])

  const contractInterface = useMemo(() => Erc20__factory.createInterface(), [])

  return {
    contractInstance,
    contractInterface,
  }
}
