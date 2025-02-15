# circle-uscd-paymaster
USDCのPaymaster理解のため作成

## 環境情報

* OS: Mac m2
* Node.js: v20.14.0

## 手順

### ライブラリのインストール

```bash
npm init
npm install --save viem permissionless
```

### テストネットトークンの取得

[USDCのFaucet](https://faucet.circle.com/?_gl=1*16uxt13*_gcl_au*NTU2NDg4NjY0LjE3Mzk1MTQ1NzY.*_ga*MTM5NjY5MzI0My4xNzM5NTE0NTc3*_ga_GJDVPCQNRV*MTczOTUxNDU3Ni4xLjEuMTczOTUxNDk1My42MC4wLjA.)にて、Base SepoliaのUSDCを取得する

## 参考文献

* [Quickstart: Circle Paymaster](https://developers.circle.com/stablecoins/quickstart-circle-paymaster)
* [【EIP-4337】UserOperationをBundlerに投げてからTransactionが発行されるまで](https://zenn.dev/taxio/articles/834e6a04bd6b80)