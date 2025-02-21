'use client';

import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi';
import { Image, Button } from "@chakra-ui/react"
import { WalletOptions } from '@/components/menu/walletOptions';
import { AaUsdcTx } from '@/components/menu/aaUsdcTx'


export default function Home() {
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect()
  const { data: ensName } = useEnsName({ address })
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! });

  return (
    <div>
      <>
        {!isConnected ?
          <>
            <h1>Please Connect Wallet</h1>
            <WalletOptions/>
          </> 
          :
          <>
            <h1>Lets Transfer</h1>
            <Button onClick={() => disconnect()}>Disconnect</Button>
            <div>
                {ensAvatar && <Image src={ensAvatar} />}
                {address && <div>{ensName ? `${ensName} (${address})` : address}</div>}
                <AaUsdcTx />
            </div>
          </> 
        }
      </>
    </div>
  );
}
