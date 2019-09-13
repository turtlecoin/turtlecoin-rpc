// Copyright (c) 2018-2019, Brandon Lehmann, The TurtleCoin Developers
//
// Please see the included LICENSE file for more information.

'use strict'

const request = require('request-promise-native')
const util = require('util')

var TurtleCoindRPC = function (opts) {
  opts = opts || {}
  if (!(this instanceof TurtleCoindRPC)) return new TurtleCoindRPC(opts)
  this.host = opts.host || '127.0.0.1'
  this.port = opts.port || 11898
  this.timeout = opts.timeout || 2000
  this.ssl = opts.ssl || false
}

TurtleCoindRPC.prototype._get = function (method) {
  return new Promise((resolve, reject) => {
    if (method.length === 0) return reject(new Error('no method supplied'))
    var protocol = (this.ssl) ? 'https' : 'http'

    request({
      uri: util.format('%s://%s:%s/%s', protocol, this.host, this.port, method),
      method: 'GET',
      json: true,
      timeout: this.timeout
    }).then((result) => {
      return resolve(result)
    }).catch((err) => {
      return reject(err)
    })
  })
}

TurtleCoindRPC.prototype._post = function (method, params) {
  return new Promise((resolve, reject) => {
    if (method.length === 0) return reject(new Error('no method supplied'))
    params = params || {}

    var body = {
      jsonrpc: '2.0',
      method: method,
      params: params
    }

    this._rawPost('json_rpc', body).then((result) => {
      if (!result.error) {
        return resolve(result.result)
      } else {
        return reject(result.error.message)
      }
    }).catch((err) => {
      return reject(err)
    })
  })
}

TurtleCoindRPC.prototype._rawPost = function (endpoint, body) {
  return new Promise((resolve, reject) => {
    if (endpoint.length === 0) return reject(new Error('no endpoint supplied'))
    if (body === undefined) return reject(new Error('no body supplied'))
    var protocol = (this.ssl) ? 'https' : 'http'

    request({
      uri: util.format('%s://%s:%s/%s', protocol, this.host, this.port, endpoint),
      method: 'POST',
      body: body,
      json: true,
      timeout: this.timeout
    }).then((result) => {
      return resolve(result)
    }).catch((err) => {
      return reject(err)
    })
  })
}

TurtleCoindRPC.prototype.fee = function () {
  return new Promise((resolve, reject) => {
    this._get('fee').then((result) => {
      return resolve(result)
    }).catch((err) => {
      return reject(err)
    })
  })
}

TurtleCoindRPC.prototype.feeInfo = function () {
  return this.fee()
}

TurtleCoindRPC.prototype.getBlock = function (opts) {
  return new Promise((resolve, reject) => {
    opts = opts || {}
    if (!opts.hash) return reject(new Error('must specify hash'))

    this._post('f_block_json', {
      hash: opts.hash
    }).then((result) => {
      return resolve(result.block)
    }).catch((err) => {
      return reject(err)
    })
  })
}

TurtleCoindRPC.prototype.getBlockCount = function () {
  return new Promise((resolve, reject) => {
    this._post('getblockcount').then((result) => {
      return resolve(result.count)
    }).catch((err) => {
      return reject(err)
    })
  })
}

TurtleCoindRPC.prototype.getBlockDetailsByHeight = function (opts) {
  return new Promise((resolve, reject) => {
    opts = opts || {}
    if (opts.blockHeight === undefined) return reject(new Error('must supply a block height'))

    opts.blockHeight = parseInt(opts.blockHeight)
    if (isNaN(opts.blockHeight)) return reject(new Error('must supply a valid block height'))

    var body = {
      blockHeight: opts.blockHeight
    }

    this._rawPost('get_block_details_by_height', body).then((result) => {
      return resolve(result)
    }).catch((err) => {
      return reject(err)
    })
  })
}

