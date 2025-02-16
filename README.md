# circle-uscd-paymaster

USDCのPaymaster理解のため作成

## 環境情報

* OS: Mac m2
* Node.js: v20.14.0

## 概要

### 元となった記事

[Circleによる実装チュートリアル](https://developers.circle.com/stablecoins/quickstart-circle-paymaster)

### ディレクトリ構造

```bash
├── index.js            ：メインの処理部分
└── permit-helpers.js   ：EIP2612の処理
```

## デモ手順

### 1. ライブラリのインストール

```bash
npm init
npm install --save viem permissionless
```

### 2. テスト用のEOA作成


**注記： EOA作成について**

[index.js](./index.js)の39~47行目のコードによって、EOA（秘密鍵）が作成される

```javascript
...
const owner = privateKeyToAccount(
    fs.existsSync('.owner_private_key')
    ? fs.readFileSync('.owner_private_key', 'utf8')
    : (() => {
        const privateKey = generatePrivateKey();
        fs.writeFileSync('.owner_private_key', privateKey);
        return privateKey;
        })()
);
...
```

### 3. テストネットトークンの取得

上記手順「2. テスト用のEOA作成」で作成したEOAに対して、Base Sepoliaのテスト用USDCを送金する

テスト用USDCは、[Circle提供のFaucet](https://faucet.circle.com/?_gl=1*16uxt13*_gcl_au*NTU2NDg4NjY0LjE3Mzk1MTQ1NzY.*_ga*MTM5NjY5MzI0My4xNzM5NTE0NTc3*_ga_GJDVPCQNRV*MTczOTUxNDU3Ni4xLjEuMTczOTUxNDk1My42MC4wLjA.)にて、より取得する

### 4. Bundlerへの送金トランザクション実行

改めてindex.jsを実行する。USDCがテスト用EOAに入っていれば、最後まで実行される

```bash
$ node index.js

> Constructing and signing permit...
> Connected to network, latest block is 21959483n
> Owner address: 0xb6379A80903431416250b80F5D336ceFbCF143D0
> Smart wallet address: 0xBd673c99850dA342574E9B84d4A48cFAE2F3e68b
> Smart wallet has 5 USDC
> Permit signature: 0x01845adb2c711129d4f3966735ed98a9f09fc4ce572afcb893e5afbbf71c1c7742f2f4f9300849f2008103587630f3076f3c62474e1108e1509c9b61703ee81041ff0147ce64225a0c28387873f3889303abf1ba151c
> Additional gas charge (paymasterPostOpGasLimit): 15000n
> Max fee per gas: 1418375n
> Max priority fee per gas: 1417500n
> Estimating user op gas limits...
> Call gas limit: 48474n
> Pre-verification gas: 69801n
> Verification gas limit: 292048n
> Paymaster post op gas limit: 6486n
> Paymaster verification gas limit: 169000n
> Sending user op...
> Submitted user op: 0xecc1ce0dc83cdc1620a33ce67ad36fe316d2045e8588bb9feb7a93c49da413b1
> Waiting for execution...
> Done! Details:
  success: true
  actualGasUsed: 476324n
  actualGasCost: 0.00000067543457686 ETH
  transaction hash: 0xe6a4ecc7f5b940b58307fdcc0eb8d01af2208765a517e0ce2758aae0f711ab88
  transaction gasUsed: 456700n
  USDC paid: 0.002056
```

**注記1：やってみたトランザクション**

* [Bundler起点でのオペレーション](https://jiffyscan.xyz/userOpHash/0xecc1ce0dc83cdc1620a33ce67ad36fe316d2045e8588bb9feb7a93c49da413b1?network=base-sepolia&section=overview)
* [すべてのトランザクション](https://sepolia.basescan.org/tx/0xe6a4ecc7f5b940b58307fdcc0eb8d01af2208765a517e0ce2758aae0f711ab88)

## 参考文献

* [Quickstart: Circle Paymaster](https://developers.circle.com/stablecoins/quickstart-circle-paymaster)
* [【EIP-4337】UserOperationをBundlerに投げてからTransactionが発行されるまで](https://zenn.dev/taxio/articles/834e6a04bd6b80)