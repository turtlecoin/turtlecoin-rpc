[![NPM](https://nodei.co/npm/turtlecoin-rpc.png?downloads=true&stars=true)](https://nodei.co/npm/turtlecoin-rpc/)

[![Build Status](https://travis-ci.org/brandonlehmann/turtlecoin-rpc.png?branch=master)](https://travis-ci.org/brandonlehmann/turtlecoin-rpc) [![Build Status](https://ci.appveyor.com/api/projects/status/github/brandonlehmann/turtlecoin-rpc?branch=master&svg=true)](https://ci.appveyor.com/project/brandonlehmann/turtlecoin-rpc/branch/master)

# TurtleCoin RPC API

This project is designed to make it very easy to interact with various RPC APIs available within the [TurtleCoin](https://turtlecoin.lol) Project. This entire project uses [Javascript Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) to make things fast, easy, and safe.

## Table of Contents

1. [Dependencies](#dependencies)
2. [Installation](#installation)
3. [Intialization](#intialization)
4. [TurtleCoind RPC API Interface](#turtlecoind-rpc-api-interface)
5. [WalletAPI Interface](#walletapi-interface)
6. [TurtleService RPC API Interface](#turtleservice-rpc-api-interface) (use at your own risk, deprecated)

## Dependencies

* [NodeJS v8.x](https://nodejs.org) >= 8.x
* [TurtleCoin](https://github.com/turtlecoin/turtlecoin/releases) >= v0.8.4

## Installation

```bash
npm install turtlecoin-rpc
```

## Intialization

### TurtleCoind
```javascript
const TurtleCoind = require('turtlecoin-rpc').TurtleCoind

const daemon = new TurtleCoind({
  host: '127.0.0.1', // ip address or hostname of the TurtleCoind host
  port: 11898, // what port is the RPC server running on
  timeout: 2000, // request timeout
  ssl: false, // whether we need to connect using SSL/TLS
  userAgent: 'turtlecoin-rpc/1.0.3' // specify a customer user-agent or use the default
})
```

### Wallet-API
```javascript
const WalletAPI = require('turtlecoin-rpc').WalletAPI

const wallet = new WalletAPI({
  host: '127.0.0.1', // ip address or hostname of wallet-api host
  port: 8070, // port wallet-api is running on, default is 8070
  timeout: 5000, // how long to wait before timing out the connection
  ssl: false, // whether or not to connect through SSL
  rpcPassword: 'password', // your rpc password
  defaultMixin: 3, // should be configured to the default mixin, or false if no default mixin is set
  defaultFee: 0.1, // the default fee of your network, in decimal not atomic units
  decimalDivisor: 100, // how many decimals will be used
  defaultUnlockTime: 0, // default unlock time
  userAgent: 'turtlecoin-rpc/1.0.3' // specify a customer user-agent or use the default
})
```

### TurtleService
```javascript
const TurtleService = require('turtlecoin-rpc').TurtleService

const service = new TurtleService({
  host: '127.0.0.1', // ip address or hostname of the turtle-service host
  port: 8070, // what port is turtle-service running on
  timeout: 2000, // request timeout
  ssl: false, // whether we need to connect using SSL/TLS
  rpcPassword: 'changeme', // must be set to the password used to run turtle-service

  // RPC API default values
  defaultMixin: false, // the default mixin to use for transactions, the default setting is false which means we don't have a default value
  defaultFee: 0.1, // the default transaction fee for transactions
  defaultBlockCount: 1, // the default number of blocks when blockCount is required
  decimalDivisor: 100, // Currency has many decimal places?
  defaultFirstBlockIndex: 1, // the default first block index we will use when it is required
  defaultUnlockTime: 0, // the default unlockTime for transactions
  defaultFusionThreshold: 10000000, // the default fusionThreshold for fusion transactions
  userAgent: 'turtlecoin-rpc/1.0.3' // specify a customer user-agent or use the default
})
```

### Client
```javascript
const Client = require('turtlecoin-rpc').Client

const client = new Client({
  host: '127.0.0.1', // ip address or hostname of the TurtleCoind host
  port: 11898, // what port is the RPC server running on
  timeout: 2000, // request timeout
  ssl: false, // whether we need to connect using SSL/TLS
  userAgent: 'turtlecoin-rpc/1.0.3' // specify a customer user-agent or use the default
})
```

## TurtleCoind RPC API Interface

We expose all of the `TurtleCoind` RPC API commands via the ```TurtleCoind``` interface. Each of the below methods are [Javascript Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises). For safety sake, **always** handle your promise catches as we do use them properly.

Methods noted having options have parameters that may be *optional* or *required* as documented.

### daemon.getBlocks(options)

Returns information on the last 30 blocks before *height* (inclusive).

#### Method Parameters

|Argument|Mandatory|Description|Format|
|---|---|---|---|
|height|Yes|The height of the blockchain to start at|integer|

#### Example Code

```javascript
daemon.getBlocks({
  height: 500000
}).then((blocks) => {
  // do something
})
```

#### Example Data

```javascript
[
  {
    "cumul_size": 22041,
    "difficulty": 285124963,
    "hash": "62f0058453292af5e1aa070f8526f7642ab6974c6af2c17088c21b31679c813d",
    "height": 500000,
    "timestamp": 1527834137,
    "tx_count": 4
  },
  {
    "cumul_size": 384,
    "difficulty": 258237161,
    "hash": "74a45602da61b8b8ff565b1c81c854416046a23ca53f4416684ffaa60bc50796",
    "height": 499999,
    "timestamp": 1527834031,
    "tx_count": 1
  },
  {
    "cumul_size": 418,
    "difficulty": 256087255,
    "hash": "ed628ff13eacd5b99c5d7bcb3aeb29ef8fc61dbb21d48b65e0cdaf5ab21211c1",
    "height": 499998,
    "timestamp": 1527834020,
    "tx_count": 1
  }
]
```

### daemon.getBlocksFast(options)

Returns up to 1,000 serialized blocks and transactions based on the supplied blocks

For the best results, the block hashes you supply should follow the following order:

The first 10 blocks are sequential descending, next goes in pow(2,n), like 2, 4, 8, 16, 32, 64 and so on, and the last one is **must** always be genesis block.

#### Method Parameters

|Argument|Mandatory|Description|Format|
|---|---|---|---|
|blockHashes|Yes|The block hashes to query|strings|
|blockCount|No|The number of blocks to return (0 <= count <= 1000)|integer|

#### Example Code

```javascript
daemon.getBlocksFast({
  blockHashes: [
    'a2e4fb2fc107f3e5c83ea2a1457b20fd82289a779263ea79692865d5005adf73',
    '7fb97df81221dd1366051b2d0bc7f49c66c22ac4431d879c895b06d66ef66f4c'
  ]
}).then((result) => {
  // do something
})
```

#### Example Data

```javascript
[
  {
    "cumul_size": 22041,
    "difficulty": 285124963,
    "hash": "62f0058453292af5e1aa070f8526f7642ab6974c6af2c17088c21b31679c813d",
    "height": 500000,
    "timestamp": 1527834137,
    "tx_count": 4
  },
  {
    "cumul_size": 384,
    "difficulty": 258237161,
    "hash": "74a45602da61b8b8ff565b1c81c854416046a23ca53f4416684ffaa60bc50796",
    "height": 499999,
    "timestamp": 1527834031,
    "tx_count": 1
  },
  {
    "cumul_size": 418,
    "difficulty": 256087255,
    "hash": "ed628ff13eacd5b99c5d7bcb3aeb29ef8fc61dbb21d48b65e0cdaf5ab21211c1",
    "height": 499998,
    "timestamp": 1527834020,
    "tx_count": 1
  }
]
```

### daemon.getBlock(options)

Returns information on a single block

#### Method Parameters

|Argument|Mandatory|Description|Format|
|---|---|---|---|
|hash|Yes|Block hash of the block you wish to retrieve|string|

#### Example Code

```javascript
daemon.getBlock({
  hash: 'f11580d74134ac34673c74f8da458080aacbe1eccea05b197e9d10bde05139f5'
}).then((block) => {
  // do something
})
```

#### Sample Data

```javascript
{
  "alreadyGeneratedCoins": "1484230931125",
  "alreadyGeneratedTransactions": 974921,
  "baseReward": 2935998,
  "blockSize": 48846,
  "depth": 0,
  "difficulty": 358164537,
  "effectiveSizeMedian": 100000,
  "hash": "f11580d74134ac34673c74f8da458080aacbe1eccea05b197e9d10bde05139f5",
  "height": 501854,
  "major_version": 4,
  "minor_version": 0,
  "nonce": 214748383,
  "orphan_status": false,
  "penalty": 0,
  "prev_hash": "674046ea53a8673c630bd34655c4723199e69fdcfd518503f4c714e16a7121b5",
  "reward": 2936608,
  "sizeMedian": 231,
  "timestamp": 1527891820,
  "totalFeeAmount": 610,
  "transactions": [
    {
      "amount_out": 2936608,
      "fee": 0,
      "hash": "61b29d7a3fe931928388f14cffb5e705a68db219e1df6b4e15aee39d1c2a16e8",
      "size": 266
    },
    {
      "amount_out": 2005890,
      "fee": 110,
      "hash": "8096a55ccd0d4a736b3176836429905f349c3de53dd4e92d34f4a2db7613dc4b",
      "size": 2288
    },
    {
      "amount_out": 3999900,
      "fee": 100,
      "hash": "304a068cbe87cd02b48f80f8831197174b133870d0c118d1fe65d07a33331c4e",
      "size": 2691
    },
    {
      "amount_out": 7862058,
      "fee": 100,
      "hash": "29c0d6708e8148eec6e02173b3bab0093768e5f486f553939495a47f883b4445",
      "size": 9638
    },
    {
      "amount_out": 6951392,
      "fee": 100,
      "hash": "fe661f11a0ba9838610c147f70813c17755ab608c7b033f6432c0b434671182c",
      "size": 10004
    },
    {
      "amount_out": 6800150,
      "fee": 100,
      "hash": "4b0366f79ec341cf60d5ef8c9dd8e65974dacb1be1d30dc0bf11d2d9d8240b46",
      "size": 11493
    },
    {
      "amount_out": 7260417,
      "fee": 100,
      "hash": "066b86268b7bb2f780ed76f452d1e6f7213dc6cae273b71fbd4ba378befaed00",
      "size": 12155
    }
  ],
  "transactionsCumulativeSize": 48535
}
```

### daemon.getTransaction(options)

Gets information on the single transaction.

#### Method Parameters

|Argument|Mandatory|Description|Format|
|---|---|---|---|
|hash|Yes|The transaction hash|integer|

#### Example Code

```javascript
daemon.getTransaction({
  hash: '702ad5bd04b9eff14b080d508f69a320da1909e989d6c163c18f80ae7a5ab832'
}).then((transaction) => {
  // do something
})
```

#### Sample Data

```javascript
{
  "block": {
    "cumul_size": 22041,
    "difficulty": 103205633,
    "hash": "62f0058453292af5e1aa070f8526f7642ab6974c6af2c17088c21b31679c813d",
    "height": 500000,
    "timestamp": 1527834137,
    "tx_count": 4
  },
  "status": "OK",
  "tx": {
    "extra": "019e430ecdd501714900c71cb45fd49b4fa77ebd4a68d967cc2419ccd4e72378e3020800000000956710b6",
    "unlock_time": 500040,
    "version": 1,
    "vin": [
      {
        "type": "ff",
        "value": {
          "height": 500000
        }
      }
    ],
    "vout": [
      {
        "amount": 80,
        "target": {
          "data": {
            "key": "5ce69a87940df7ae8443261ff610861d2e4207a7556ef1aa35878c0a5e7e382d"
          },
          "type": "02"
        }
      },
      {
        "amount": 200,
        "target": {
          "data": {
            "key": "7c7f316befaac16ba3782a2ce489e7c0f16c2b733ac0eaa0a72a12ee637822e9"
          },
          "type": "02"
        }
      },
      {
        "amount": 6000,
        "target": {
          "data": {
            "key": "defcb7eb6537bf0a63368ed464df10197e67d7ea8f080e885911cf9ea71abb62"
          },
          "type": "02"
        }
      },
      {
        "amount": 30000,
        "target": {
          "data": {
            "key": "9693e864dba53f308d0b59623c608b6fe16bbdc7cdc75be94f78582d547b46a4"
          },
          "type": "02"
        }
      },
      {
        "amount": 900000,
        "target": {
          "data": {
            "key": "b739e9fbaa3ee976a9ed8ad93a2731ee191c384cf136929e737786573fcd3e96"
          },
          "type": "02"
        }
      },
      {
        "amount": 2000000,
        "target": {
          "data": {
            "key": "5621667d44e7ffb87e5010a5984c188f58a799efb01569e8e42fa2415bb7d14a"
          },
          "type": "02"
        }
      }
    ]
  },
  "txDetails": {
    "amount_out": 2936280,
    "fee": 0,
    "hash": "702ad5bd04b9eff14b080d508f69a320da1909e989d6c163c18f80ae7a5ab832",
    "mixin": 0,
    "paymentId": "",
    "size": 266
  }
}
```

### daemon.getTransactionPool()

Gets the list of transaction hashs in the mempool.

#### Example Code

```javascript
daemon.getTransactionPool().then((transactions) => {
  // do something
})
```

#### Sample Data

```javascript
[
  {
    "amount_out": 1660000,
    "fee": 0,
    "hash": "721ae50994d5446d5683ca79d6fa97dce321a39e88e1df70ae433dc67573841b",
    "size": 13046
  },
  {
    "amount_out": 325000,
    "fee": 0,
    "hash": "fc88004d9cd012c0341506f13003da015efec940cffca0baeff0a381c7846203",
    "size": 28038
  },
  {
    "amount_out": 4040000,
    "fee": 0,
    "hash": "de63292050c73db4bb74637910ceab2aef6b9a0b611d0d93e7a757f9c53f975a",
    "size": 28058
  },
  {
    "amount_out": 10200000,
    "fee": 0,
    "hash": "edcd17184bd0c953be009da6b555e90a7cd5fc596f5f560332382995be7b55a7",
    "size": 28091
  },
  {
    "amount_out": 3380000,
    "fee": 0,
    "hash": "e1846775508a750a2f027db46972114e86866d27d304c9178867ae4616b3723c",
    "size": 28092
  },
  {
    "amount_out": 3960000,
    "fee": 0,
    "hash": "015646a75a5279050b5f02df6d5ff9814860fabc8b093818995a4fb6a33e45d8",
    "size": 28096
  },
  {
    "amount_out": 3860000,
    "fee": 0,
    "hash": "5e2f8bcc8c6c9a74e8ce33a66213711b418633eceeefce50042aecb8544676ba",
    "size": 28097
  }
]
```

### daemon.getBlockCount()

Gets the current block count

#### Example Code

```javascript
daemon.getBlockCount().then((blockCount) => {
  // do something
})
```

#### Sample Data

```javascript
502322
```

### daemon.getBlockHash(options)

Gets a block hash by height.

#### Method Parameters

|Argument|Mandatory|Description|Format|
|---|---|---|---|
|height|Yes|The height of the block|integer|

#### Example Code

```javascript
daemon.getBlockHash({
  height: 500000
}).then((blockHash) => {
  // do something
})
```

#### Sample Data

```text
74a45602da61b8b8ff565b1c81c854416046a23ca53f4416684ffaa60bc50796
```

### daemon.getBlockTemplate(options)

#### Method Parameters

|Argument|Mandatory|Description|Format|
|---|---|---|---|
|reserveSize|Yes|Block reserve size|integer|
|walletAddress|Yes|Public Wallet Address|string|

#### Example Code

```javascript
daemon.getBlockTemplate({
  reserveSize: 200,
  walletAddress: 'TRTLv1pacKFJk9QgSmzk2LJWn14JGmTKzReFLz1RgY3K9Ryn7783RDT2TretzfYdck5GMCGzXTuwKfePWQYViNs4avKpnUbrwfQ'
}).then((blockTemplate) => {
  // do something
})
```

#### Sample Data

```javascript
{
  "blocktemplate_blob": "0400...0581",
  "difficulty": 194635827,
  "height": 502335,
  "reserved_offset": 412,
  "status": "OK"
}
```

### daemon.submitBlock(options)

#### Method Parameters

|Argument|Mandatory|Description|Format|
|---|---|---|---|
|blockBlob|Yes|Block blob data from miner|string|

#### Example Code

```javascript
daemon.submitBlock({
  blockBlob: '...'
}).then((result) => {
  // do something
})
```

#### Sample Data

```javascript
{
  "status": "OK"
}
```

### daemon.sendRawTransaction(options)

#### Method Parameters

|Argument|Mandatory|Description|Format|
|---|---|---|---|
|tx|Yes|Raw serialized transaction|string|

#### Example Code

```javascript
daemon.sendRawTransaction({
  tx: '...'
}).then((result) => {
  // do something
})
```

#### Sample Data

```javascript
{
  "status": "OK"
}
```

### daemon.getLastBlockHeader()

#### Example Code

```javascript
daemon.getLastBlockHeader().then((result) => {
  // do something
})
```

#### Sample Data

```javascript
{
  "block_header": {
    "block_size": 419,
    "depth": 0,
    "difficulty": 200671816,
    "hash": "7d6db7b77232d41c19d898e81c85ecf08c4e8dfa3434f975a319f6261a695739",
    "height": 502345,
    "major_version": 4,
    "minor_version": 0,
    "nonce": 130876,
    "num_txes": 1,
    "orphan_status": false,
    "prev_hash": "5af657331edff98791720c23aacf72e8b6247ddba2a5c42c93984a46946abd14",
    "reward": 2935955,
    "timestamp": 1527907348
  },
  "status": "OK"
}
```

### daemon.getBlockHeaderByHash(options)

#### Method Parameters

|Argument|Mandatory|Description|Format|
|---|---|---|---|
|hash|Yes|The block hash to find|string|

#### Example Code

```javascript
daemon.getBlockHeaderByHash({
  hash: '7d6db7b77232d41c19d898e81c85ecf08c4e8dfa3434f975a319f6261a695739'
}).then((result) => {
  // do something
})
```

#### Sample Data

```javascript
{
  "block_header": {
    "block_size": 419,
    "depth": 2,
    "difficulty": 200671816,
    "hash": "7d6db7b77232d41c19d898e81c85ecf08c4e8dfa3434f975a319f6261a695739",
    "height": 502345,
    "major_version": 4,
    "minor_version": 0,
    "nonce": 130876,
    "num_txes": 1,
    "orphan_status": false,
    "prev_hash": "5af657331edff98791720c23aacf72e8b6247ddba2a5c42c93984a46946abd14",
    "reward": 2935955,
    "timestamp": 1527907348
  },
  "status": "OK"
}
```

### daemon.getBlockHeaderByHeight(options)

#### Method Parameters

|Argument|Mandatory|Description|Format|
|---|---|---|---|
|height|Yes|The block height to find|string|

#### Example Code

```javascript
daemon.getBlockHeaderByHeight({
  height: 502345
}).then((result) => {
  // do something
})
```

#### Sample Data

```javascript
{
  "block_header": {
    "block_size": 419,
    "depth": 2,
    "difficulty": 200671816,
    "hash": "7d6db7b77232d41c19d898e81c85ecf08c4e8dfa3434f975a319f6261a695739",
    "height": 502345,
    "major_version": 4,
    "minor_version": 0,
    "nonce": 130876,
    "num_txes": 1,
    "orphan_status": false,
    "prev_hash": "5af657331edff98791720c23aacf72e8b6247ddba2a5c42c93984a46946abd14",
    "reward": 2935955,
    "timestamp": 1527907348
  },
  "status": "OK"
}
```

### daemon.getCurrencyId()

#### Example Code

```javascript
daemon.getCurrencyId().then((result) => {
  // do something
})
```

#### Sample Data

```text
7fb97df81221dd1366051b2d0bc7f49c66c22ac4431d879c895b06d66ef66f4c
```

### daemon.height()

#### Example Code

```javascript
daemon.height().then((result) => {
  // do something
})
```

#### Sample Data

```javascript
{
  "height": 502354,
  "network_height": 502354,
  "status": "OK"
}
```

### daemon.info()

#### Example Code

```javascript
daemon.info().then((result) => {
  // do something
})
```

#### Sample Data

```javascript
{
"alt_blocks_count": 14,
"difficulty": 289121015,
"grey_peerlist_size": 4997,
"hashrate": 9637367,
"height": 502354,
"incoming_connections_count": 12,
"last_known_block_index": 502352,
"network_height": 502354,
"outgoing_connections_count": 8,
"status": "OK",
"synced": true,
"tx_count": 473486,
"tx_pool_size": 1,
"version": "0.5.0",
"white_peerlist_size": 1000
}
```

### daemon.getTransactions()

#### Example Code

```javascript
daemon.getTransactions({
  hashes: [
    '549828e75151982b0e51b27e8f53b26ebc174f0ef78063984c8952b13e2a3564',
    '549828e75151982b0e51b27e8f53b26ebc174f0ef78063984c8952b13e2a3563'
  ]
}).then((result) => {
  // do something
})
```

#### Sample Data

```javascript
{
  "missed_tx": [
    "549828e75151982b0e51b27e8f53b26ebc174f0ef78063984c8952b13e2a3563"
  ],
  "status": "OK",
  "txs_as_hex": [
    "01000a023204e7b6...584248728d0c"
  ]
}
```

### daemon.peers()

#### Example Code

```javascript
daemon.peers().then((result) => {
  // do something
})
```

#### Sample Data

```javascript
{
  "peers": [
    "174.21.179.198:11897",
    "94.23.49.75:11897",
    "...",
    "80.14.183.25:11897",
    "71.193.1.94:11897"
  ],
  "status": "OK"
}
```

### daemon.fee()

#### Example Code

```javascript
daemon.fee().then((result) => {
  // do something
})
```

#### Sample Data

```javascript
{
  "address": "TRTLv1pacKFJk9QgSmzk2LJWn14JGmTKzReFLz1RgY3K9Ryn7783RDT2TretzfYdck5GMCGzXTuwKfePWQYViNs4avKpnUbrwfQ",
  "amount": 100,
  "status": "OK"
}
```

### daemon.getBlocks(options)

*Not implemented*

### daemon.queryBlocks(options)

*Not implemented*

### daemon.queryBlocksLite(options)

Retrieves the last 100 blocks from the last block hash that the daemon knows about in the list provided

For the best results, the block hashes you supply should follow the following order:

The first 10 blocks are sequential descending, next goes in pow(2,n), like 2, 4, 8, 16, 32, 64 and so on, and the last one is always genesis block

#### Method Parameters

|Argument|Mandatory|Description|Format|
|---|---|---|---|
|blockHashes|Yes|The block hashes to query|strings|
|timestamp|No|The timestamp to query|integer|

#### Example Code

```javascript
daemon.queryBlocksLite({
  blockHashes: [
    '5b926d9fac41fbc53bf7c5ffc7e45e345f8c26aaefec9d3f9b019097a8827c12',
    '08aaf1b5cf2d7b62e12bd9182051225ccb1dabea9ee6847d969dbf60b08619af'
  ]
}).then((result) => {
  // do something
})
```

#### Example Data

***Note:*** Example data has been heavily truncated for display below.

```javascript
{
    "currentHeight": 612079,
    "fullOffset": 602009,
    "items": [
        {
            "blockShortInfo.block": [
                4,
                0,
                123,
                173,
                245,
                37,
                123,
                64,
                56,
                108,
                59,
                95,
                224
            ],
            "blockShortInfo.blockId": "08aaf1b5cf2d7b62e12bd9182051225ccb1dabea9ee6847d969dbf60b08619af",
            "blockShortInfo.txPrefixes": [
                {
                    "transactionPrefixInfo.txHash": "5898af29be9af1bd70bd8abe0cc8adab7d1b824a8860de0833da5e9eb06cd4df",
                    "transactionPrefixInfo.txPrefix": {
                        "extra": "011dfaca5515269db2c4f7aa422e1064ed8b32deebfe09316f72c0558ec3c4bd8f022100f3bb994d0787998c710905ddea5e1cd40adc318f953570036e5bb003809bc41c",
                        "unlock_time": 0,
                        "version": 1,
                        "vin": [
                            {
                                "type": "02",
                                "value": {
                                    "amount": 20000,
                                    "k_image": "8227547d28430bd014891056997741e50a5bbef59f7ed69a61d73dd3c5e18519",
                                    "key_offsets": [
                                        489700,
                                        7967,
                                        1,
                                        1,
                                        1,
                                        1
                                    ]
                                }
                            }
                        ],
                        "vout": [
                            {
                                "amount": 800,
                                "target": {
                                    "data": {
                                        "key": "ea4522afedd8e532d11e047409e7db76918a3f453706dfb61ed00e3aac54f76c"
                                    },
                                    "type": "02"
                                }
                            },
                            {
                                "amount": 7000,
                                "target": {
                                    "data": {
                                        "key": "cbad8e84098579d5d58614ba4edcbdee13fe933cc5bc4d889bf741cd97e0fae4"
                                    },
                                    "type": "02"
                                }
                            },
                            {
                                "amount": 60000,
                                "target": {
                                    "data": {
                                        "key": "d612ec8aacb4ee83b1b877d13126aea821117c0abf37102d5b11b56d55cfee33"
                                    },
                                    "type": "02"
                                }
                            },
                            {
                                "amount": 100000,
                                "target": {
                                    "data": {
                                        "key": "0121221682026d807f8a13222395ac9b7e05ef059090dec83feb6abdc9bb4c3a"
                                    },
                                    "type": "02"
                                }
                            },
                            {
                                "amount": 40000000,
                                "target": {
                                    "data": {
                                        "key": "8f4e23b602897c2b0643131166f674054977ed6fad645027537da7905691389b"
                                    },
                                    "type": "02"
                                }
                            }
                        ]
                    }
                }
            ]
        }
    ],
    "startHeight": 602009,
    "status": "OK"
}
```

### daemon.queryBlocksDetailed(options)

Retrieves the last 100 blocks from the last block hash that the daemon knows about in the list provided

For the best results, the block hashes you supply should follow the following order:

The first 10 blocks are sequential descending, next goes in pow(2,n), like 2, 4, 8, 16, 32, 64 and so on, and the last one is always genesis block

#### Method Parameters

|Argument|Mandatory|Description|Format|
|---|---|---|---|
|blockHashes|Yes|The block hashes to query|strings|
|timestamp|No|The timestamp to query|integer|
|blockCount|No|The number of blocks to return (2 <= count <= 100)|integer|

#### Example Code

```javascript
daemon.queryBlocksDetailed({
  blockHashes: [
    '7fb97df81221dd1366051b2d0bcdf49c66c22ac4431d879c895b06d66ef66f4c',
    '7fb97df81221dd1366051b2d0bc7f49c66c22ac4431d879c895b06d66ef66f4c'
  ]
}).then((result) => {
  // do something
})
```

#### Example Data

***Note:*** Example data has been heavily truncated for display below.

```javascript
{
  "blocks": [
    {
      "alreadyGeneratedCoins": 2980232,
      "alreadyGeneratedTransactions": 1,
      "baseReward": 2980232,
      "blockSize": 117,
      "difficulty": 1,
      "hash": "7fb97df81221dd1366051b2d0bc7f49c66c22ac4431d879c895b06d66ef66f4c",
      "index": 0,
      "majorVersion": 1,
      "minorVersion": 0,
      "nonce": 70,
      "prevBlockHash": "0000000000000000000000000000000000000000000000000000000000000000",
      "reward": 2980232,
      "sizeMedian": 0,
      "timestamp": 0,
      "totalFeeAmount": 0,
      "transactions": [
        {
          "blockHash": "7fb97df81221dd1366051b2d0bc7f49c66c22ac4431d879c895b06d66ef66f4c",
          "blockIndex": 0,
          "extra": {
            "nonce": [],
            "publicKey": "42694232c5b04151d9e4c27d31ec7a68ea568b19488cfcb422659a07a0e44dd5",
            "raw": ""
          },
          "fee": 0,
          "hash": "0d1c0f28b5f5eaa6a21c110eed1339ac9a9eb6a1689d8c31c51a011983069e9b",
          "inBlockchain": true,
          "inputs": [
            {
              "data": {
                "amount": 2980232,
                "input": {
                  "height": 0
                }
              },
              "type": "ff"
            }
          ],
          "mixin": 0,
          "outputs": [
            {
              "globalIndex": 0,
              "output": {
                "amount": 2980232,
                "target": {
                  "data": {
                    "key": "9b2e4c0281c0b02e7c53291a94d1d0cbff8883f8024f5142ee494ffbbd088071"
                  },
                  "type": "02"
                }
              }
            }
          ],
          "paymentId": "0000000000000000000000000000000000000000000000000000000000000000",
          "signatures": [],
          "signaturesSize": 0,
          "size": 77,
          "timestamp": 0,
          "totalInputsAmount": 0,
          "totalOutputsAmount": 2980232,
          "unlockTime": 10
        }
      ],
      "transactionsCumulativeSize": 77
    }
  ],
  "currentHeight": 968709,
  "fullOffset": 0,
  "startHeight": 0,
  "status": "OK"
}
```

### daemon.getIndexes(options)

Returns the output indexes of the transaction

#### Method Parameters

|Argument|Mandatory|Description|Format|
|---|---|---|---|
|transactionHash|Yes|The transaction hash|string|

#### Example Code

```javascript
daemon.getIndexes({
  transactionHash: "749099c72571142234f0c8a5b394621576fac72b82507daa386a69519e210d9b"
}).then((result) => {
  // do something
})
```

#### Example Data

```javascript
{
  "o_indexes": [
    144422,
    678884,
    685376,
    746333,
    418673,
    418674,
    90455,
    90456,
    21042,
    8445
  ],
  "status": "OK"
}
```

### daemon.getRandomOutputs(options)

#### Method Parameters

|Argument|Mandatory|Description|Format|
|---|---|---|---|
|amounts|Yes|The amounts for mixin in atomic units|integers|
|mixin|Yes|The number of mixins to return for each amount|integer|

#### Example Code

```javascript
daemon.getRandomOutputs({
  amounts: [
    100,
    1000
  ],
  mixin: 3
}).then((result) => {
  // do something
})
```

#### Example Data

```javascript
{
  "outs": [
    {
      "amount": 100,
      "outs": [
        {
          "global_amount_index": 862926,
          "out_key": "adcb0670f3709bb3380199f0f442e67a857da68917fde0b16d0bd7bb2672cb56"
        },
        {
          "global_amount_index": 862927,
          "out_key": "4c536a269ccfdd0b6211fb9303db842ac9e6ea166569f901bf3238d656701db6"
        },
        {
          "global_amount_index": 862928,
          "out_key": "7d38361739d054599893de18eab1055c451d7cf210684f761cf9f8f1862782dc"
        }
      ]
    },
    {
      "amount": 1000,
      "outs": [
        {
          "global_amount_index": 850191,
          "out_key": "85682f46c02ecc071b1f98af39752ffc61162e107d7c837a4cde96b184c6c55a"
        },
        {
          "global_amount_index": 850192,
          "out_key": "27cfee9e182b61cfe34935f73f4ef54c323dee5766c7cae06c0d84b1e5cdf67f"
        },
        {
          "global_amount_index": 850193,
          "out_key": "80befdebea397133f14f64a941682dc174f4eb139cf4542a37362371f7f66c42"
        }
      ]
    }
  ],
  "status": "OK"
}
```

### daemon.getPoolChanges(options)

Returns updates regarding the transaction mempool.

#### Method Parameters

|Argument|Mandatory|Description|Format|
|---|---|---|---|
|tailBlockHash|Yes|The last known block ID|string|
|knownTransactionHashes|Yes|The transaction hashes that we of|strings|

#### Example Code

```javascript
daemon.getPoolChanges({
  tailBlockHash: "410a8e6166a4582d592143c2a9bb062f6601712a7b7a99c0de71eebeb01d6521",
  knownTransactionHashes: []
}).then((result) => {
  // do something
})
```

***Note:*** Example data has been heavily truncated for display below.

#### Example Data

```javascript
{
  "addedTxs": [
    {
      "transactionPrefixInfo.txHash": "80060286cc4b46778e60a8b26a869719546c7c8b06de7ee16c01edc3e2774040",
      "transactionPrefixInfo.txPrefix": {
        "extra": "0122ee5a333e0bf7b7c8501a968a5ce1415f3b37c4312a779f2d704298a2ad3f12",
        "unlock_time": 0,
        "version": 1,
        "vin": [
          {
            "type": "02",
            "value": {
              "amount": 900000,
              "k_image": "d527587f9be05bd228f075b00965087597754be3a3953b15389a1965c0db390f",
              "key_offsets": [
                686585,
                386,
                1,
                1,
                1,
                1,
                1,
                1
              ]
            }
          },
          {
            "type": "02",
            "value": {
              "amount": 20000,
              "k_image": "41dfa44fb452fdf3a84a647b7808c785011218d7743c4e1877a926bfcb27f404",
              "key_offsets": [
                517914,
                312,
                1,
                1,
                1,
                1,
                1,
                1
              ]
            }
          }
        ],
        "vout": [
          {
            "amount": 50,
            "target": {
              "data": {
                "key": "150c0265d7bd1af9c78d3bb4fa43a4e4b3347b61403c01e29d347b23b450d5fe"
              },
              "type": "02"
            }
          },
          {
            "amount": 100,
            "target": {
              "data": {
                "key": "c5c0f3ffba4779e2a61778738f35fae11919bb087b0952e3ce334d157b7e7c17"
              },
              "type": "02"
            }
          }
        ]
      }
    }
  ],
  "deletedTxsIds": [],
  "isTailBlockActual": false,
  "status": "OK"
}
```

### daemon.getPoolChangesLite(options)

Returns updates regarding the transaction mempool.

#### Method Parameters

|Argument|Mandatory|Description|Format|
|---|---|---|---|
|tailBlockHash|Yes|The last known block ID|string|
|knownTransactionHashes|Yes|The transaction hashes that we of|strings|

#### Example Code

```javascript
daemon.getPoolChangesLite({
  tailBlockHash: "410a8e6166a4582d592143c2a9bb062f6601712a7b7a99c0de71eebeb01d6521",
  knownTransactionHashes: []
}).then((result) => {
  // do something
})
```

#### Example Data

***Note:*** Example data has been heavily truncated for display below.

```javascript
{
  "addedTxs": [
    {
      "transactionPrefixInfo.txHash": "80060286cc4b46778e60a8b26a869719546c7c8b06de7ee16c01edc3e2774040",
      "transactionPrefixInfo.txPrefix": {
        "extra": "0122ee5a333e0bf7b7c8501a968a5ce1415f3b37c4312a779f2d704298a2ad3f12",
        "unlock_time": 0,
        "version": 1,
        "vin": [
          {
            "type": "02",
            "value": {
              "amount": 900000,
              "k_image": "d527587f9be05bd228f075b00965087597754be3a3953b15389a1965c0db390f",
              "key_offsets": [
                686585,
                386,
                1,
                1,
                1,
                1,
                1,
                1
              ]
            }
          },
          {
            "type": "02",
            "value": {
              "amount": 20000,
              "k_image": "41dfa44fb452fdf3a84a647b7808c785011218d7743c4e1877a926bfcb27f404",
              "key_offsets": [
                517914,
                312,
                1,
                1,
                1,
                1,
                1,
                1
              ]
            }
          }
        ],
        "vout": [
          {
            "amount": 50,
            "target": {
              "data": {
                "key": "150c0265d7bd1af9c78d3bb4fa43a4e4b3347b61403c01e29d347b23b450d5fe"
              },
              "type": "02"
            }
          },
          {
            "amount": 100,
            "target": {
              "data": {
                "key": "c5c0f3ffba4779e2a61778738f35fae11919bb087b0952e3ce334d157b7e7c17"
              },
              "type": "02"
            }
          }
        ]
      }
    }
  ],
  "deletedTxsIds": [],
  "isTailBlockActual": false,
  "status": "OK"
}
```

### daemon.getBlockDetailsByHeight(options)

#### Method Parameters

|Argument|Mandatory|Description|Format|
|---|---|---|---|
|blockHeight|Yes|The height of the block|integer|

#### Example Code

```javascript
daemon.getBlockDetailsByHeight({
  blockHeight: 600000
}).then((result => {
  // do something
}))
```

#### Example Data

```javascript
{
  "block": {
    "alreadyGeneratedCoins": 1771716825122,
    "alreadyGeneratedTransactions": 1305440,
    "baseReward": 2927431,
    "blockSize": 419,
    "difficulty": 352722224,
    "hash": "234266e7a2b03534df7d7a0b9403eeaabad316b86222575076c599f77c812200",
    "index": 600000,
    "majorVersion": 4,
    "minorVersion": 0,
    "nonce": 31311,
    "prevBlockHash": "680fc502a073a637a4d4e61f6011fac2271ff9942975cce98a52a2bcf92c775a",
    "reward": 2927431,
    "sizeMedian": 300,
    "timestamp": 1530957955,
    "totalFeeAmount": 0,
    "transactions": [
      {
        "blockHash": "234266e7a2b03534df7d7a0b9403eeaabad316b86222575076c599f77c812200",
        "blockIndex": 600000,
        "extra": {
          "nonce": [
            0,
            0,
            0,
            1,
            44,
            181,
            35,
            112
          ],
          "publicKey": "83b89ff22edc8f1ed2cc80add101363695fb3ab30c9286c50c56241e5f8b67b5",
          "raw": ""
        },
        "fee": 0,
        "hash": "f33287faa27c979d360eb05dce1b9b64d6308b8328ab7ad7a1001a07838fc20f",
        "inBlockchain": true,
        "inputs": [
          {
            "data": {
              "amount": 2927431,
              "input": {
                "height": 600000
              }
            },
            "type": "ff"
          }
        ],
        "mixin": 0,
        "outputs": [
          {
            "globalIndex": 750578,
            "output": {
              "amount": 1,
              "target": {
                "data": {
                  "key": "d2f3c5c17b0ef6564b715ec699e246aeb6fe4fa4984de0b556a1da686d0e381c"
                },
                "type": "02"
              }
            }
          },
          {
            "globalIndex": 141864,
            "output": {
              "amount": 30,
              "target": {
                "data": {
                  "key": "e5b98f54123a61a211545c4e8715956aae92123dbd9965e85e351532ad33340e"
                },
                "type": "02"
              }
            }
          },
          {
            "globalIndex": 659408,
            "output": {
              "amount": 400,
              "target": {
                "data": {
                  "key": "5caec873a5a857aec23ebc43400c4d3bd93aaf61a282f77a397f2a567d940021"
                },
                "type": "02"
              }
            }
          },
          {
            "globalIndex": 577457,
            "output": {
              "amount": 7000,
              "target": {
                "data": {
                  "key": "8ac48329110e5dadd12c2a9c282f98d689e263d9a8bb55b6ff36774865e18f25"
                },
                "type": "02"
              }
            }
          },
          {
            "globalIndex": 493814,
            "output": {
              "amount": 20000,
              "target": {
                "data": {
                  "key": "09c981fb2d7e29b49ad482d31e0b986cab19aac15d3777be97a37c3a89738590"
                },
                "type": "02"
              }
            }
          },
          {
            "globalIndex": 672983,
            "output": {
              "amount": 900000,
              "target": {
                "data": {
                  "key": "dcf992ce17b4217ca27cb0e9539d951014a156733080a04292ed3a87ba961c65"
                },
                "type": "02"
              }
            }
          },
          {
            "globalIndex": 674598,
            "output": {
              "amount": 2000000,
              "target": {
                "data": {
                  "key": "a53316195cbaf416749ced48d0a426ca2d0e790c694120abb9679b1c6175aef2"
                },
                "type": "02"
              }
            }
          }
        ],
        "paymentId": "0000000000000000000000000000000000000000000000000000000000000000",
        "signatures": [],
        "signaturesSize": 0,
        "size": 300,
        "timestamp": 1530957955,
        "totalInputsAmount": 0,
        "totalOutputsAmount": 2927431,
        "unlockTime": 600040
      }
    ],
    "transactionsCumulativeSize": 300
  },
  "status": "OK"
}
```

### daemon.getBlocksDetailsByHeights(options)

### Method Parameters

|Argument|Mandatory|Description|Format|
|---|---|---|---|
|blockHeights|Yes|The height of the block|integer|

#### Example Code

```javascript
daemon.getBlocksDetailsByHeights({
  blockHeights: [
    500000,
    600000
  ]
}).then((result) => {
  // do something
})
```

#### Example Data

***Note:*** Example data has been heavily truncated for display below.

```javascript
{
  "blocks": [
    {
      "alreadyGeneratedCoins": 1771716825122,
      "alreadyGeneratedTransactions": 1305440,
      "baseReward": 2927431,
      "blockSize": 419,
      "difficulty": 352722224,
      "hash": "234266e7a2b03534df7d7a0b9403eeaabad316b86222575076c599f77c812200",
      "index": 600000,
      "majorVersion": 4,
      "minorVersion": 0,
      "nonce": 31311,
      "prevBlockHash": "680fc502a073a637a4d4e61f6011fac2271ff9942975cce98a52a2bcf92c775a",
      "reward": 2927431,
      "sizeMedian": 300,
      "timestamp": 1530957955,
      "totalFeeAmount": 0,
      "transactions": [
        {
          "blockHash": "234266e7a2b03534df7d7a0b9403eeaabad316b86222575076c599f77c812200",
          "blockIndex": 600000,
          "extra": {
            "nonce": [
              0,
              0,
              0,
              1,
              44,
              181,
              35,
              112
            ],
            "publicKey": "83b89ff22edc8f1ed2cc80add101363695fb3ab30c9286c50c56241e5f8b67b5",
            "raw": ""
          },
          "fee": 0,
          "hash": "f33287faa27c979d360eb05dce1b9b64d6308b8328ab7ad7a1001a07838fc20f",
          "inBlockchain": true,
          "inputs": [
            {
              "data": {
                "amount": 2927431,
                "input": {
                  "height": 600000
                }
              },
              "type": "ff"
            }
          ],
          "mixin": 0,
          "outputs": [
            {
              "globalIndex": 750578,
              "output": {
                "amount": 1,
                "target": {
                  "data": {
                    "key": "d2f3c5c17b0ef6564b715ec699e246aeb6fe4fa4984de0b556a1da686d0e381c"
                  },
                  "type": "02"
                }
              }
            },
            {
              "globalIndex": 141864,
              "output": {
                "amount": 30,
                "target": {
                  "data": {
                    "key": "e5b98f54123a61a211545c4e8715956aae92123dbd9965e85e351532ad33340e"
                  },
                  "type": "02"
                }
              }
            },
            {
              "globalIndex": 659408,
              "output": {
                "amount": 400,
                "target": {
                  "data": {
                    "key": "5caec873a5a857aec23ebc43400c4d3bd93aaf61a282f77a397f2a567d940021"
                  },
                  "type": "02"
                }
              }
            },
            {
              "globalIndex": 577457,
              "output": {
                "amount": 7000,
                "target": {
                  "data": {
                    "key": "8ac48329110e5dadd12c2a9c282f98d689e263d9a8bb55b6ff36774865e18f25"
                  },
                  "type": "02"
                }
              }
            },
            {
              "globalIndex": 493814,
              "output": {
                "amount": 20000,
                "target": {
                  "data": {
                    "key": "09c981fb2d7e29b49ad482d31e0b986cab19aac15d3777be97a37c3a89738590"
                  },
                  "type": "02"
                }
              }
            },
            {
              "globalIndex": 672983,
              "output": {
                "amount": 900000,
                "target": {
                  "data": {
                    "key": "dcf992ce17b4217ca27cb0e9539d951014a156733080a04292ed3a87ba961c65"
                  },
                  "type": "02"
                }
              }
            },
            {
              "globalIndex": 674598,
              "output": {
                "amount": 2000000,
                "target": {
                  "data": {
                    "key": "a53316195cbaf416749ced48d0a426ca2d0e790c694120abb9679b1c6175aef2"
                  },
                  "type": "02"
                }
              }
            }
          ],
          "paymentId": "0000000000000000000000000000000000000000000000000000000000000000",
          "signatures": [],
          "signaturesSize": 0,
          "size": 300,
          "timestamp": 1530957955,
          "totalInputsAmount": 0,
          "totalOutputsAmount": 2927431,
          "unlockTime": 600040
        }
      ],
      "transactionsCumulativeSize": 300
    },
    {
      "alreadyGeneratedCoins": 1478791810384,
      "alreadyGeneratedTransactions": 968669,
      "baseReward": 2936160,
      "blockSize": 22041,
      "difficulty": 285124963,
      "hash": "62f0058453292af5e1aa070f8526f7642ab6974c6af2c17088c21b31679c813d",
      "index": 500000,
      "majorVersion": 4,
      "minorVersion": 0,
      "nonce": 1073751151,
      "prevBlockHash": "74a45602da61b8b8ff565b1c81c854416046a23ca53f4416684ffaa60bc50796",
      "reward": 2936280,
      "sizeMedian": 299,
      "timestamp": 1527834137,
      "totalFeeAmount": 120,
      "transactions": [
        {
          "blockHash": "62f0058453292af5e1aa070f8526f7642ab6974c6af2c17088c21b31679c813d",
          "blockIndex": 500000,
          "extra": {
            "nonce": [
              0,
              0,
              0,
              0,
              149,
              103,
              16,
              182
            ],
            "publicKey": "9e430ecdd501714900c71cb45fd49b4fa77ebd4a68d967cc2419ccd4e72378e3",
            "raw": ""
          },
          "fee": 0,
          "hash": "702ad5bd04b9eff14b080d508f69a320da1909e989d6c163c18f80ae7a5ab832",
          "inBlockchain": true,
          "inputs": [
            {
              "data": {
                "amount": 2936280,
                "input": {
                  "height": 500000
                }
              },
              "type": "ff"
            }
          ],
          "mixin": 0,
          "outputs": [
            {
              "globalIndex": 129866,
              "output": {
                "amount": 80,
                "target": {
                  "data": {
                    "key": "5ce69a87940df7ae8443261ff610861d2e4207a7556ef1aa35878c0a5e7e382d"
                  },
                  "type": "02"
                }
              }
            },
            {
              "globalIndex": 507629,
              "output": {
                "amount": 200,
                "target": {
                  "data": {
                    "key": "7c7f316befaac16ba3782a2ce489e7c0f16c2b733ac0eaa0a72a12ee637822e9"
                  },
                  "type": "02"
                }
              }
            },
            {
              "globalIndex": 462361,
              "output": {
                "amount": 6000,
                "target": {
                  "data": {
                    "key": "defcb7eb6537bf0a63368ed464df10197e67d7ea8f080e885911cf9ea71abb62"
                  },
                  "type": "02"
                }
              }
            },
            {
              "globalIndex": 318744,
              "output": {
                "amount": 30000,
                "target": {
                  "data": {
                    "key": "9693e864dba53f308d0b59623c608b6fe16bbdc7cdc75be94f78582d547b46a4"
                  },
                  "type": "02"
                }
              }
            },
            {
              "globalIndex": 560355,
              "output": {
                "amount": 900000,
                "target": {
                  "data": {
                    "key": "b739e9fbaa3ee976a9ed8ad93a2731ee191c384cf136929e737786573fcd3e96"
                  },
                  "type": "02"
                }
              }
            },
            {
              "globalIndex": 559781,
              "output": {
                "amount": 2000000,
                "target": {
                  "data": {
                    "key": "5621667d44e7ffb87e5010a5984c188f58a799efb01569e8e42fa2415bb7d14a"
                  },
                  "type": "02"
                }
              }
            }
          ],
          "paymentId": "0000000000000000000000000000000000000000000000000000000000000000",
          "signatures": [],
          "signaturesSize": 0,
          "size": 266,
          "timestamp": 1527834137,
          "totalInputsAmount": 0,
          "totalOutputsAmount": 2936280,
          "unlockTime": 500040
        }
      ],
      "transactionsCumulativeSize": 21826
    }
  ],
  "status": "OK"
}
```

#### Example Data

### daemon.getBlocksDetailsByHashes(options)

#### Method Parameters

|Argument|Mandatory|Description|Format|
|---|---|---|---|
|blockHashes|Yes|The height of the block|integer|

#### Example Code

```javascript
daemon.getBlocksDetailsByHashes({
  blockHashes: [
    '4c4ce202a918f52a5f777be3de160bbe579f8cd7bd1e8a097b5f46bac900d471',
    'eb84504720dba262bc02d79d922f9f183eb394586874e27c3fc6f4d0c76e31ed'
  ]
}).catch((result) => {
  // do something
})
```

#### Example Data

***Note:*** Example data has been heavily truncated for display below.

```javascript
{
  "blocks": [
    {
      "alreadyGeneratedCoins": 1808203639746,
      "alreadyGeneratedTransactions": 1330685,
      "baseReward": 2926343,
      "blockSize": 13934,
      "difficulty": 314009623,
      "hash": "4c4ce202a918f52a5f777be3de160bbe579f8cd7bd1e8a097b5f46bac900d471",
      "index": 612471,
      "majorVersion": 4,
      "minorVersion": 0,
      "nonce": 1610784534,
      "prevBlockHash": "190f172acd54b046a25da64011494cf96d544054f47f122575101501c19c7e5a",
      "reward": 2926603,
      "sizeMedian": 300,
      "timestamp": 1531346993,
      "totalFeeAmount": 260,
      "transactions": [
        {
          "blockHash": "4c4ce202a918f52a5f777be3de160bbe579f8cd7bd1e8a097b5f46bac900d471",
          "blockIndex": 612471,
          "extra": {
            "nonce": [
              0,
              0,
              0,
              0,
              238,
              107,
              222,
              230
            ],
            "publicKey": "e04d60524955cadc8e85d27a3d980615207b7b311453460a5f37a993900d7dcd",
            "raw": ""
          },
          "fee": 0,
          "hash": "053279175b6ddb5addd970895a3e2844a19945f368a22d83e446fff43b20eaa9",
          "inBlockchain": true,
          "inputs": [
            {
              "data": {
                "amount": 2926603,
                "input": {
                  "height": 612471
                }
              },
              "type": "ff"
            }
          ],
          "mixin": 0,
          "outputs": [
            {
              "globalIndex": 129418,
              "output": {
                "amount": 3,
                "target": {
                  "data": {
                    "key": "88ccc941391aa6fd435e37d966e15a2e9eee4c10b02108275a6d69d34393d8d5"
                  },
                  "type": "02"
                }
              }
            },
            {
              "globalIndex": 668484,
              "output": {
                "amount": 600,
                "target": {
                  "data": {
                    "key": "788b0b6863aa306aca591e2d009ef42347e4f729ff4db10b3381762998bf5878"
                  },
                  "type": "02"
                }
              }
            },
            {
              "globalIndex": 617579,
              "output": {
                "amount": 6000,
                "target": {
                  "data": {
                    "key": "6a33bf41c6107eca3b0604964bf35cf1a466e801fd768cc0bdb2e59d2cc7164d"
                  },
                  "type": "02"
                }
              }
            },
            {
              "globalIndex": 518420,
              "output": {
                "amount": 20000,
                "target": {
                  "data": {
                    "key": "5a834a37d15dc84d0172853d86d77b41107e59924e8bc0879afb016f16fae050"
                  },
                  "type": "02"
                }
              }
            },
            {
              "globalIndex": 687102,
              "output": {
                "amount": 900000,
                "target": {
                  "data": {
                    "key": "e41ea0648831743b41a9f787e714782101e37078dbec41aa1c8a36e65b008aee"
                  },
                  "type": "02"
                }
              }
            },
            {
              "globalIndex": 688849,
              "output": {
                "amount": 2000000,
                "target": {
                  "data": {
                    "key": "7b59e82240d5e5f292f6285cd44a20acb024760fe81cad971fc332f89411365e"
                  },
                  "type": "02"
                }
              }
            }
          ],
          "paymentId": "0000000000000000000000000000000000000000000000000000000000000000",
          "signatures": [],
          "signaturesSize": 0,
          "size": 266,
          "timestamp": 1531346993,
          "totalInputsAmount": 0,
          "totalOutputsAmount": 2926603,
          "unlockTime": 612511
        }
      ],
      "transactionsCumulativeSize": 13719
    },
    {
      "alreadyGeneratedCoins": 1808191934374,
      "alreadyGeneratedTransactions": 1330678,
      "baseReward": 2926344,
      "blockSize": 419,
      "difficulty": 190461298,
      "hash": "eb84504720dba262bc02d79d922f9f183eb394586874e27c3fc6f4d0c76e31ed",
      "index": 612467,
      "majorVersion": 4,
      "minorVersion": 0,
      "nonce": 131149,
      "prevBlockHash": "2ede9401c343e95bd3da81e20f29fa059511baf67a64c91936aef3d192d7491a",
      "reward": 2926344,
      "sizeMedian": 300,
      "timestamp": 1531346880,
      "totalFeeAmount": 0,
      "transactions": [
        {
          "blockHash": "eb84504720dba262bc02d79d922f9f183eb394586874e27c3fc6f4d0c76e31ed",
          "blockIndex": 612467,
          "extra": {
            "nonce": [
              0,
              0,
              0,
              0,
              219,
              27,
              250,
              196
            ],
            "publicKey": "e4168284b7e63e432cb29ba9fb6d56e593ccae7c8a4e7c50b02b001a63f28bb5",
            "raw": ""
          },
          "fee": 0,
          "hash": "f69baa3c2ac707cc7325fea9a3b08ca1c3b677e90a28ba3dcb7b430e2fe7dbe6",
          "inBlockchain": true,
          "inputs": [
            {
              "data": {
                "amount": 2926344,
                "input": {
                  "height": 612467
                }
              },
              "type": "ff"
            }
          ],
          "mixin": 0,
          "outputs": [
            {
              "globalIndex": 123590,
              "output": {
                "amount": 4,
                "target": {
                  "data": {
                    "key": "dc5f38fe0c75e96c1cb3f5805da2bfe12e63919ae373216f322d6e4360904cce"
                  },
                  "type": "02"
                }
              }
            },
            {
              "globalIndex": 148934,
              "output": {
                "amount": 40,
                "target": {
                  "data": {
                    "key": "0288bb8f25cc20c5c32183402e828c601dece14477fa21ae688f66a24f6444b9"
                  },
                  "type": "02"
                }
              }
            },
            {
              "globalIndex": 679523,
              "output": {
                "amount": 300,
                "target": {
                  "data": {
                    "key": "806558329e9ca064007152b8df404135542b7d237da10365939d48a4216b00c9"
                  },
                  "type": "02"
                }
              }
            },
            {
              "globalIndex": 617575,
              "output": {
                "amount": 6000,
                "target": {
                  "data": {
                    "key": "871c8170db4e76b96d8575054959eb948fd444b2e6666e08a374c9fbcf67b111"
                  },
                  "type": "02"
                }
              }
            },
            {
              "globalIndex": 518416,
              "output": {
                "amount": 20000,
                "target": {
                  "data": {
                    "key": "c8703368fc6c14302906a307ae31d44400e141ae320d786c134a057289a1b36c"
                  },
                  "type": "02"
                }
              }
            },
            {
              "globalIndex": 687098,
              "output": {
                "amount": 900000,
                "target": {
                  "data": {
                    "key": "cc393f9ec8dc06cf578706b340de1d2151992c8652b57605a57fbfa90d73497e"
                  },
                  "type": "02"
                }
              }
            },
            {
              "globalIndex": 688845,
              "output": {
                "amount": 2000000,
                "target": {
                  "data": {
                    "key": "fbcc4ddf81b5998ede5b7f9b7664b56533bee274f4a88f7310f532bf6837c548"
                  },
                  "type": "02"
                }
              }
            }
          ],
          "paymentId": "0000000000000000000000000000000000000000000000000000000000000000",
          "signatures": [],
          "signaturesSize": 0,
          "size": 300,
          "timestamp": 1531346880,
          "totalInputsAmount": 0,
          "totalOutputsAmount": 2926344,
          "unlockTime": 612507
        }
      ],
      "transactionsCumulativeSize": 300
    }
  ],
  "status": "OK"
}
```

### daemon.getBlocksHashesByTimestamps(options)

#### Method Parameters

|Argument|Mandatory|Description|Format|
|---|---|---|---|
|timestampBegin|Yes|The Unix Timestamp to search from|integer|
|seconds|Yes|How many seconds to search for|integer|

#### Example Code

```javascript
daemon.getBlocksHashesByTimestamps({
  timestampBegin: 1531348100,
  seconds: 240
}).catch((result) => {
  // do something
})
```

#### Example Data

```javascript
{
  "blockHashes": [
    "6ab1b7f252b775edd02d230624a93144d8e5a731062ae36bc461720ce8b0e6a1",
    "61674df46bae0fbedb5d9394e2f223a61fcfe45f7fbea6a96d56ae3d78e12a0e"
  ],
  "status": "OK"
}
```

### daemon.getTransactionDetailsByHashes(options)

#### Method Parameters

|Argument|Mandatory|Description|Format|
|---|---|---|---|
|transactionHashes|Yes|The transactions hashes to search for|strings|

#### Example Code

```javascript
daemon.getTransactionDetailsByHashes({
  transactionHashes: [
    "8620c2f19b00182beb407023848305889baaa5202f3664c9efa70a843bf26c7b",
    "687c487be84153ead8e70e3873d30f334316fc7d9ed052dd0575faad57d135dd"
  ]
}).catch((result) => {
  // do something
})
```

#### Example Data

***Note:*** Example data has been heavily truncated for display below.

```javascript
{
  "status": "OK",
  "transactions": [
    {
      "blockHash": "12ec0675db0fbc83b3683e62e883626afc723c0943f868adf15e4bff2faa4578",
      "blockIndex": 612486,
      "extra": {
        "nonce": [],
        "publicKey": "998e47b2e6ae96d44e3e8e06ca1c94408a724c09390cb738b44160dbdbca13b3",
        "raw": ""
      },
      "fee": 80,
      "hash": "8620c2f19b00182beb407023848305889baaa5202f3664c9efa70a843bf26c7b",
      "inBlockchain": true,
      "inputs": [
        {
          "data": {
            "input": {
              "amount": 200,
              "k_image": "5378332f1ee541054a2a824420730b0b5dd43fa478ae51b1999e39de97d05176",
              "key_offsets": [
                684366,
                1720
              ]
            },
            "mixin": 2,
            "output": {
              "number": 36,
              "transactionHash": "f4aa0f84ef0e4105dd3a8df6935eb8976b9f00546dd071bd5223c819e65a8750"
            }
          },
          "type": "02"
        }
      ],
      "mixin": 2,
      "outputs": [
        {
          "globalIndex": 754310,
          "output": {
            "amount": 1,
            "target": {
              "data": {
                "key": "83cc2affe76a7a688b4b9f14d26fa825c653d427b0589710fa0e03f24f24b4fe"
              },
              "type": "02"
            }
          }
        }
      ],
      "paymentId": "0000000000000000000000000000000000000000000000000000000000000000",
      "signatures": [
        {
          "first": 0,
          "second": "2e7147d12e96496626658347e883c6650d5eadba41aff5549c95bd2d8f1ff40eebabfa35d5e871c11c1b2d5a7316593dac99d27878561ec37b8b166f8ce5ff0f"
        },
        {
          "first": 0,
          "second": "53b448aafcbce888b424c5c54994250d64080a7449f4d68904c1e9162aa7290bdefee3e666cfb4853a9e863ed454e0fac4ed6f61913e5f58a8548fe424f30e0c"
        },
        {
          "first": 1,
          "second": "f9e2ce758bf12402c51407f1f32332a851d606928b4f16c1685a650e5df0c90bbd50e38bdc29dac8c286810276a1430e5008463a458c9ed537bcb357753af709"
        }
      ],
      "signaturesSize": 5,
      "size": 2447,
      "timestamp": 1531347605,
      "totalInputsAmount": 2006970,
      "totalOutputsAmount": 2006890,
      "unlockTime": 0
    },
    {
      "blockHash": "3aedc3dc87ce935d8cfd35722b94e6d9cee837eb2ce759df0647463df4e22fd8",
      "blockIndex": 612488,
      "extra": {
        "nonce": [],
        "publicKey": "6580ed699dd3cd96abd534203a44af8a185396e381d4b24320fd3c6ffb574a77",
        "raw": ""
      },
      "fee": 100,
      "hash": "687c487be84153ead8e70e3873d30f334316fc7d9ed052dd0575faad57d135dd",
      "inBlockchain": true,
      "inputs": [
        {
          "data": {
            "input": {
              "amount": 2000000,
              "k_image": "82d1b7f179d4af8775af32cb28fb3d1093bf1f18445150bddfafceca5174127d",
              "key_offsets": [
                688630,
                88,
                1,
                1,
                1,
                1,
                1,
                1
              ]
            },
            "mixin": 8,
            "output": {
              "number": 6,
              "transactionHash": "14b8f13a8da88372998672d96fee2d8abe12b242ce665c2335b2d3429e19886a"
            }
          },
          "type": "02"
        }
      ],
      "mixin": 8,
      "outputs": [
        {
          "globalIndex": 863096,
          "output": {
            "amount": 100,
            "target": {
              "data": {
                "key": "093b82f668cfa8085baef287e05932bd4cd2e2ac2c4ad335ebb8d296b730bf07"
              },
              "type": "02"
            }
          }
        }
      ],
      "paymentId": "0000000000000000000000000000000000000000000000000000000000000000",
      "signatures": [
        {
          "first": 0,
          "second": "122df3feb63a60cd62b841f073b7ae8cb4cc7936fd0727bae7e9268f23378f085f6fa7422060a66d8ac506bb17cc2fbdb0afb7e8082c170b8a72ae86d408380e"
        },
        {
          "first": 0,
          "second": "093f2b7c31db755e4e2cadbc3488f65e5aa45656db99aed8e27f2f5bc28cf10556ce480fc31f64e8b69c906af5d9414f4f6301de33f68df0ce5b0a4a537dd503"
        }
      ],
      "signaturesSize": 3,
      "size": 4516,
      "timestamp": 1531347673,
      "totalInputsAmount": 6000000,
      "totalOutputsAmount": 5999900,
      "unlockTime": 0
    }
  ]
}
```

### daemon.getTransactionHashesByPaymentId(options)

#### Method Parameters

|Argument|Mandatory|Description|Format|
|---|---|---|---|
|paymentId|Yes|The payment ID to search for|string|

#### Example Code

```javascript
daemon.getTransactionHashesByPaymentId({
  paymentId: "80ec855eef7df4bce718442cabe086f19dfdd0d03907c7768eddb8eca8c5a667"
}).catch((result) => {
  // do something
})
```

#### Example Data

***Note:*** Example data has been heavily truncated for display below.

```javascript
{
  "status": "OK",
  "transactionHashes": [
    "094c306871bae7fceb3f49a4323c37cf43f6e8047e3ee8868ae5de00dd7007c4",
    "58ffb22616e77e0a5bbbd4c29c890e6cbff736e2ca7276c682c12897224ab351",
    "1a48506c1eeb479e59c8bf56e9e64cfb2d63941c4cee2f7f39198787208a12cb",
    "a93ef651ef8d5305509e4c66e9ef64b015538ee28f3c9862cacbe2cfeede6b94",
    "99131237a1c9abe1fe5292ef519b34c6c18455bc5d9ad5ecff5218608a3961b9",
    "ef789d444f9276196b7e5d33c87bd843ee8a1f1a24bf30490394b2839d38c037",
    "2944c1e5e90fae53cbe614bd8e6bf972366c97e2c39f450a47d1fc28351f49f1",
    "55a4e615d3bcd8d58ea8272de6272b4daa0bb4e32c4b6ea937168e0827d83390",
    "1516fdb7ace7ec8b0cc3c95a7cd0f60ec3757ef2e72e01c4d654500080760a18",
    "ee3d241d46bcc3bd04809eec0a455f7db68ca126857e37119ad4794d747d73bb",
    "095198817491c1f232f81a7a79257752a78e2215ce2c6c6606d74abab7f1a07e"
  ]
}
```

### daemon.getWalletSyncData(options)

Returns up to 100 blocks. If block hash checkpoints are given, it will return
beginning from the height of the first hash it finds, plus one.

However, if startHeight or startTimestamp is given, and this value is higher
than the block hash checkpoints, it will start returning from that height instead.

The block hash checkpoints should be given with the highest block height hashes
first.

Typical usage: specify a start height/timestamp initially, and from then on,
also provide the returned block hashes.

#### Method Parameters

|Argument|Mandatory|Description|Format|
|---|---|---|---|
|startHeight|No|The height to begin returning blocks from|integer|
|startTimestamp|No|The timestamp to begin returning blocks from (unix style)|integer|
|blockHashCheckpoints|No|The timestamp to begin returning blocks from|strings|
|skipCoinbaseTransactions|No|Whether to skip returning any coinbase transactions or blocks containing only such|boolean|

#### Example Code

```javascript
daemon.getWalletSyncData({
  startHeight: 1000,
  blockHashCheckpoints: [
    "0606a15147159e3f01dd90aa78828cf8587caed36203cd764701b56eb6ff6fd8",
    "1d61bf052ee2fa3720078ee01cf30e01ba305096bf3e3d3668fbc09bbeafa244"
  ],
  skipCoinbaseTransactions: false
}).then((blocks) => {
  // do something
}).catch((result) => {
  // do something
})
```

#### Example Data

***Note:*** Example data has been heavily truncated for display below.

```javascript
[
    {
      "blockHash": "221e7c19b11473c78694369945ef2b46d327255a3cf27e827c1da5a9971a4cbc",
      "blockHeight": 1106498,
      "blockTimestamp": 1546214436,
      "coinbaseTX": {
        "hash": "6c2a9be4897d6b60b8c093bc3c7e24624910ae162f9b8d2b8c1f1b8156219e85",
        "outputs": [
          {
            "amount": 6,
            "key": "d8d4d10e6d663b4bdad910b93141f6b289be6c091097bcb9f140c37d3f5df95e"
          },
          {
            "amount": 20,
            "key": "bb6032cb23b0c6c936897071b4a414381fd0c4c22f1353a4e09ef9e5e6ded4b0"
          },
          {
            "amount": 800,
            "key": "cc31e9d568a2013e600d3da523c4d7edc51e4d166a8ce4667bed75353ceed323"
          },
          {
            "amount": 3000,
            "key": "5c847e85a006b914ae170e30e9f7899fd0187e10e0428e6636f024766fabc401"
          },
          {
            "amount": 80000,
            "key": "6f784909cfacdbe89948df275710f214def9873b19ae9b6c1ea45cb5b29df9df"
          },
          {
            "amount": 800000,
            "key": "a8c1f615f51a1caae91d50e4a5ba0fb71ae2d02a66e684ec3636df091da82b66"
          },
          {
            "amount": 2000000,
            "key": "d49965a46be6e5b95401c119a8a884bd259e66d3a0ec68ba8ee759eb6c7c26bf"
          }
        ],
        "txPublicKey": "8770d63f4211bfe8f50c2344ee000e99c4023a9de382c36bfaa20846f71e8958",
        "unlockTime": 1106538
      },
      "transactions": [
        {
          "hash": "f6316d35ab64080165c6c0476e9382306de3a5ff3367b32ac36acd0e0d374f40",
          "inputs": [
            {
              "amount": 2000000,
              "k_image": "52e6c9c96664693178f2f2cafef5200aa2e6ae2e1dd413c606dd7ce1bec77f2d",
              "key_offsets": [
                1259742,
                6216,
                1,
                1
              ]
            }
          ],
          "outputs": [
            {
              "amount": 4000000,
              "key": "309bca3a13c4b2e4eb592b9751619945e5d49e74993fbdca9c74e403a03b52d6"
            }
          ],
          "paymentID": "",
          "txPublicKey": "01213035e9be3db80afa81e5d0d0305ffaad00513f0f3f38deff67d6bc9c3a6b",
          "unlockTime": 0
        },
      ]
    }
]
```

### daemon.getGlobalIndexesForRange(options)

Returns the global indexes for any transactions in the range [startHeight .. endHeight].
Generally, you only want the global index for a specific transaction, however,
this reveals that you probably are the recipient of this transaction. By
supplying a range of blocks, you can obfusticate which transaction you are
enquiring about.

Note: key = transaction hash, value = global indexes for the outputs in that hash.

#### Method Parameters

|Argument|Mandatory|Description|Format|
|---|---|---|---|
|startHeight|No|The height to begin returning indices from|integer|
|endHeight|No|The height to end returning indices from |integer|

#### Example Code

```javascript
daemon.getGlobalIndexesForRange({
    startHeight: 12345,
    endHeight: 12347
}).then((indexes) => {
  // do something
}).catch((result) => {
  // do something
})
```

#### Example Data

```javascript
[
    {
      "key": "e4331d0453affa0a61c441dd422f9159cbb4a82006051ef23dbfbd61cefa0256",
      "value": [
        1271,
        1244,
        1866,
        9858,
        9824,
        12428,
        12418
      ]
    },
    {
      "key": "0e8d74b89d79f30bb33d74037259a34a6d86f13aa2c6d2c7716e2831aa1a82a9",
      "value": [
        1272,
        1245,
        1867,
        9859,
        9825,
        12429,
        12419
      ]
    }
]
```

### daemon.getTransactionsStatus(options)

Returns the status of the transaction hashes given to the daemon.

transactionsInPool = Transactions that are in the daemons mempool, but not in a
block yet.

transactionsInBlock = Transactions that have been included into a block.

transactionsUnknown = Transactions the daemon doesn't know anything about.

#### Method Parameters

|Argument|Mandatory|Description|Format|
|---|---|---|---|
|transactionHashes|Yes|The transaction hashes to query|strings|

#### Example Code

```javascript
daemon.getTransactionsStatus({
  transactionHashes: [
    '549828e75151982b0e51b27e8f53b26ebc174f0ef78063984c8952b13e2a3564',
    '549828e75151982b0e51b27e8f53b26ebc174f0ef78063984c8952b13e2a3563'
  ]
}).then((txStatus) => {
  // do something
}).catch((result) => {
  // do something
})
```

#### Example Data

```javascript
{
  "transactionsInBlock": [
    "549828e75151982b0e51b27e8f53b26ebc174f0ef78063984c8952b13e2a3564"
  ],
  "transactionsInPool": [],
  "transactionsUnknown": [
    "549828e75151982b0e51b27e8f53b26ebc174f0ef78063984c8952b13e2a3563"
  ]
}
```

## WalletAPI Interface

All of the `wallet-api` commands are exposed via the `wallet` interface. This utilizes [Javascript Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises). Always handle your promise catches.

***Special Note:*** Any and all amounts/fees will already be in HUMAN readable units. DO NOT DIVIDE THEM AGAIN unless you've specified ```decimalDivisor``` as ```1``` in the options. You have been warned.

Some paramters may be *optional* or *required* as documented.

Some of the descriptions of the functions were re-used from @zpalmtree's [Wallet-API Docs](https://github.com/turtlecoin/wallet-api-docs) and are released under the [Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0).

### wallet.open(filename, password, host, port, ssl)

Opens a wallet from file.

#### Method Parameters

|Argument|Mandatory|Description|Format|
|---|---|---|---|
|filename|yes|Filename of the existing wallet.|string|
|password|yes|The password for the wallet.|string|
|host|no|IP address or hostname of wallet-api host|string|
|port|no|The port wallet-api is running on|string|
|ssl|no|Whether or not to connect using SSL|boolean|

#### Example Code

```js
wallet.open('yourwallet', 'yourpassword')
```

### wallet.importKey(filename, password, viewKey, spendKey, scanHeight, host, port, ssl)

Imports a wallet from private viewKey and a secret spendKey and saves it to disk.

#### Method Parameters

|Argument|Mandatory|Description|Format|
|---|---|---|---|
|filename|yes|Filename of the created wallet.|string|
|password|yes|Password for the created wallet file.|string|
|viewKey|yes|The private viewKey to import.|string|
|spendKey|yes|The secret spendKey to import.|string|
|scanHeight|no|The height from which to begin scanning for transactions. (Defaults to 0)|integer|
|host|no|IP address or hostname of wallet-api host (Defaults to 127.0.0.1)|string|
|port|no|The port wallet-api is running on (Defaults to 8070)|integer|
|ssl|no|Whether or not to connect using SSL (Defaults to false)|boolean|

#### Example Code

```js
wallet.importKey(
  'mywallet',
  'mypassword',
  '2c9547c89be67d83af0689d8f7b5e6448536964cf2f066c67a6ff463b3d7e200',
  'f94442b1496d61f00d604fe2603614b0f5fa60d19ffef0ce976a32e6080be706',
  500000
)
```

### wallet.importSeed(filename, password, mnemonicSeed, scanHeight, host, port, ssl)

Imports a wallet from a mnemonic seed and saves it to disk.

#### Method Parameters

|Argument|Mandatory|Description|Format|
|---|---|---|---|
|filename|yes|Filename of the created wallet.|string|
|password|yes|Password for the created wallet file.|string|
|mnenomicSeed|yes|The mnenomic seed to import.|string|
|scanHeight|no|The height from which to begin scanning for transactions. (Defaults to 0)|integer|
|host|no|IP address or hostname of wallet-api host (Defaults to 127.0.0.1)|string|
|port|no|The port wallet-api is running on (Defaults to 8070)|integer|
|ssl|no|Whether or not to connect using SSL (Defaults to false)|boolean|

#### Example Code

```js
wallet.importSeed(
  'mywallet',
  'mypassword',
  'object argue opacity ongoing spud puppy smash javelin begun click jargon solved buffet warped stockpile going rhino input bailed tufts laboratory amended nurse object begun',
  500000
)
```

### wallet.importViewOnly(filename, password, viewKey, address, scanHeight, host, port, ssl)

Imports a view key for a view-only wallet and saves it to disk.

#### Method Parameters

|Argument|Mandatory|Description|Format|
|---|---|---|---|
|filename|yes|Filename of the created wallet.|string|
|password|yes|Password for the created wallet file.|string|
|viewKey|yes|The private viewKey to import.|string|
|address|yes|The public address of the wallet.|string|
|scanHeight|no|The height from which to begin scanning for transactions. (Defaults to 0)|integer|
|host|no|IP address or hostname of wallet-api host (Defaults to 127.0.0.1)|string|
|port|no|The port wallet-api is running on (Defaults to 8070)|integer|
|ssl|no|Whether or not to connect using SSL (Defaults to false)|boolean|

#### Example Code

```js
wallet.importViewOnly(
  'mywallet',
  'mypassword',
  'af12383104e1e6a52bc775b9b6cc1e2a00aa2081b2accfb3743b3b81293c0f04',
  'TRTLuzXbDdWRsWuL7APprYZEeHW3G4XXuTbzWYtqPoWaSwNkMoYqYRCdtozikcQe3xGGM2PVJg169bE7jzF9dkPGhf9BbMfBZyH',
  500000
)
```

### wallet.create(filename, password, host, port, ssl)

Creates a new wallet and saves it to disk.

#### Method Parameters

|Argument|Mandatory|Description|Format|
|---|---|---|---|
|filename|yes|Filename of the created wallet.|string|
|password|yes|Password for the created wallet file.|string|
|host|no|IP address or hostname of wallet-api host (Defaults to 127.0.0.1)|string|
|port|no|The port wallet-api is running on (Defaults to 8070)|integer|
|ssl|no|Whether or not to connect using SSL (Defaults to false)|boolean|

#### Example Code

```js
wallet.create('mywallet', 'mypassword')
```

### wallet.close()

Closes and saves the wallet that is currently open.

#### Example Code

```js
wallet.close()
```

### wallet.addresses()

Gets a list of all addresses in the wallet container

#### Example Code

```js
wallet.addresses()
```

### wallet.deleteAddress(address)

Deletes the given subwallet from the container

#### Method Parameters

|Argument|Mandatory|Description|Format|
|---|---|---|---|
|address|yes|The public address of the subwallet to be deleted.|string|

#### Example Code

```js
wallet.deleteAddress(
  'TRTLuzXbDdWRsWuL7APprYZEeHW3G4XXuTbzWYtqPoWaSwNkMoYqYRCdtozikcQe3xGGM2PVJg169bE7jzF9dkPGhf9BbMfBZyH'
)
```

### wallet.primaryAddress()

Gets the 'primary' address.

#### Example Code

```js
wallet.primaryAddress()
```

### wallet.createAddress()

Creates a new, random address in the wallet container.

#### Example Code

```js
wallet.createAddress()
```

### wallet.importAddress()

Imports a subwallet with the given private spend key.

#### Method Parameters

|Argument|Mandatory|Description|Format|
|---|---|---|---|
|spendKey|yes|The secret spendKey to import.|string|
|scanHeight|no|The height from which to begin scanning for transactions. (Defaults to 0)|integer|

#### Example Code

```js
wallet.importAddress(
  '6bc61e441b9c0e04779a1f6dbb3599cd17ba42973ebc2137e12ac5857c47a30f',
  50000
)
```

### wallet.importViewAddress(spendKey, scanHeight)

Imports a view only subwallet with the given publicSpendKey.

#### Method Parameters

|Argument|Mandatory|Description|Format|
|---|---|---|---|
|spendKey|yes|The public spendKey to import.|string|
|scanHeight|no|The height from which to begin scanning for transactions. (Defaults to 0)|integer|

#### Example Code

```js
wallet.importViewAddress(
  '05c6b94bbf8982ce6ffe0e52f606e439c0a04c62dbd6fdac819d1fb68a786003',
  50000
)
```

### wallet.createIntegratedAddress(address, paymentID)

Creates an integrated address from an address and payment ID.

#### Method Parameters

|Argument|Mandatory|Description|Format|
|---|---|---|---|
|address|yes|The public address to make an integrated address out of.|string|
|paymentID|yes|The payment ID to make an integrated address out of.|string|

#### Example Code

```js
wallet.createIntegratedAddress(
  'TRTLv1EGFinJDHKbxFT8zDT59fVF8duLqFrGfQMbyPqgEh9fLfXZcEsLosHQ38gaJfA2een645nbJKUgoFpbouKsXu7NDhxxrH1',
  '86C3924C5B3DF2BD8D1E3F5D3A3229ABA47472BCF0A332C00F05A33D63D9C60E'
)
```

### wallet.getNode()

Gets the node address, port, fee, and fee address.

#### Example Code

```js
wallet.getNode()
```

### wallet.setNode(host, port, ssl)

Sets the node address and port.

#### Method Parameters

|Argument|Mandatory|Description|Format|
|---|---|---|---|
|host|yes|IP address or hostname of the TurtleCoind host.|string|
|port|yes|Port to use when connecting to the TurtleCoind host.|string|
|ssl|no|Whether or not to connect using SSL (Defaults to false)|boolean|

#### Example Code

```js
wallet.setNode('127.0.0.1', 11898, true)
```

### wallet.keys(address)

Gets the public and private spend key for the given address.

#### Method Parameters

|Argument|Mandatory|Description|Format|
|---|---|---|---|
|address|Yes|Public wallet address.|string|

#### Example Code

```js
wallet.keys(
  'TRTLv1CK8YmPZqRZzhLD9fHJszHKrPpbyaRQSYwH4FscapFN9rd27XZBew5becCWMEQVUwoRAQvi9E6wKPwAM7AufPtRts91Ljh'
)
```

### wallet.keysMnemonic(address)

Gets the mnemonic seed for the given address.

#### Method Parameters

|Argument|Mandatory|Description|Format|
|---|---|---|---|
|address|Yes|Public wallet address.|string|

#### Example Code

```js
wallet.keys(
  'TRTLv38Bs9PVUxpDUagenf7RK8YZnJfoS41sNsttLXNj2PQU4Yeoju6Wj3RFwxy2gG81K5ANWtnj6HJSxU8Sba2c2J6V5ugGbah'
)
```

### wallet.transactions(startHeight, endHeight)

Gets a list of all transactions in the wallet container.

#### Method Parameters

|Argument|Mandatory|Description|Format|
|---|---|---|---|
|startHeight|no|Height to start scanning for transactions.|integer|
|endHeight|no|Height to stop scanning for transactions.|integer|

#### Example Code

```js
wallet.transactions(100000, 250000)
```

### wallet.transactionByHash(hash)

Gets details on the given transaction, if found.

#### Method Parameters

|Argument|Mandatory|Description|Format|
|---|---|---|---|
|hash|yes|The hash of the transaction to look up.|string|

#### Example Code

```js
wallet.transactionByHash('e6860c84aad2ef874beb4b584f4d97b805dc06b6f8e743175f43e882c6373afa')
```

### wallet.unconfirmedTransactions(address)

Gets a list of all unconfirmed, outgoing transactions in the wallet container.

#### Method Parameters

|Argument|Mandatory|Description|Format|
|---|---|---|---|
|address|Yes|Public wallet address.|string|

#### Example Code

```js
wallet.unconfirmedTransactions(
  'TRTLuyMZMD3HMBk6SeniD7V5xhYtt581KQDQmyQXtD44jaSQcCR3DonjTtQy4iJbysRgVWLuSvCTYhVCxo8xt21kZCSLxFTMyEm'
)
```

### wallet.transactionsByAddress(address, startHeight, endHeight)

Returns transactions for the wallet starting at start height for 1,000 blocks, that belong to the given address.

#### Method Parameters

|Argument|Mandatory|Description|Format|
|---|---|---|---|
|address|Yes|Public wallet address.|string|
|startHeight|no|Height to start scanning for transactions.|integer|
|endHeight|no|Height to stop scanning for transactions.|integer|

#### Example Code

```js
wallet.transactionsByAddress(
  'TRTLv3zoRX86zxYhwvNkx3bdLPFGAPtDgDTe5GGx3Hz6Uv9tRgc8rkpgFAHV2z1Ys9KvXYYvACTm8AGRcSyZ9gc6e7tC4NRTciP',
  100000,
  250000
)
```

### wallet.sendBasic(address, amount, paymentId)

This method will take funds from all subwallets as needed, and will use the primary address as the change address. It also uses a default fee, and default mixin. If this is not acceptable, please use the .sendAdvanced() function instead.

#### Method Parameters

|Argument|Mandatory|Description|Format|
|---|---|---|---|
|address|Yes|Public wallet address to send transaction to.|string|
|amount|Yes|Amount of TRTL to send.|number|
|paymentId|No|Payment ID to use for the transaction.|string|

#### Example Code

```js
wallet.sendBasic(
  'TRTLuycsDuMXGMSKoeFkKwNBmExD81xbmbHpn8qkbha55r7K6NRFVTX47u1qHWNG9XM1iECTgH8oB6Tz2Ayi2iCmDAs7P9Spaf4',
  10000.00,
  'CFFC32C630075C26B92F641C4332FC20A4723690097D3C491F6E0279ED4B430D'
)
```

### wallet.sendAdvanced(destinations, mixin, fee, sourceAddresses, paymentId, changeAddress, unlockTime)

Note that every parameters sans destinations is optional.

#### Method Parameters

|Argument|Mandatory|Description|Format|
|---|---|---|---|
|destinations|Yes|Array of public addresses to send transaction to.|array|
|mixin|No|What mixin to use in the transaction.|array|
|fee|No|Fee to use for the transaction.|array|
|sourceAddresses|No|Subwallet addresses to use to fund the payment.|array|
|paymentId|No|Payment ID to use in the transaction.|array|
|changeAddress|No|Public address to send the change to.|string|
|unlockTime|No|Amount of time before unlocking the transaction.|uint64_t|

#### Example Code

```js
wallet.sendAdvanced(
  [
    {
      address: 'TRTLv2Fyavy8CXG8BPEbNeCHFZ1fuDCYCZ3vW5H5LXN4K2M2MHUpTENip9bbavpHvvPwb4NDkBWrNgURAd5DB38FHXWZyoBh4wW',
      amount: 12.34
    }
  ],
  3,
  0.10,
  [
    'TRTLv2Fyavy8CXG8BPEbNeCHFZ1fuDCYCZ3vW5H5LXN4K2M2MHUpTENip9bbavpHvvPwb4NDkBWrNgURAd5DB38FHXWZyoBh4wW'
  ],
  '38a8224a4c8bc5f060555cf9e89551dcd0cbb1c587a52b63e98f71280c362ee4',
  'TRTLv2Fyavy8CXG8BPEbNeCHFZ1fuDCYCZ3vW5H5LXN4K2M2MHUpTENip9bbavpHvvPwb4NDkBWrNgURAd5DB38FHXWZyoBh4wW',
  1200000
)
```

### wallet.sendFusionBasic()

Sends a fusion transaction.

#### Example Code

```js
wallet.sendFusionBasic()
```

### wallet.sendFusionAdvanced(address, mixin, sourceAddresses)

Sends a fusion transaction.

#### Method Parameters

|Argument|Mandatory|Description|Format|
|---|---|---|---|
|address|No|Public wallet address to send to.|string|
|mixin|No|Mixin to use for the fusion transaction.|integer|
|sourceAddresses|Subwallets to select inputs from.|array|

#### Example Code

```js
wallet.sendFusionAdvanced(
  'TRTLv1dBzjcU5YAfo8vJoHYRaEyWerzWXCPFbHvpSnCCfQpnQcrLePjad6VVyPw5UU7m6xf7y8EX2LFosWKet6gdCZeFSFZjmRB',
  3,
  [
    'TRTLuxpsYa3ai2P8hVgLQDa4ZA5UQgvjyDfADEmjF5Z2RMqE7CpW1YQbwVo1HTCEpDdfzQR7xKWduSQhC3sYd9ePNYV5h3GsGtm',
    'TRTLuyHC3shdymv8Hb1Nqb3NFREJJXCyyfLQruztwnWLayB3dTfqekZUDmwF4QvSiBRA4XQrd3LEgLNWuTaJtEa8XsgBCbSEWWw'
  ]
)
```

### wallet.transactionPrivateKey(hash)

Gets the transaction private key of the given transaction. This can be used to audit a transaction.

#### Method Parameters

|Argument|Mandatory|Description|Format|
|---|---|---|---|
|hash|Yes|Hash of the transaction you wish to audit.|string|

#### Example Code

```js
wallet.transactionPrivateKey('05372052d1b1ef11b0ea889d4c9389995566f4ba63296d3e1197d277587e5467')
```

### wallet.balance(address)

#### Method Parameters

|Argument|Mandatory|Description|Format|
|---|---|---|---|
|address|no|Subwallet to retrieve balance from.|string|

#### Example Code

```js
wallet.balance(
  'TRTLv1ievFjVyKoTh2VPo12sj5WEiKJmHCDdqpcvU42zMkUvHd6diyW4britmMBXvE5nyHVLdDSiugkbfNnSbo82WrRuiZrdF6k'
)
```

### wallet.balances()

Get the balance for the entire wallet container

#### Example Code

```js
wallet.balances()
```

### wallet.save()

Saves the wallet state.

#### Example Code

```js
wallet.save()
```

### wallet.reset(scanHeight)

Resets and saves the wallet, beginning scanning from height given, if any.

#### Method Parameters

|Argument|Mandatory|Description|Format|
|---|---|---|---|
|scanHeight|No|Height to begin scanning wallet for transactions.|integer|

#### Example Code

```js
wallet.reset(187000)
```

### wallet.validateAddress(address)

Validate an address. If the address is valid the promise will resolve else it will be rejected.

#### Method Parameters

|Argument|Mandatory|Description|Format|
|---|---|---|---|
|address|Yes|Address to validate.|string|

#### Example Code

```js
wallet.validateAddress(
  'TRTLuzqYTZM2D8wL1MNbETjPNwQKGz5vFgxnjwc3g8vB1L9bik9Qp6UGLkuEGEv9prS1NAMN9PSepMzrfbVUy6f9QnXM3B44Rxw'
)
```

### wallet.status()

Get the wallet sync status, peer count, and hashrate.

#### Example Code

```js
wallet.status()
```

## TurtleService RPC API Interface

We expose all of the `turtle-service` RPC API commands via the ```TurtleService``` interface. Each of the below methods are [Javascript Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises). For safety sake, **always** handle your promise catches as we do use them properly.

***Special Note:*** Any and all amounts/fees will already be in HUMAN readable units. DO NOT DIVIDE THEM AGAIN unless you've specified ```decimalDivisor``` as ```1``` in the options. You have been warned.

Unless otherwise noted, all methods will resolve the promise upon success and sample return data is supplied below. Any errors will reject the promise with an error condition.

Methods noted having options have parameters that may be *optional* or *required* as documented.

### service.reset(options)

#### Method Parameters

|Argument|Mandatory|Description|Format|
|---|---|---|---|
|scanHeight|No|The scanHeight to start scanning for transactions|integer|

#### Example Code

```javascript
service.reset({
  scanHeight: 100000
}).then(() => {
  // do something
})
```

### service.save()

#### Example Code

```javascript
service.save().then(() => {
  // do something
})
```

### service.getNodeFeeInfo()

This method returns the Node fee information that the service picks up via the connected daemon.

#### Example Code

```javascript
service.getNodeFeeInfo().then((result) => {
  // do something
})
```

#### Example Data

```javascript
{
  "address": "TRTLuxN6FVALYxeAEKhtWDYNS9Vd9dHVp3QHwjKbo76ggQKgUfVjQp8iPypECCy3MwZVyu89k1fWE2Ji6EKedbrqECHHWouZN6g",
  "amount": 5000
}
```

### service.getViewKey()

#### Example Code

```javascript
service.getViewKey().then((result) => {
  // do something
})
```

#### Example Data

```javascript
{
  "viewSecretKey": "12345678901234567890"
}
```

### service.getSpendKeys(options)

#### Method Parameters

|Argument|Mandatory|Description|Format|
|---|---|---|---|
|address|Yes|Public wallet address|string|

#### Example Code

```javascript
service.getSpendKeys({
  address: 'TRTLv1pacKFJk9QgSmzk2LJWn14JGmTKzReFLz1RgY3K9Ryn7783RDT2TretzfYdck5GMCGzXTuwKfePWQYViNs4avKpnUbrwfQ'
}).then((result) => {
  // do something
})
```

#### Example Data

```javascript
{
  "spendPublicKey": "9e50b808f1e2522b7c6feddd8e2f6cdcd89ff33b623412de2061d78c84588eff33b6d9",
  "spendSecretKey": "c6639a75a37f63f92e2f096fa262155c943b4fdc243ffb02b8178ab960bb5d0f"
}
```

### service.getMnemonicSeed(options)

#### Method Parameters

|Argument|Mandatory|Description|Format|
|---|---|---|---|
|address|Yes|Public wallet address|string|

#### Example Code

```javascript
service.getMnemonicSeed({
  address: 'TRTLv1pacKFJk9QgSmzk2LJWn14JGmTKzReFLz1RgY3K9Ryn7783RDT2TretzfYdck5GMCGzXTuwKfePWQYViNs4avKpnUbrwfQ'
}).then((result) => {
  // do something
})
```

#### Example Data

```text
river nudged peculiar ailments waking null tossed anchor erase jive eavesdrop veered truth wield stacking tattoo unplugs oven wipeout aptitude estate dazed observant oxygen oxygen
```

### service.getStatus()

#### Example Code

```javascript
service.getStatus().then((result) => {
  // do something
})
```

#### Example Data

```javascript
{
  "blockCount": 491214,
  "knownBlockCount": 491215,
  "lastBlockHash": "fc33b0fcdb8a3ed8e2de3cb36df325d67e9926d59f02d164baacf3ddefe8df12",
  "peerCount": 8
}
```

### service.getAddresses()

#### Example Code

```javascript
service.getAddresses().then((result) => {
  // do something
})
```

#### Example Data

```javascript
[
  "TRTLux9QBmzCYEGgdWXHEQCAm6vY9vZHkbGmx8ev5LxhYk8N71Pp7PWFYL9CHxpWph2wCPZcJ6tkPfUxVZcUN8xmYsSDJZ25i9n",
  "TRTLv1mPerM2ckUuNvxrkzDE7QKd9PFVUXYbVfbvx8YxB5BYEdSqQvUFYL9CHxpWph2wCPZcJ6tkPfUxVZcUN8xmYsSDJbQMVgF"
]
```

### service.createAddress(options)

#### Method Parameters

|Argument|Mandatory|Description|Format|
|---|---|---|---|
|secretSpendKey|No|Address secret spend key|string|
|publicSpendKey|No|Address public spend key|string|

**Note:** Both ```secretSpendKey``` and ```publicSpendKey``` are optional; however, you can only supply one or the other. Both are given below as **examples**.

#### Example Code

```javascript
service.createAddress({
  secretSpendKey: 'c6639a75a37f63f92e2f096fa262155c943b4fdc243ffb02b8178ab960bb5d0f',
  publicSpendKey: '9e50b808f1e2522b7c6feddd8e2f6cdcd89ff33b623412de2061d78c84588eff33b6d9'
}).then((result) => {
  // do something
})
```

#### Example Data

```javascript
{
  "address": "TRTLv3rnGMvAdUUPZZxUmm2jSe8j9U4EfXoAzT3NByLTKD4foK6JuH2FYL9CHxpWph2wCPZcJ6tkPfUxVZcUN8xmYsSDJYidUqc"
}
```

### service.deleteAddress(options)

#### Method Parameters

|Argument|Mandatory|Description|Format|
|---|---|---|---|
|address|No|Public wallet address|string|

#### Example Code

```javascript
service.deleteAddress({
  address: 'TRTLv1pacKFJk9QgSmzk2LJWn14JGmTKzReFLz1RgY3K9Ryn7783RDT2TretzfYdck5GMCGzXTuwKfePWQYViNs4avKpnUbrwfQ'
}).then((result) => {
  // do something
})
```

### service.getBalance(options)

#### Method Parameters

|Argument|Mandatory|Description|Format|
|---|---|---|---|
|address|No|Public wallet address|string|

#### Example Code

```javascript
service.getBalance({
  address: 'TRTLv1pacKFJk9QgSmzk2LJWn14JGmTKzReFLz1RgY3K9Ryn7783RDT2TretzfYdck5GMCGzXTuwKfePWQYViNs4avKpnUbrwfQ'
}).then((result) => {
  // do something
})
```

#### Example Data

```javascript
{
  "availableBalance": 60021.54,
  "lockedAmount": 0
}
```

### service.getBlockHashes(options)

#### Method Parameters

|Argument|Mandatory|Description|Format|
|---|---|---|---|
|firstBlockIndex|Yes|The height of the blockchain to start at|integer|
|blockCount|Yes|How many blocks to return at maximum|integer|

#### Example Code

```javascript
service.getBlockHashes({
  firstBlockIndex: 500000,
  blockCount: 10
}).then((result) => {
  // do something
})
```

#### Example Data

```javascript
{
  "blockHashes": [
    "8c9738f961a278486f27ce214d1e4d67e08f7400c8b38fe00cdd571a8d302c7d",
    "2ef060801dd27327533580cfa538849f9e1968d13418f2dd2535774a8c494bf4",
    "3ac40c464986437dafe9057f73780e1a3a6cd2f90e0c5fa69c5caab80556a68a",
    "ac821fcb9e9c903abe494bbd2c8f3333602ebdb2f0a98519fc84899906a7f52b",
    "4dcffeea7aec064ec5c03e1cb6cf58265a2b76c4f2db9e5fc4afbaf967b77bba",
    "1b82b0df589cb11aa5a96ea97d79699af7bc54b5d2b8333847d38da660aaf9e0",
    "007de12510667a1d56b61720257f07a3905abb3a8b479bdff926bb17d1a9e766",
    "8f0d10ddf23aafb755e682291d56d38a20bbc17ce1d5081c15067865b6867260",
    "5585c6bac11925fc762d0a8e6b95b3a3bd66379e74e8711e432fda3f6966bf08",
    "ea531b1af3da7dc71a7f7a304076e74b526655bc2daf83d9b5d69f1bc4555af0"
  ]
}
```

### service.getTransactionHashes(options)

#### Method Parameters

|Argument|Mandatory|Description|Format|
|---|---|---|---|
|addresses|No|Array of public wallet addresses|strings|
|blockHash|No|Block hash to scan|string|
|firstBlockIndex|No|The height of the blockchain to start at|integer|
|blockCount|Yes|How many blocks to return at maximum|integer|
|paymentId|No|Payment ID to scan for|string|

***Note:*** Only **one** of either ```blockHash``` or ```firstBlockIndex``` may be supplied, but not both.

#### Example Code

```javascript
service.getTransactionHashes({
  addresses: [
    "TRTLux9QBmzCYEGgdWXHEQCAm6vY9vZHkbGmx8ev5LxhYk8N71Pp7PWFYL9CHxpWph2wCPZcJ6tkPfUxVZcUN8xmYsSDJZ25i9n",
    "TRTLv1mPerM2ckUuNvxrkzDE7QKd9PFVUXYbVfbvx8YxB5BYEdSqQvUFYL9CHxpWph2wCPZcJ6tkPfUxVZcUN8xmYsSDJbQMVgF"
  ],
  blockHash: 'f98d6bbe80a81b3aa0aebd004096e2223524f58f347a1f21be122450f244b948',
  blockCount: 1
}).then((result) => {
  // do something
})
```

#### Example Data

```javascript
{
  "items": [
    {
      "blockHash": "f98d6bbe80a81b3aa0aebd004096e2223524f58f347a1f21be122450f244b948",
      "transactionHashes": [
        "d01e448f7b631cebd989e3a150258b0da59c66f96adecec392bbf61814310751"
      ]
    }
  ]
}
```

### service.getTransactions(options)

#### Method Parameters

|Argument|Mandatory|Description|Format|
|---|---|---|---|
|addresses|No|Array of public wallet addresses|strings|
|blockHash|No|Block hash to scan|string|
|firstBlockIndex|No|The height of the blockchain to start at|integer|
|blockCount|Yes|How many blocks to return at maximum|integer|
|paymentId|No|Payment ID to scan for|string|

***Note:*** Only **one** of either ```blockHash``` or ```firstBlockIndex``` may be supplied, but not both.

#### Example Code

```javascript
service.getTransactions({
  addresses: [
    "TRTLux9QBmzCYEGgdWXHEQCAm6vY9vZHkbGmx8ev5LxhYk8N71Pp7PWFYL9CHxpWph2wCPZcJ6tkPfUxVZcUN8xmYsSDJZ25i9n",
    "TRTLv1mPerM2ckUuNvxrkzDE7QKd9PFVUXYbVfbvx8YxB5BYEdSqQvUFYL9CHxpWph2wCPZcJ6tkPfUxVZcUN8xmYsSDJbQMVgF"
  ],
  firstBlockIndex: 469419,
  blockCount: 1
}).then((result) => {
  // do something
})
```

#### Example Data

```javascript
[
  {
    "blockHash": "f98d6bbe80a81b3aa0aebd004096e2223524f58f347a1f21be122450f244b948",
    "transactionAmount": 10.5,
    "blockIndex": 469419,
    "extra": "014fa15a893c92e040fc97c8bda6d811685a269309b37ad444755099cbed6d8438",
    "fee": 0.1,
    "isBase": false,
    "paymentId": "",
    "state": 0,
    "timestamp": 1526876765,
    "transactionHash": "d01e448f7b631cebd989e3a150258b0da59c66f96adecec392bbf61814310751",
    "address": "TRTLv2MXbzaPYVYqtdNwYpKY7azcVjBjsETN188BpKwi2q83NibqJWtFYL9CHxpWph2wCPZcJ6tkPfUxVZcUN8xmYsSDJYpcE3D",
    "amount": 10.5,
    "type": 0,
    "unlockTime": 0,
    "inbound": true
  }
]
```

### service.getUnconfirmedTransactionHashes(options)

#### Method Parameters

|Argument|Mandatory|Description|Format|
|---|---|---|---|
|addresses|No|Array of public wallet addresses|strings|

#### Example Code

```javascript
service.getUnconfirmedTransactionHashes({
  address: 'TRTLv1pacKFJk9QgSmzk2LJWn14JGmTKzReFLz1RgY3K9Ryn7783RDT2TretzfYdck5GMCGzXTuwKfePWQYViNs4avKpnUbrwfQ'
}).then((result) => {
  // do something
})
```

#### Example Data

```javascript
{
  "transactionHashes": [
    "80185093fj029jv029j3g092jb32904j0b34jb34gb",
    "j09213fj20vjh02vb2094jb0394jgb039bj03jb34b"
  ]
}
```

### service.getTransaction(options)

***Special Note:*** Any and all amounts/fees will already be in HUMAN readable units. DO NOT DIVIDE AMOUNTS AGAIN unless you've specified ```decimalDivisor``` as ```1``` in the options. You have been warned.

#### Method Parameters

|Argument|Mandatory|Description|Format|
|---|---|---|---|
|transactionHash|Yes|The hash of the transaction|string|

#### Example Code

```javascript
service.getTransaction({
  transactionHash: 'd01e448f7b631cebd989e3a150258b0da59c66f96adecec392bbf61814310751'
}).then((result) => {
  // do something
})
```

#### Example Data

```javascript
{
  "transaction": {
    "amount": 10,
    "blockIndex": 469419,
    "extra": "014fa15a893c92e040fc97c8bda6d811685a269309b37ad444755099cbed6d8438",
    "fee": 0.1,
    "isBase": false,
    "paymentId": "",
    "state": 0,
    "timestamp": 1526876765,
    "transactionHash": "d01e448f7b631cebd989e3a150258b0da59c66f96adecec392bbf61814310751",
    "transfers": [
      {
        "address": "TRTLv2MXbzaPYVYqtdNwYpKY7azcVjBjsETN188BpKwi2q83NibqJWtFYL9CHxpWph2wCPZcJ6tkPfUxVZcUN8xmYsSDJYpcE3D",
        "amount": 10,
        "type": 0
      },
      {
        "address": "",
        "amount": -20,
        "type": 0
      },
      {
        "address": "",
        "amount": 9.9,
        "type": 0
      }
    ],
    "unlockTime": 0
  }
}
```

### service.newTransfer(address, amount)

This method creates a transfer object designed to be used with *service.sendTransaction*

***Note: This method does NOT return a promise.***

***Special Note:*** Any and all amounts/fees will already be in HUMAN readable units. DO NOT SUPPLY NATIVE CURRENCY AMOUNTS unless you've specified ```decimalDivisor``` as ```1``` in the options. You have been warned.

#### Example Code

```javascript
var transfer = service.newTransfer('TRTLv1pacKFJk9QgSmzk2LJWn14JGmTKzReFLz1RgY3K9Ryn7783RDT2TretzfYdck5GMCGzXTuwKfePWQYViNs4avKpnUbrwfQ', 1000000)
```

### service.sendTransaction(options)

***Special Note:*** Any and all amounts/fees will already be in HUMAN readable units. DO NOT SUPPLY NATIVE CURRENCY AMOUNTS unless you've specified ```decimalDivisor``` as ```1``` in the options. You have been warned.

#### Method Parameters

|Argument|Mandatory|Description|Format|
|---|---|---|---|
|addresses|No|Array of public wallet addresses|strings|
|transfers|Yes|Array of transfer objects (see *service.newTransfer*) to send funds to|newTransfer|
|fee|No|Transaction fee for the transaction|float|
|unlockTime|No|Blockheight ot unlock the transaction at, the UTC timestamp, or ```0``` for now.|integer|
|mixin|No|The number of mixins to use|integer|
|extra|No|Extra data to put in the transaction|string|
|paymentId|No|The payment ID for the transaction|string|
|changeAddress|No|Where to send any change from the transaction. If not specified, the first address in the wallet container is used.|string|

#### Example Code

```javascript
service.sendTransaction({
  transfers: [
    service.newTransfer('TRTLv1pacKFJk9QgSmzk2LJWn14JGmTKzReFLz1RgY3K9Ryn7783RDT2TretzfYdck5GMCGzXTuwKfePWQYViNs4avKpnUbrwfQ', 1000000)
  ],
  fee: 0.1,
  mixin: 7,
}).then((result) => {
  // do something
})
```

#### Example Data

```javascript
{
  "transactionHash": "93faedc8b8a80a084a02dfeffd163934746c2163f23a1b6022b32423ec9ae08f"
}
```

### service.createDelayedTransaction(options)

***Special Note:*** Any and all amounts/fees will already be in HUMAN readable units. DO NOT SUPPLY NATIVE CURRENCY AMOUNTS unless you've specified ```decimalDivisor``` as ```1``` in the options. You have been warned.

#### Method Parameters

|Argument|Mandatory|Description|Format|
|---|---|---|---|
|addresses|No|Array of public wallet addresses|strings|
|transfers|Yes|Array of transfer objects (see *service.newTransfer*) to send funds to|newTransfer|
|fee|No|Transaction fee for the transaction|float|
|unlockTime|No|Blockheight ot unlock the transaction at, the UTC timestamp, or ```0``` for now.|integer|
|mixin|No|The number of mixins to use|integer|
|extra|No|Extra data to put in the transaction|string|
|paymentId|No|The payment ID for the transaction|string|
|changeAddress|No|Where to send any change from the transaction. If not specified, the first address in the wallet container is used.|string|

#### Example Code

```javascript
service.createDelayedTransaction({
  transfers: [
    service.newTransfer('TRTLv1pacKFJk9QgSmzk2LJWn14JGmTKzReFLz1RgY3K9Ryn7783RDT2TretzfYdck5GMCGzXTuwKfePWQYViNs4avKpnUbrwfQ', 1000000)
  ],
  fee: 0.1,
  mixin: 7,
}).then((result) => {
  // do something
})
```

#### Example Data

```javascript
{
  "transactionHash": "93faedc8b8a80a084a02dfeffd163934746c2163f23a1b6022b32423ec9ae08f"
}
```

### service.getDelayedTransactionHashes()

#### Example Code

```javascript
service.getDelayedTransactionHashes().then((result) => {
  // do something
})
```

#### Example Data

```javascript
{
  "transactionHashes": [
    "957dcbf54f327846ea0c7a16b2ae8c24ba3fa8305cc3bbc6424e85e7d358b44b",
    "25bb751814dd39bf46c972bd760e7516e34200f5e5dd02fda696671e11201f78"
  ]
}
```

### service.deleteDelayedTransaction(options)

#### Method Parameters

|Argument|Mandatory|Description|Format|
|---|---|---|---|
|transactionHash|Yes|The hash of the transaction|string|

#### Example Code

```javascript
service.deleteDelayedTransaction({
  transactionHash: 'd01e448f7b631cebd989e3a150258b0da59c66f96adecec392bbf61814310751'
}).then((result) => {
  // do something
})
```

### service.sendDelayedTransaction()

#### Method Parameters

|Argument|Mandatory|Description|Format|
|---|---|---|---|
|transactionHash|Yes|The hash of the transaction|string|

#### Example Code

```javascript
service.sendDelayedTransaction({
  transactionHash: 'd01e448f7b631cebd989e3a150258b0da59c66f96adecec392bbf61814310751'
}).then((result) => {
  // do something
})
```

### service.sendFusionTransaction(options)

#### Method Parameters

|Argument|Mandatory|Description|Format|
|---|---|---|---|
|threshold|No|The minimum fusion threshold amount|integer|
|mixin|No|The number of mixins to use|integer|
|addresses|No|Array of public wallet addresses|strings|
|destinationAddress|No|The address to send the fusion transaction to|string|

***Note:*** If the container has only one address or ```addressess``` consists of one address, then ```destinationAddress``` need not be supplied. Otherwise, ```destinationAddress``` is required.

#### Example Code

```javascript
service.sendFusionTransaction({
  mixin: 7,
  destinationAddress: 'TRTLv1pacKFJk9QgSmzk2LJWn14JGmTKzReFLz1RgY3K9Ryn7783RDT2TretzfYdck5GMCGzXTuwKfePWQYViNs4avKpnUbrwfQ'
}).then((result) => {
  // do something
})
```

#### Example Data

```javascript
{
  "transactionHash": "93faedc8b8a80a084a02dfeffd163934746c2163f23a1b6022b32423ec9ae08f"
}
```

### service.estimateFusion(options)

#### Method Parameters

|Argument|Mandatory|Description|Format|
|---|---|---|---|
|threshold|No|The minimum fusion threshold amount|integer|
|addresses|No|Array of public wallet addresses|strings|

#### Example Code

```javascript
service.estimateFusion({
  threshold: 100000000,
  addresses:[
    'TRTLv1pacKFJk9QgSmzk2LJWn14JGmTKzReFLz1RgY3K9Ryn7783RDT2TretzfYdck5GMCGzXTuwKfePWQYViNs4avKpnUbrwfQ'
  ]
}).then((result) => {
  // do something
})
```

#### Example Data

```javascript
{
  "fusionReadyCount": 0,
  "totalOutputCount": 19
}
```

### service.createIntegratedAddress(options)

#### Method Parameters

|Argument|Mandatory|Description|Format|
|---|---|---|---|
|address|Yes|The public wallet address|string|
|paymentId|Yes|The paymentId to incorporate|string|

#### Example Code

```javascript
service.createIntegratedAddress({
  address: 'TRTLv1pacKFJk9QgSmzk2LJWn14JGmTKzReFLz1RgY3K9Ryn7783RDT2TretzfYdck5GMCGzXTuwKfePWQYViNs4avKpnUbrwfQ',
  paymentId: '80ec855eef7df4bce718442cabe086f19dfdd0d03907c7768eddb8eca8c5a667'
}).then((result) => {
  // do something
})
```

#### Example Data

```javascript
TRTLTyPSXMZB5j2wbztMzRXu2rVCuNVLUb4WKARRZY9ficYWshMDy7p4MXEz24mkyb4KFDVksDj41XTJ4DC3c7P2SfRg3r5q1ve9x7x5tK

```

## License

```
Copyright (C) 2018 Brandon Lehmann, The TurtleCoin Developers

Please see the included LICENSE file for more information.
```