TurtleCoindRPC.prototype.getBlockHash = function (opts) {
  return new Promise((resolve, reject) => {
    opts = opts || {}
    if (typeof opts.height === 'undefined') return reject(new Error('must specify height'))

    this._post('on_getblockhash', [
      opts.height
    ]).then((result) => {
      return resolve(result)
    }).catch((err) => {
      return reject(err)
    })
  })
}

TurtleCoindRPC.prototype.getBlockHeaderByHash = function (opts) {
  return new Promise((resolve, reject) => {
    opts = opts || {}
    if (!opts.hash) return reject(new Error('must specify hash'))

    this._post('getblockheaderbyhash', {
      hash: opts.hash
    }).then((result) => {
      return resolve(result.block_header)
    }).catch((err) => {
      return reject(err)
    })
  })
}

TurtleCoindRPC.prototype.getBlockHeaderByHeight = function (opts) {
  return new Promise((resolve, reject) => {
    opts = opts || {}
    if (typeof opts.height === 'undefined') return reject(new Error('must specify height'))

    this._post('getblockheaderbyheight', {
      height: opts.height
    }).then((result) => {
      return resolve(result.block_header)
    }).catch((err) => {
      return reject(err)
    })
  })
}

TurtleCoindRPC.prototype.getBlocks = function (opts) {
  return new Promise((resolve, reject) => {
    opts = opts || {}
    if (typeof opts.height === 'undefined') return reject(new Error('must specify height'))

    this._post('f_blocks_list_json', {
      height: opts.height
    }).then((result) => {
      return resolve(result.blocks)
    }).catch((err) => {
      return reject(err)
    })
  })
}

TurtleCoindRPC.prototype.getBlocksDetailsByHeights = function (opts) {
  return new Promise((resolve, reject) => {
    opts = opts || {}
    if (!Array.isArray(opts.blockHeights)) return reject(new Error('must supply an array of block heights'))

    var body = {
      blockHeights: opts.blockHeights
    }

    this._rawPost('get_blocks_details_by_heights', body).then((result) => {
      return resolve(result)
    }).catch((err) => {
      return reject(err)
    })
  })
}

TurtleCoindRPC.prototype.getBlocksDetailsByHashes = function (opts) {
  return new Promise((resolve, reject) => {
    opts = opts || {}
    if (!Array.isArray(opts.blockHashes)) return reject(new Error('must supply an array of block hashes'))

    var body = {
      blockHashes: opts.blockHashes
    }

    this._rawPost('get_blocks_details_by_hashes', body).then((result) => {
      return resolve(result)
    }).catch((err) => {
      return reject(err)
    })
  })
}

TurtleCoindRPC.prototype.getBlocksFast = function (opts) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(opts.blockHashes)) return reject(new Error('must supply an array of block hashes'))
    if (opts.blockCount && isNaN(opts.blockCount)) return reject(new Error('block count must be a number'))

    const body = {
      block_ids: opts.blockHashes
    }

    if (opts.blockCount) {
      body.blockCount = Math.abs(opts.blockCount)
    }

    this._rawPost('getblocks', body).then((result) => {
      /* We need to do a little bit of massaging here on this
         response because the daemon returns some funny
         business that we don't care for in JS */
      return resolve({
        blocks: result['response.blocks'],
        current_height: result['response.current_height'],
        start_height: result['response.start_height'],
        status: result['response.status']
      })
    }).catch((err) => {
      return reject(err)
    })
  })
}

TurtleCoindRPC.prototype.getBlocksHashesByTimestamps = function (opts) {
  return new Promise((resolve, reject) => {
    opts = opts || {}
    if (opts.timestampBegin === undefined) return reject(new Error('must supply a beginning timestamp'))
    if (opts.seconds === undefined) return reject(new Error('must supply seconds value'))

    var body = {
      timestampBegin: opts.timestampBegin,
      secondsCount: opts.seconds
    }

    this._rawPost('get_blocks_hashes_by_timestamps', body).then((result) => {
      return resolve(result)
    }).catch((err) => {
      return reject(err)
    })
  })
}

