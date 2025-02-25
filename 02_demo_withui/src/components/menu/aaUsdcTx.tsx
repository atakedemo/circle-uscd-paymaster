"use client"

import * as React from 'react';
// import axios from "axios";
// import { useAccount } from 'wagmi';
import { Button, Field, Input, Stack } from "@chakra-ui/react";
// import { baseSepolia } from "viem/chains";
import { 
  // parseErc6492Signature, 
  // erc20Abi, 
  // parseEther, 
  // parseAbi,
  // getContract, 
  // encodePacked,
  // encodeFunctionData,
  // hexToBigInt,
  // http,
} from 'viem';
// import { createBundlerClient,type BundlerClient} from 'viem/account-abstraction';
import { smartAccount,
  //  eip2612Abi 
  } 
   from '@/lib/usdc-aa';
// import { publicClient, walletClient} from '@/lib/client';
import { 
  IFormValues, 
  // IGasPriceResponse 
} from '@/lib/utils'
import { useForm } from "react-hook-form"
import { transferUSDC } from '@/lib/transfer-service'

// const MAX_GAS_USDC = process.env.NEXT_PUBLIC_MAX_GAS_USDC as string;
// const BASE_SEPOLIA_PAYMASTER = process.env.NEXT_PUBLIC_BASE_SEPOLIA_PAYMASTER as `0x${string}`;
// const BASE_SEPOLIA_USDC = process.env.NEXT_PUBLIC_BASE_SEPOLIA_USDC as `0x${string}`;
// const NONCE = 0;
// const DEADLINE = Math.floor(Date.now() / 1000) + 360000;
// const BUNDLER_URL = `${process.env.NEXT_PUBLIC_BUNDLER_PREFIX}${baseSepolia.id}/rpc?apikey=${process.env.NEXT_PUBLIC_API_KEY}`;

// const bundlerClient:BundlerClient = createBundlerClient({
//     account: walletClient.account,
//     client: publicClient,
//     transport: http(BUNDLER_URL)
// });

// const usdc = getContract({
//   client: publicClient,
//   address: BASE_SEPOLIA_USDC,
//   abi: [...erc20Abi, ...eip2612Abi]
// });

export function AaUsdcTx() {
  // const account= useAccount();
  const { register, handleSubmit,} = useForm<IFormValues>();

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
    transferUSDC(data.recipient, BigInt(data.amount))
    // const usdc_name = await usdc.read.name() as string
    
    // const wrappedPermitSignature = await walletClient.signTypedData({
    //   account: account.address as `0x${string}`,
    //   domain: {
    //     name: usdc_name as string,
    //     version: "1",
    //     chainId: baseSepolia.id,
    //     verifyingContract: BASE_SEPOLIA_USDC,
    //   },
    //   types: {
    //     Permit: [
    //       { name: "owner", type: "address" },
    //       { name: "spender", type: "address" },
    //       { name: "value", type: "uint256" },
    //       { name: "nonce", type: "uint256" },
    //       { name: "deadline", type: "uint256" },
    //     ],
    //   },
    //   primaryType: 'Permit',
    //   message: {
    //     owner: account.address as `0x${string}`,
    //     spender: BASE_SEPOLIA_PAYMASTER,
    //     value: parseEther(MAX_GAS_USDC),
    //     nonce: BigInt(NONCE),
    //     deadline: BigInt(DEADLINE),
    //   },
    // });
    // const { signature: permitSignature } = parseErc6492Signature(wrappedPermitSignature);

    // console.log('Permit signature:', permitSignature);
    // const calls = [sendUSDC(data.recipient, data.amount.toString())]
    // const paymasterData = encodePacked(
    //   ['uint8', 'address', 'uint256', 'bytes'],
    //   [
    //     0,
    //     usdc.address,
    //     parseEther(MAX_GAS_USDC),
    //     permitSignature
    //   ]
    // );
    // console.log(calls)
    // console.log(paymasterData)
    
    // const additionalGasCharge = hexToBigInt(
    //   (
    //     await publicClient.call({
    //       to: BASE_SEPOLIA_PAYMASTER,
    //       data: encodeFunctionData({
    //         abi: parseAbi(['function additionalGasCharge() returns (uint256)']),
    //         functionName: 'additionalGasCharge'
    //       })
    //     })
    //   ).data ?? '0x0'
    // );
    
    // console.log(
    //   'Additional gas charge (paymasterPostOpGasLimit):',
    //   additionalGasCharge
    // );

    // // const feesResponse = await axios.post<IGasPriceResponse>(BUNDLER_URL, {
    // //   jsonrpc: "2.0",
    // //   method: "pimlico_getUserOperationGasPrice",
    // //   params: [],
    // //   id: 1,
    // // }, {
    // //   headers: {
    // //     "Content-Type": "application/json",
    // //   },
    // // })
    // // console.log("pimlico_getUserOperationGasPrice: " + feesResponse)

    // // const maxFeePerGas = hexToBigInt(feesResponse.data.result.standard.maxFeePerGas);
    // // const maxPriorityFeePerGas = hexToBigInt(feesResponse.data.result.standard.maxPriorityFeePerGas);
    // const maxFeePerGas = hexToBigInt("0x15a4e6")
    // const maxPriorityFeePerGas = hexToBigInt("0x15a11c")
    // console.log(maxFeePerGas)
    // console.log(maxPriorityFeePerGas)

    // const {
    //   callGasLimit,
    //   preVerificationGas,
    //   verificationGasLimit,
    //   paymasterPostOpGasLimit,
    //   paymasterVerificationGasLimit
    // } = await bundlerClient.estimateUserOperationGas({
    //   account: smartAccount,
    //   calls: [{
    //     to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
    //     value: parseEther('1')
    //   }],
    //   paymaster: BASE_SEPOLIA_PAYMASTER,
    //   paymasterData,
    //   paymasterPostOpGasLimit: additionalGasCharge,
    //   maxFeePerGas: parseEther("1"),
    //   maxPriorityFeePerGas: parseEther("1")
    // })
    // console.log(callGasLimit,preVerificationGas,verificationGasLimit,paymasterPostOpGasLimit,paymasterVerificationGasLimit)

    // const userOpHash = await bundlerClient.sendUserOperation({
    //   account: pimlicoClient.account,
    //   calls: [{
    //     to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
    //     value: parseEther('1')
    //   }],
    //   callGasLimit,
    //   preVerificationGas,
    //   verificationGasLimit,
    //   paymaster: BASE_SEPOLIA_PAYMASTER,
    //   paymasterData,
    //   paymasterVerificationGasLimit,
    //   paymasterPostOpGasLimit,
    //   maxFeePerGas,
    //   maxPriorityFeePerGas
    // });

    // console.log('Submitted user op:', userOpHash);
    // console.log('Waiting for execution...');

    // const userOpReceipt = await bundlerClient.waitForUserOperationReceipt({
    //   hash: userOpHash
    // });
    // console.log(userOpReceipt)
  })
  
  return (
    <>
      <Stack gap="2" align="flex-start">
        Smart Account is: {smartAccount.address}
      </Stack>
      <form onSubmit={onSubmit}>
        <Stack gap="4" align="flex-start" maxW="sm">
          <Field.Root>
            <Field.Label>Recipient</Field.Label>
            <Input
              {...register("recipient", { required: "Recipient address is required" })}
            />
          </Field.Root>
          <Field.Root>
            <Field.Label>Amount</Field.Label>
            <Input
              {...register("amount", { required: "Amount is required" })}
            />
          </Field.Root>
          <Button type="submit">Submit</Button>
        </Stack>
      </form>
    </>
  )
}