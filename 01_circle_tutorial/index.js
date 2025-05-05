import { 
    createPublicClient, 
    http, 
    getContract, 
    erc20Abi, 
    formatUnits, 
    maxUint256, 
    parseErc6492Signature,
    encodePacked,
    hexToBigInt, 
    encodeFunctionData, 
    parseAbi
} from 'viem';
import { baseSepolia } from 'viem/chains';
import { createBundlerClient } from 'viem/account-abstraction';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { toEcdsaKernelSmartAccount } from 'permissionless/accounts';
import { eip2612Abi, eip2612Permit } from './permit-helpers.js';
import fs from 'node:fs';

const BASE_SEPOLIA_BUNDLER = `https://public.pimlico.io/v2/${baseSepolia.id}/rpc`;
const BASE_SEPOLIA_USDC = '0x036CbD53842c5426634e7929541eC2318f3dCF7e';
const BASE_SEPOLIA_PAYMASTER = '0x31BE08D380A21fc740883c0BC434FcFc88740b58';
const MAX_GAS_USDC = 1000000n; // 1 USDC

const client = createPublicClient({
  chain: baseSepolia,
  transport: http()
});

const block = await client.getBlockNumber();
console.log('Connected to network, latest block is', block);

const bundlerClient = createBundlerClient({
  client,
  transport: http(BASE_SEPOLIA_BUNDLER)
});

const owner = privateKeyToAccount(
    fs.existsSync('.owner_private_key')
    ? fs.readFileSync('.owner_private_key', 'utf8')
    : (() => {
        const privateKey = generatePrivateKey();
        fs.writeFileSync('.owner_private_key', privateKey);
        return privateKey;
        })()
);

const account = await toEcdsaKernelSmartAccount({
    client,
    owners: [owner],
    version: '0.3.1'
});

console.log('Owner address:', owner.address);
console.log('Smart wallet address:', account.address);

const usdc = getContract({
  client,
  address: BASE_SEPOLIA_USDC,
  abi: [...erc20Abi, ...eip2612Abi]
});

const usdcBalance = await usdc.read.balanceOf([account.address]);

if (usdcBalance === 0n) {
  console.log(
    'Visit https://faucet.circle.com/ to fund the smart wallet address above ' +
      '(not the owner address) with some USDC on BASE Sepolia, ' +
      'then return here and run the script again.'
  );
  process.exit();
} else {
  console.log(`Smart wallet has ${formatUnits(usdcBalance, 6)} USDC`);
}


const permitData = await eip2612Permit({
  token: usdc,
  chain: baseSepolia,
  ownerAddress: account.address,
  spenderAddress: BASE_SEPOLIA_PAYMASTER,
  value: MAX_GAS_USDC
});

const wrappedPermitSignature = await account.signTypedData(permitData);
const { signature: permitSignature } = parseErc6492Signature(
  wrappedPermitSignature
);
console.log(wrappedPermitSignature)
console.log(permitSignature)

console.log('Permit signature:', permitSignature);

function sendUSDC(to, amount) {
    return {
      to: usdc.address,
      abi: usdc.abi,
      functionName: 'transfer',
      args: [to, amount]
    };
  }
  
  const recipient = privateKeyToAccount(generatePrivateKey()).address;
  const calls = [sendUSDC(recipient, 10000n)]; // $0.01 USDC
  
  const paymaster = BASE_SEPOLIA_PAYMASTER;
  const paymasterData = encodePacked(
    ['uint8', 'address', 'uint256', 'bytes'],
    [
      0n, // Reserved for future use
      usdc.address, // Token address
      MAX_GAS_USDC, // Max spendable gas in USDC
      permitSignature // EIP-2612 permit signature
    ]
  );

  // const additionalGasCharge = hexToBigInt(
  //   (
  //     await client.call({
  //       to: paymaster,
  //       data: encodeFunctionData({
  //         abi: parseAbi(['function additionalGasCharge() returns (uint256)']),
  //         functionName: 'additionalGasCharge'
  //       })
  //     })
  //   ).data
  // );
  const additionalGasCharge = BigInt(20000)
  
  console.log(
    'Additional gas charge (paymasterPostOpGasLimit):',
    additionalGasCharge
  );

  const { standard: fees } = await bundlerClient.request({
    method: 'pimlico_getUserOperationGasPrice'
  });
  
  const maxFeePerGas = hexToBigInt(fees.maxFeePerGas);
  const maxPriorityFeePerGas = hexToBigInt(fees.maxPriorityFeePerGas);
  
  console.log('Max fee per gas:', maxFeePerGas);
  console.log('Max priority fee per gas:', maxPriorityFeePerGas);
  console.log('Estimating user op gas limits...');
  
  const {
    callGasLimit,
    preVerificationGas,
    verificationGasLimit,
    paymasterPostOpGasLimit,
    paymasterVerificationGasLimit
  } = await bundlerClient.estimateUserOperationGas({
    account,
    calls,
    paymaster,
    paymasterData,
    // Make sure to pass in the `additionalGasCharge` from the paymaster
    paymasterPostOpGasLimit: additionalGasCharge,
    // Use very low gas fees for estimation to ensure successful permit/transfer,
    // since the bundler will simulate the user op with very high gas limits
    maxFeePerGas: 1n,
    maxPriorityFeePerGas: 1n
  });
  
  console.log('Call gas limit:', callGasLimit);
  console.log('Pre-verification gas:', preVerificationGas);
  console.log('Verification gas limit:', verificationGasLimit);
  console.log('Paymaster post op gas limit:', paymasterPostOpGasLimit);
  console.log('Paymaster verification gas limit:', paymasterVerificationGasLimit);

  console.log('Sending user op...');

const userOpHash = await bundlerClient.sendUserOperation({
  account,
  calls,
  callGasLimit,
  preVerificationGas,
  verificationGasLimit,
  paymaster,
  paymasterData,
  paymasterVerificationGasLimit,
  // Make sure that `paymasterPostOpGasLimit` is always at least
  // `additionalGasCharge`, regardless of what the bundler estimated.
  paymasterPostOpGasLimit: Math.max(
    Number(paymasterPostOpGasLimit),
    Number(additionalGasCharge)
  ),
  maxFeePerGas,
  maxPriorityFeePerGas
});

console.log('Submitted user op:', userOpHash);
console.log('Waiting for execution...');

const userOpReceipt = await bundlerClient.waitForUserOperationReceipt({
  hash: userOpHash
});

console.log('Done! Details:');
console.log('  success:', userOpReceipt.success);
console.log('  actualGasUsed:', userOpReceipt.actualGasUsed);
console.log(
  '  actualGasCost:',
  formatUnits(userOpReceipt.actualGasCost, 18),
  'ETH'
);
console.log('  transaction hash:', userOpReceipt.receipt.transactionHash);
console.log('  transaction gasUsed:', userOpReceipt.receipt.gasUsed);

const usdcBalanceAfter = await usdc.read.balanceOf([account.address]);
const usdcConsumed = usdcBalance - usdcBalanceAfter - 10000n; // Exclude what we sent

console.log('  USDC paid:', formatUnits(usdcConsumed, 6));

// We need to manually exit the process, since viem leaves some promises on the
// event loop for features we're not using.
process.exit();