TurtleCoindRPC.prototype.getBlockTemplate = function (opts) {
  return new Promise((resolve, reject) => {
    opts = opts || {}
    if (typeof opts.reserveSize === 'undefined') return reject(new Error('must specify reserveSize'))
    if (!opts.walletAddress) return reject(new Error('must specify walletAddress'))

    this._post('getblocktemplate', {
      reserve_size: opts.reserveSize,
      wallet_address: opts.walletAddress
    }).then((result) => {
      return resolve(result)
    }).catch((err) => {
      return reject(err)
    })
  })
}

TurtleCoindRPC.prototype.getCurrencyId = function () {
  return new Promise((resolve, reject) => {
    this._post('getcurrencyid').then((result) => {
      return resolve(result.currency_id_blob)
    }).catch((err) => {
      return reject(err)
    })
  })
}

TurtleCoindRPC.prototype.getGlobalIndexesForRange = function (opts) {
  return new Promise((resolve, reject) => {
    opts = opts || {}

    if (typeof opts.startHeight === 'undefined') return reject(new Error('Must specify start height'))
    if (typeof opts.endHeight === 'undefined') return reject(new Error('Must specify end height'))

    this._rawPost('get_global_indexes_for_range', {
      startHeight: opts.startHeight,
      endHeight: opts.endHeight
    }).then((result) => {
      if (!result.status || !result.indexes) {
        return reject(new Error('Missing indexes or status key'))
      }
      if (result.status !== 'OK') {
        return reject(new Error('Status not OK'))
      }
      return resolve(result.indexes)
    }).catch((err) => {
      return reject(err)
    })
  })
}

TurtleCoindRPC.prototype.getHeight = function () {
  return this.height()
}

TurtleCoindRPC.prototype.getIndexes = function (opts) {
  return new Promise((resolve, reject) => {
    opts = opts || {}
    if (opts.transactionHash === undefined) return reject(new Error('must supply a transaction hash'))

    var body = {
      txid: opts.transactionHash
    }

    this._rawPost('get_o_indexes', body).then((result) => {
      return resolve(result)
    }).catch((err) => {
      return reject(err)
    })
  })
}

TurtleCoindRPC.prototype.getInfo = function () {
  return this.info()
}

TurtleCoindRPC.prototype.getLastBlockHeader = function () {
  return new Promise((resolve, reject) => {
    this._post('getlastblockheader').then((result) => {
      return resolve(result.block_header)
    }).catch((err) => {
      return reject(err)
    })
  })
}

TurtleCoindRPC.prototype.getPeers = function () {
  return this.peers()
}

TurtleCoindRPC.prototype.getPoolChanges = function (opts) {
  return new Promise((resolve, reject) => {
    opts = opts || {}
    if (opts.tailBlockHash === undefined) return reject(new Error('must supply a tail block hash'))
    if (!Array.isArray(opts.knownTransactionHashes)) return reject(new Error('must supply an array of known transaction hashes'))

    var body = {
      tailBlockId: opts.tailBlockHash,
      knownTxsIds: opts.knownTransactionHashes
    }

    this._rawPost('get_pool_changes', body).then((result) => {
      return resolve(result)
    }).catch((err) => {
      return reject(err)
    })
  })
}

TurtleCoindRPC.prototype.getPoolChangesLite = function (opts) {
  return new Promise((resolve, reject) => {
    opts = opts || {}
    if (opts.tailBlockHash === undefined) return reject(new Error('must supply a tail block hash'))
    if (!Array.isArray(opts.knownTransactionHashes)) return reject(new Error('must supply an array of known transaction hashes'))

    var body = {
      tailBlockId: opts.tailBlockHash,
      knownTxsIds: opts.knownTransactionHashes
    }

    this._rawPost('get_pool_changes_lite', body).then((result) => {
      return resolve(result)
    }).catch((err) => {
      return reject(err)
    })
  })
}

