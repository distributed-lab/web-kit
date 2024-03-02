import { BN } from '@distributedlab/tools'
import { PROVIDERS } from '@distributedlab/w3p'
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Stack,
  Typography,
} from '@mui/material'

import { useErc20 } from '@/hooks/contracts/erc20'
import { useWeb3State, web3Store } from '@/store/modules/web3.module'

export default function UiKitWeb3() {
  const { provider } = useWeb3State()

  const erc20 = useErc20(import.meta.env.VITE_ERC20_CONTRACT_ADDRESS, provider?.rawProvider)

  const loadErc20Details = async () => {
    const [balance, decimals] = await Promise.all([
      erc20?.contractInstance?.balanceOf(provider?.address ?? ''),
      erc20?.contractInstance?.decimals(),
    ])

    console.log('balance', balance)
    console.log('decimals', decimals)
  }

  const sendSimpleTx = async () => {
    const txBody = {
      to: import.meta.env.VITE_ERC20_CONTRACT_ADDRESS,
      data: erc20?.contractInterface?.encodeFunctionData('transfer', [
        '0x4148A2eE8D42E63E8d1ADB7F4247A17658730b38',
        BN.fromRaw(1, 18).value,
      ]),
    }

    const receipt = await provider?.signAndSendTx(txBody)

    console.log(receipt)
  }

  return (
    <Stack spacing={6} direction='row' flexWrap='wrap'>
      <Card>
        <CardHeader title={provider?.providerType} />

        <CardContent>
          <Typography variant='body1'>Address: {provider?.address}</Typography>
          <Typography variant='body1'>Chain ID: {provider?.chainId}</Typography>
        </CardContent>

        <CardActions>
          <Button onClick={() => web3Store.connect(PROVIDERS.Metamask)}>connect</Button>
          <Button
            onClick={async () => {
              console.log(await provider?.signMessage('lorem ipsum dolor sit amet concestetur!'))
            }}
          >
            sign message
          </Button>
          <Button onClick={loadErc20Details}>Load erc20 details</Button>
          <Button onClick={sendSimpleTx}>send simple tx</Button>
        </CardActions>
      </Card>
    </Stack>
  )
}
