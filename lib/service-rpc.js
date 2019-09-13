// Copyright (c) 2018-2019, Brandon Lehmann, The TurtleCoin Developers
//
// Please see the included LICENSE file for more information.

'use strict'

const request = require('request-promise-native')
const util = require('util')

var TurtleServiceRPC = function (opts) {
  opts = opts || {}
  if (!(this instanceof TurtleServiceRPC)) return new TurtleServiceRPC(opts)
  this.host = opts.host || '127.0.0.1'
  this.port = opts.port || 8070
  this.timeout = opts.timeout || 2000
  this.ssl = opts.ssl || false
  this.rpcPassword = opts.rpcPassword || false
  this.defaultMixin = (opts.defaultMixin !== undefined) ? opts.defaultMixin : false
  this.defaultFee = (opts.defaultFee !== undefined) ? opts.defaultFee : 0.1
  this.defaultBlockCount = opts.defaultBlockCount || 1
  this.decimalDivisor = opts.decimalDivisor || 100
  this.defaultFirstBlockIndex = opts.defaultFirstBlockIndex || 1
  this.defaultUnlockTime = opts.defaultUnlockTime || 0
  this.defaultFusionThreshold = opts.defaultFusionThreshold || 10000000
}

TurtleServiceRPC.prototype._postToWalletd = function (method, params) {
  return new Promise((resolve, reject) => {
    if (method.length === 0) return reject(new Error('No method supplied'))
    var protocol = (this.ssl) ? 'https' : 'http'
    params = params || {}

    var body = {
      jsonrpc: '2.0',
      method: method,
      params: params,
      password: this.rpcPassword
    }

    if (!body.password) {
      delete body.password
    }

    request({
      uri: util.format('%s://%s:%s/json_rpc', protocol, this.host, this.port),
      method: 'POST',
      body: body,
      json: true,
      timeout: this.timeout
    }).then((result) => {
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

TurtleServiceRPC.prototype.createAddress = function (opts) {
  return new Promise((resolve, reject) => {
    opts = opts || {}
    opts.secretSpendKey = opts.secretSpendKey || false
    opts.publicSpendKey = opts.publicSpendKey || false

    if (opts.secretSpendKey && opts.publicSpendKey) return reject(new Error('Cannot specify both secretSpendKey and publicSpendKey'))

    var req = {}
    if (opts.secretSpendKey) {
      req.secretSpendKey = opts.secretSpendKey
    } else if (opts.publicSpendKey) {
      req.publicSpendKey = opts.publicSpendKey
    }

    this._postToWalletd('createAddress', req).then((result) => {
      return resolve(result.address)
    }).catch((err) => {
      return reject(err)
    })
  })
}

TurtleServiceRPC.prototype.createIntegratedAddress = function (opts) {
  return new Promise((resolve, reject) => {
    opts = opts || {}
    opts.address = opts.address || false
    opts.paymentId = opts.paymentId || false

    if (!opts.address || !opts.paymentId) return reject(new Error('You must supply both address and paymentId'))

    var req = {
      address: opts.address,
      paymentId: opts.paymentId
    }

    this._postToWalletd('createIntegratedAddress', req).then((result) => {
      return resolve(result.integratedAddress)
    }).catch((err) => {
      return reject(err)
    })
  })
}

TurtleServiceRPC.prototype.createDelayedTransaction = function (opts) {
  return new Promise((resolve, reject) => {
    opts = opts || {}
    opts.addresses = opts.addresses = []
    opts.transfers = opts.transfers || false
    opts.fee = (opts.fee !== undefined) ? opts.fee : this.defaultFee
    opts.unlockTime = opts.unlockTime || this.defaultUnlockTime
    opts.mixin = (opts.mixin !== undefined) ? opts.mixin : this.defaultMixin
    opts.extra = opts.extra || false
    opts.paymentId = opts.paymentId || false
    opts.changeAddress = opts.changeAddress || false

    if (!opts.transfers) return reject(new Error('Must supply Array of transfers'))

    var req = {
      addresses: opts.addresses,
      transfers: opts.transfers,
      fee: (opts.fee * this.decimalDivisor),
      unlockTime: opts.unlockTime,
      anonymity: opts.mixin,
      extra: opts.extra,
      paymentId: opts.paymentId,
      changeAddress: opts.changeAddress
    }

    if (!req.anonymity) {
      delete req.anonymity
    }

    if (!req.extra) {
      delete req.extra
    }

    if (!req.paymentId) {
      delete req.paymentId
    }

    function go () {
      this._postToWalletd('createDelayedTransaction', req).then((result) => {
        return resolve(result)
      }).catch((err) => {
        return reject(err)
      })
    }

    if (!req.changeAddress) {
      this.getAddresses().then((addresses) => {
        req.changeAddress = addresses[0]
        go()
      }).catch((err) => {
        return reject(err)
      })
    } else {
      go()
    }
  })
}

TurtleServiceRPC.prototype.deleteAddress = function (opts) {
  return new Promise((resolve, reject) => {
    opts = opts || {}
    opts.address = opts.address || ''

    if (opts.address.length === 0) return reject(new Error('Must supply address'))

    var req = {
      address: opts.address
    }

    this._postToWalletd('deleteAddress', req).then((result) => {
      return resolve()
    }).catch((err) => {
      return reject(err)
    })
  })
}

TurtleServiceRPC.prototype.deleteDelayedTransaction = function (opts) {
  return new Promise((resolve, reject) => {
    opts = opts || {}
    opts.transactionHash = opts.transactionHash || false

    if (!opts.transactionHash) return reject(new Error('Must supply transactionHash'))

    this._postToWalletd('deleteDelayedTransaction', {
      transactionHash: opts.transactionHash
    }).then(() => {
      return resolve()
    }).catch((err) => {
      return reject(err)
    })
  })
}

TurtleServiceRPC.prototype.estimateFusion = function (opts) {
  return new Promise((resolve, reject) => {
    opts = opts || {}
    opts.threshold = opts.threshold || this.defaultFusionThreshold
    opts.addresses = opts.addresses || []

    var req = {
      threshold: opts.threshold,
      addresses: opts.addresses
    }

    this._postToWalletd('estimateFusion', req).then((result) => {
      return resolve(result)
    }).catch((err) => {
      return reject(err)
    })
  })
}

TurtleServiceRPC.prototype.getAddresses = function () {
  return new Promise((resolve, reject) => {
    this._postToWalletd('getAddresses').then((result) => {
      return resolve(result.addresses)
    }).catch((err) => {
      return reject(err)
    })
  })
}

TurtleServiceRPC.prototype.getBalance = function (opts) {
  return new Promise((resolve, reject) => {
    opts = opts || {}
    opts.address = opts.address || ''

    var req = {
      address: opts.address
    }

    this._postToWalletd('getBalance', req).then((result) => {
      result.availableBalance = (result.availableBalance / this.decimalDivisor)
      result.lockedAmount = (result.lockedAmount / this.decimalDivisor)
      return resolve(result)
    }).catch((err) => {
      return reject(err)
    })
  })
}

TurtleServiceRPC.prototype.getBlockHashes = function (opts) {
  return new Promise((resolve, reject) => {
    opts = opts || {}
    opts.firstBlockIndex = opts.firstBlockIndex || this.defaultFirstBlockIndex
    opts.blockCount = opts.blockCount || this.defaultBlockCount

    var req = {
      firstBlockIndex: opts.firstBlockIndex,
      blockCount: opts.blockCount
    }

    this._postToWalletd('getBlockHashes', req).then((result) => {
      return resolve(result)
    }).catch((err) => {
      return reject(err)
    })
  })
}

TurtleServiceRPC.prototype.getDelayedTransactionHashes = function () {
  return new Promise((resolve, reject) => {
    this._postToWalletd('getDelayedTransactionHashes').then((result) => {
      return resolve(result)
    }).catch((err) => {
      return reject(err)
    })
  })
}

TurtleServiceRPC.prototype.getFeeInfo = function () {
  return this.getNodeFeeInfo()
}

TurtleServiceRPC.prototype.getMnemonicSeed = function (opts) {
  return new Promise((resolve, reject) => {
    opts = opts || {}
    opts.address = opts.address || ''

    if (opts.address.length === 0) return reject(new Error('Must supply addresses'))

    var req = {
      address: opts.address
    }

    this._postToWalletd('getMnemonicSeed', req).then((result) => {
      return resolve(result.mnemonicSeed)
    }).catch((err) => {
      return reject(err)
    })
  })
}

TurtleServiceRPC.prototype.getNodeFeeInfo = function () {
  return new Promise((resolve, reject) => {
    this._postToWalletd('getNodeFeeInfo').then((result) => {
      return resolve(result)
    }).catch((err) => {
      return reject(err)
    })
  })
}

TurtleServiceRPC.prototype.getSpendKeys = function (opts) {
  return new Promise((resolve, reject) => {
    opts = opts || {}
    opts.address = opts.address || ''

    if (opts.address.length === 0) return reject(new Error('Must supply addresses'))

    var req = {
      address: opts.address
    }

    this._postToWalletd('getSpendKeys', req).then((result) => {
      return resolve(result)
    }).catch((err) => {
      return reject(err)
    })
  })
}

TurtleServiceRPC.prototype.getStatus = function () {
  return new Promise((resolve, reject) => {
    this._postToWalletd('getStatus').then((result) => {
      return resolve(result)
    }).catch((err) => {
      return reject(err)
    })
  })
}

TurtleServiceRPC.prototype.getTransaction = function (opts) {
  return new Promise((resolve, reject) => {
    opts = opts || {}
    opts.transactionHash = opts.transactionHash || ''

    if (opts.transactionHash.length === 0) return reject(new Error('Must supply transaction hash'))

    this._postToWalletd('getTransaction', {
      transactionHash: opts.transactionHash
    }).then((result) => {
      result.transaction.amount = (result.transaction.amount / this.decimalDivisor)
      result.transaction.fee = (result.transaction.fee / this.decimalDivisor)
      for (var i = 0; i < result.transaction.transfers.length; i++) {
        result.transaction.transfers[i].amount = (result.transaction.transfers[i].amount / this.decimalDivisor)
      }
      return resolve(result.transaction)
    }).catch((err) => {
      return reject(err)
    })
  })
}

TurtleServiceRPC.prototype.getTransactionHashes = function (opts) {
  return new Promise((resolve, reject) => {
    opts = opts || {}
    opts.addresses = opts.addresses || []
    opts.blockHash = opts.blockHash || false
    opts.firstBlockIndex = opts.firstBlockIndex || this.defaultFirstBlockIndex
    opts.blockCount = opts.blockCount || this.defaultBlockCount
    opts.paymentId = opts.paymentId || false

    var req = {
      addresses: opts.addresses,
      blockHash: (opts.blockHash && opts.blockHash.length !== 0) ? opts.blockHash : false,
      firstBlockIndex: (opts.firstBlockIndex && opts.firstBlockIndex >= 1) ? opts.firstBlockIndex : false,
      blockCount: opts.blockCount,
      paymentId: opts.paymentId
    }

    if (!req.blockHash) {
      delete req.blockHash
    }
    if (!req.firstBlockIndex) {
      delete req.firstBlockIndex
    }
    if (req.blockHash && req.firstBlockIndex) {
      delete req.firstBlockIndex
    }
    if (!req.paymentId) {
      delete req.paymentId
    }

    this._postToWalletd('getTransactionHashes', req).then((result) => {
      return resolve(result.items)
    }).catch((err) => {
      return reject(err)
    })
  })
}

TurtleServiceRPC.prototype.getTransactions = function (opts) {
  return new Promise((resolve, reject) => {
    opts = opts || {}
    opts.addresses = opts.addresses || []
    opts.blockHash = opts.blockHash || false
    opts.firstBlockIndex = opts.firstBlockIndex || this.defaultFirstBlockIndex
    opts.blockCount = opts.blockCount || this.defaultBlockCount
    opts.paymentId = opts.paymentId || false

    var req = {
      addresses: opts.addresses,
      blockHash: (opts.blockHash && opts.blockHash.length !== 0) ? opts.blockHash : false,
      firstBlockIndex: (opts.firstBlockIndex && opts.firstBlockIndex >= 1) ? opts.firstBlockIndex : false,
      blockCount: opts.blockCount,
      paymentId: opts.paymentId
    }

    if (!req.blockHash) {
      delete req.blockHash
    }
    if (!req.firstBlockIndex) {
      delete req.firstBlockIndex
    }
    if (req.blockHash && req.firstBlockIndex) {
      delete req.firstBlockIndex
    }
    if (!req.paymentId) {
      delete req.paymentId
    }

    this._postToWalletd('getTransactions', req).then((result) => {
      var ret = []
      for (var i = 0; i < result.items.length; i++) {
        var block = result.items[i]
        for (var j = 0; j < block.transactions.length; j++) {
          var transaction = block.transactions[j]
          for (var k = 0; k < transaction.transfers.length; k++) {
            var transfer = transaction.transfers[k]
            if (transfer.address.length === 0) continue
            ret.push({
              blockHash: block.blockHash,
              transactionAmount: (transaction.amount / this.decimalDivisor),
              blockIndex: transaction.blockIndex,
              extra: transaction.extra,
              fee: (transaction.fee / this.decimalDivisor),
              isBase: transaction.isBase,
              paymentId: transaction.paymentId,
              state: transaction.state,
              timestamp: transaction.timestamp,
              transactionHash: transaction.transactionHash,
              address: transfer.address,
              amount: (transfer.amount / this.decimalDivisor),
              type: transfer.type,
              inbound: (transfer.amount > 0),
              unlockTime: transaction.unlockTime
            })
          }
        }
      }
      return resolve(ret)
    }).catch((err) => {
      return reject(err)
    })
  })
}

TurtleServiceRPC.prototype.getUnconfirmedTransactionHashes = function (opts) {
  return new Promise((resolve, reject) => {
    opts = opts || {}
    opts.addresses = opts.addresses || []

    this._postToWalletd('getUnconfirmedTransactionHashes', {
      addresses: opts.addresses
    }).then((result) => {
      return resolve(result)
    }).catch((err) => {
      return reject(err)
    })
  })
}

TurtleServiceRPC.prototype.getViewKey = function () {
  return new Promise((resolve, reject) => {
    this._postToWalletd('getViewKey').then((result) => {
      return resolve(result)
    }).catch((err) => {
      return reject(err)
    })
  })
}

TurtleServiceRPC.prototype.newTransfer = function (address, amount) {
  return {
    address: address,
    amount: (amount * this.decimalDivisor)
  }
}

TurtleServiceRPC.prototype.reset = function (opts) {
  return new Promise((resolve, reject) => {
    opts = opts || {}
    opts.scanHeight = opts.scanHeight || false

    var req = {
      scanHeight: opts.scanHeight
    }

    if (req.scanHeight === false) {
      delete req.scanHeight
    }

    this._postToWalletd('reset', req).then(() => {
      return resolve()
    }).catch((err) => {
      return reject(err)
    })
  })
}

TurtleServiceRPC.prototype.save = function () {
  return new Promise((resolve, reject) => {
    this._postToWalletd('save').then(() => {
      return resolve()
    }).catch((err) => {
      return reject(err)
    })
  })
}

TurtleServiceRPC.prototype.sendDelayedTransaction = function (opts) {
  return new Promise((resolve, reject) => {
    opts = opts || {}
    opts.transactionHash = opts.transactionHash || false

    if (!opts.transactionHash) return reject(new Error('Must supply transactionHash'))

    this._postToWalletd('sendDelayedTransaction', {
      transactionHash: opts.transactionHash
    }).then(() => {
      return resolve()
    }).catch((err) => {
      return reject(err)
    })
  })
}

TurtleServiceRPC.prototype.sendFusionTransaction = function (opts) {
  return new Promise((resolve, reject) => {
    opts = opts || {}
    opts.threshold = opts.threshold || this.defaultFusionThreshold
    opts.mixin = (opts.mixin !== undefined) ? opts.mixin : this.defaultMixin
    opts.addresses = opts.addresses || []
    opts.destinationAddress = opts.destinationAddress || false

    var req = {
      threshold: opts.threshold,
      anonymity: opts.mixin,
      addresses: opts.addresses,
      destinationAddress: opts.destinationAddress
    }

    if (!req.anonymity) {
      delete req.anonymity
    }

    if (!req.destinationAddress) {
      delete req.destinationAddress
    }

    this._postToWalletd('sendFusionTransaction', req).then((result) => {
      return resolve(result)
    }).catch((err) => {
      return reject(err)
    })
  })
}

TurtleServiceRPC.prototype.sendTransaction = function (opts) {
  return new Promise((resolve, reject) => {
    var that = this
    opts = opts || {}
    opts.addresses = opts.addresses = []
    opts.transfers = opts.transfers || false
    opts.fee = (opts.fee !== undefined) ? opts.fee : this.defaultFee
    opts.unlockTime = opts.unlockTime || this.defaultUnlockTime
    opts.mixin = (opts.mixin !== undefined) ? opts.mixin : this.defaultMixin
    opts.extra = opts.extra || false
    opts.paymentId = opts.paymentId || false
    opts.changeAddress = opts.changeAddress || false

    if (!opts.transfers) return reject(new Error('Must supply Array of transfers'))

    var req = {
      addresses: opts.addresses,
      transfers: opts.transfers,
      fee: (opts.fee * this.decimalDivisor),
      unlockTime: opts.unlockTime,
      anonymity: opts.mixin,
      extra: opts.extra,
      paymentId: opts.paymentId,
      changeAddress: opts.changeAddress
    }

    if (!req.anonymity) {
      delete req.anonymity
    }

    if (!req.extra) {
      delete req.extra
    }

    if (!req.paymentId) {
      delete req.paymentId
    }

    function go () {
      that._postToWalletd('sendTransaction', req).then((result) => {
        return resolve(result)
      }).catch((err) => {
        return reject(err)
      })
    }

    if (!req.changeAddress) {
      this.getAddresses().then((addresses) => {
        req.changeAddress = addresses[0]
        go()
      }).catch((err) => {
        return reject(err)
      })
    } else {
      go()
    }
  })
}

module.exports = TurtleServiceRPC