TurtleCoindRPC.prototype.getRandomOutputs = function (opts) {
  return new Promise((resolve, reject) => {
    opts = opts || {}
    if (!Array.isArray(opts.amounts)) return reject(new Error('must supply an array of amounts'))
    if (typeof opts.mixin === 'undefined') return reject(new Error('must supply a mixin value'))

    opts.mixin = parseInt(opts.mixin)
    if (isNaN(opts.mixin)) return reject(new Error('must supply a valid mixin value'))

    var body = {
      amounts: opts.amounts,
      outs_count: opts.mixin
    }

    this._rawPost('getrandom_outs', body).then((result) => {
      return resolve(result)
    }).catch((err) => {
      return reject(err)
    })
  })
}

TurtleCoindRPC.prototype.getTransaction = function (opts) {
  return new Promise((resolve, reject) => {
    opts = opts || {}
    if (!opts.hash) return reject(new Error('must specify hash'))

    this._post('f_transaction_json', {
      hash: opts.hash
    }).then((result) => {
      return resolve(result)
    }).catch((err) => {
      return reject(err)
    })
  })
}

TurtleCoindRPC.prototype.getTransactionDetailsByHashes = function (opts) {
  return new Promise((resolve, reject) => {
    opts = opts || {}
    if (!Array.isArray(opts.transactionHashes)) return reject(new Error('must supply an array of transaction hashes'))

    var body = {
      transactionHashes: opts.transactionHashes
    }

    this._rawPost('get_transaction_details_by_hashes', body).then((result) => {
      return resolve(result)
    }).catch((err) => {
      return reject(err)
    })
  })
}

TurtleCoindRPC.prototype.getTransactionHashesByPaymentId = function (opts) {
  return new Promise((resolve, reject) => {
    opts = opts || {}
    if (opts.paymentId === undefined) return reject(new Error('must supply a payment ID'))

    var body = {
      paymentId: opts.paymentId
    }

    this._rawPost('get_transaction_hashes_by_payment_id', body).then((result) => {
      return resolve(result)
    }).catch((err) => {
      return reject(err)
    })
  })
}

TurtleCoindRPC.prototype.getTransactionPool = function () {
  return new Promise((resolve, reject) => {
    this._post('f_on_transactions_pool_json').then((result) => {
      return resolve(result.transactions)
    }).catch((err) => {
      return reject(err)
    })
  })
}

TurtleCoindRPC.prototype.getTransactions = function (opts) {
  return new Promise((resolve, reject) => {
    opts = opts || {}
    if (!opts.hashes) return reject(new Error('must specify transaction hashes'))

    this._rawPost('gettransactions', {
      txs_hashes: opts.hashes
    }).then((result) => {
      return resolve(result)
    }).catch((err) => {
      return reject(err)
    })
  })
}

TurtleCoindRPC.prototype.getTransactionsStatus = function (opts) {
  return new Promise((resolve, reject) => {
    opts = opts || {}

    if (!opts.transactionHashes) return reject(new Error('Must specify transaction hashes'))

    this._rawPost('get_transactions_status', {
      transactionHashes: opts.transactionHashes
    }).then((result) => {
      if (!result.status || !result.transactionsInPool || !result.transactionsInBlock || !result.transactionsUnknown) {
        return reject(new Error('Missing status or transactions key'))
      }
      if (result.status !== 'OK') {
        return reject(new Error('Status not OK'))
      }
      return resolve({
        transactionsInPool: result.transactionsInPool,
        transactionsInBlock: result.transactionsInBlock,
        transactionsUnknown: result.transactionsUnknown
      })
    }).catch((err) => {
      return reject(err)
    })
  })
}

TurtleCoindRPC.prototype.getWalletSyncData = function (opts) {
  return new Promise((resolve, reject) => {
    opts = opts || {}

    if (typeof opts.startHeight === 'undefined') {
      opts.startHeight = 0
    }

    if (typeof opts.startTimestamp === 'undefined') {
      opts.startTimestamp = 0
    }

    if (!opts.blockHashCheckpoints) {
      opts.blockHashCheckpoints = {}
    }

    if (typeof opts.skipCoinbaseTransactions === 'undefined') {
      opts.skipCoinbaseTransactions = false
    }

    this._rawPost('getwalletsyncdata', {
      startHeight: opts.startHeight,
      startTimestamp: opts.startTimestamp,
      blockHashCheckpoints: opts.blockHashCheckpoints,
      skipCoinbaseTransactions: opts.skipCoinbaseTransactions
    }).then((result) => {
      if (!result.status || !result.items) {
        return reject(new Error('Missing items or status key'))
      }
      if (result.status !== 'OK') {
        return reject(new Error('Status not OK'))
      }
      return resolve(result)
    }).catch((err) => {
      return reject(err)
    })
  })
}

TurtleCoindRPC.prototype.height = function () {
  return new Promise((resolve, reject) => {
    this._get('height').then((result) => {
      return resolve(result)
    }).catch((err) => {
      return reject(err)
    })
  })
}

TurtleCoindRPC.prototype.info = function () {
  return new Promise((resolve, reject) => {
    this._get('info').then((result) => {
      return resolve(result)
    }).catch((err) => {
      return reject(err)
    })
  })
}

TurtleCoindRPC.prototype.peers = function () {
  return new Promise((resolve, reject) => {
    this._get('peers').then((result) => {
      return resolve(result)
    }).catch((err) => {
      return reject(err)
    })
  })
}

TurtleCoindRPC.prototype.queryBlocks = function (opts) { // queryblocks
  // *first 10 blocks id goes sequential, next goes in pow(2,n) offset, like 2, 4, 8, 16, 32, 64 and so on, and the last one is always genesis block */
  return new Promise((resolve, reject) => {
    return reject(new Error('This RPC call is not implemented'))
  })
}

TurtleCoindRPC.prototype.queryBlocksDetailed = function (opts) {
  // *first 10 blocks id goes sequential, next goes in pow(2,n) offset, like 2, 4, 8, 16, 32, 64 and so on, and the last one is always genesis block */
  return new Promise((resolve, reject) => {
    opts = opts || {}
    if (!Array.isArray(opts.blockHashes)) return reject(new Error('must supply an array of block hashes'))
    if (opts.timestamp === undefined) opts.timestamp = 0
    if (opts.blockCount === undefined) opts.blockCount = 100

    var body = {
      blockIds: opts.blockHashes,
      timestamp: opts.timestamp,
      blockCount: opts.blockCount
    }

    this._rawPost('queryblocksdetailed', body).then((result) => {
      return resolve(result)
    }).catch((err) => {
      return reject(err)
    })
  })
}

TurtleCoindRPC.prototype.queryBlocksLite = function (opts) {
  // *first 10 blocks id goes sequential, next goes in pow(2,n) offset, like 2, 4, 8, 16, 32, 64 and so on, and the last one is always genesis block */
  return new Promise((resolve, reject) => {
    opts = opts || {}
    if (!Array.isArray(opts.blockHashes)) return reject(new Error('must supply an array of block hashes'))
    if (opts.timestamp === undefined) opts.timestamp = 0

    var body = {
      blockIds: opts.blockHashes,
      timestamp: opts.timestamp
    }

    this._rawPost('queryblockslite', body).then((result) => {
      return resolve(result)
    }).catch((err) => {
      return reject(err)
    })
  })
}

TurtleCoindRPC.prototype.sendRawTransaction = function (opts) {
  return new Promise((resolve, reject) => {
    opts = opts || {}
    if (!opts.tx) return reject(new Error('must specify raw serialized transaction'))

    this._rawPost('sendrawtransaction', {
      tx_as_hex: opts.tx
    }).then((result) => {
      return resolve(result)
    }).catch((err) => {
      return reject(err)
    })
  })
}

TurtleCoindRPC.prototype.submitBlock = function (opts) {
  return new Promise((resolve, reject) => {
    opts = opts || {}
    if (!opts.blockBlob) return reject(new Error('must specify blockBlob'))
    this._post('submitblock', [
      opts.blockBlob
    ]).then((result) => {
      return resolve(result)
    }).catch((err) => {
      return reject(err)
    })
  })
}

module.exports = TurtleCoindRPC
