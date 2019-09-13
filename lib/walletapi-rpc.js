// Copyright (c) 2018-2019, Brandon Lehmann, The TurtleCoin Developers
//
// Please see the included LICENSE file for more information.

'use strict'

const packageInfo = require('../package.json')
const request = require('request-promise-native')
const util = require('util')

const WalletAPI = function (opts) {
  opts = opts || {}
  if (!(this instanceof WalletAPI)) return new WalletAPI(opts)
  this.host = opts.host || '127.0.0.1'
  this.port = opts.port || 8070
  this.timeout = opts.timeout || 30000
  this.ssl = opts.ssl || false
  this.rpcPassword = opts.rpcPassword || false
  this.defaultMixin = (opts.defaultMixin !== undefined) ? opts.defaultMixin : false
  this.defaultFee = (opts.defaultFee !== undefined) ? opts.defaultFee : 0.1
  this.decimalDivisor = opts.decimalDivisor || 100
  this.defaultUnlockTime = opts.defaultUnlockTime || 0
  this.userAgent = opts.userAgent || util.format('%s/%s', packageInfo.name, packageInfo.version)

  if (!this.rpcPassword) {
    throw new Error('Must supply a rpcPassword')
  }
}

/* Helper Methods */

WalletAPI.prototype.toAtomicUnits = function (amount) {
  if (isNaN(parseFloat(amount))) throw new Error('Amount is not a number')

  return parseInt(parseFloat(amount) * this.decimalDivisor)
}

WalletAPI.prototype.fromAtomicUnits = function (amount) {
  if (isNaN(parseInt(amount))) throw new Error('Amount is not a number')
  if (amount.toString().indexOf('.') !== -1) return parseFloat(amount)

  return parseFloat(parseInt(amount) / this.decimalDivisor)
}

/* Wallet Operations */

WalletAPI.prototype.open = function (filename, password, host, port, ssl) {
  host = host || '127.0.0.1'
  port = port || 11898
  ssl = ssl || false

  return new Promise((resolve, reject) => {
    if (!filename) return reject(new Error('Must supply wallet filename'))
    if (!password) return reject(new Error('Must supply wallet password'))

    this._post('/wallet/open', {
      daemonHost: host,
      daemonPort: port,
      daemonSSL: ssl,
      filename: filename,
      password: password
    }).then(() => {
      return resolve()
    }).catch((err) => {
      return reject(handleError(err))
    })
  })
}

WalletAPI.prototype.importKey = function (filename, password, viewKey, spendKey, scanHeight, host, port, ssl) {
  scanHeight = scanHeight || 0
  host = host || '127.0.0.1'
  port = port || 11898
  ssl = ssl || false

  return new Promise((resolve, reject) => {
    if (!filename) return reject(new Error('Must supply wallet filename'))
    if (!password) return reject(new Error('Must supply wallet password'))
    if (!viewKey) return reject(new Error('Must supply private view key'))
    if (!spendKey) return reject(new Error('Must supply private spend key'))

    this._post('/wallet/import/key', {
      daemonHost: host,
      daemonPort: port,
      daemonSSL: ssl,
      filename: filename,
      password: password,
      scanHeight: scanHeight,
      privateViewKey: viewKey,
      privateSpendKey: spendKey
    }).then(() => {
      return resolve()
    }).catch((err) => {
      return reject(handleError(err))
    })
  })
}

WalletAPI.prototype.importSeed = function (filename, password, mnemonicSeed, scanHeight, host, port, ssl) {
  scanHeight = scanHeight || 0
  host = host || '127.0.0.1'
  port = port || 11898
  ssl = ssl || false

  return new Promise((resolve, reject) => {
    if (!filename) return reject(new Error('Must supply wallet filename'))
    if (!password) return reject(new Error('Must supply wallet password'))
    if (!mnemonicSeed) return reject(new Error('Must supply mnemonic seed phrase'))

    this._post('/wallet/import/seed', {
      daemonHost: host,
      daemonPort: port,
      daemonSSL: ssl,
      filename: filename,
      password: password,
      scanHeight: scanHeight,
      mnemonicSeed: mnemonicSeed
    }).then(() => {
      return resolve()
    }).catch((err) => {
      return reject(handleError(err))
    })
  })
}

WalletAPI.prototype.importViewOnly = function (filename, password, viewKey, address, scanHeight, host, port, ssl) {
  scanHeight = scanHeight || 0
  host = host || '127.0.0.1'
  port = port || 11898
  ssl = ssl || false

  return new Promise((resolve, reject) => {
    if (!filename) return reject(new Error('Must supply wallet filename'))
    if (!password) return reject(new Error('Must supply wallet password'))
    if (!viewKey) return reject(new Error('Must supply private view key'))
    if (!address) return reject(new Error('Must supply wallet address'))

    this._post('/wallet/import/view', {
      daemonHost: host,
      daemonPort: port,
      daemonSSL: ssl,
      filename: filename,
      password: password,
      scanHeight: scanHeight,
      privateViewKey: viewKey,
      address: address
    }).then(() => {
      return resolve()
    }).catch((err) => {
      return reject(handleError(err))
    })
  })
}

WalletAPI.prototype.create = function (filename, password, host, port, ssl) {
  host = host || '127.0.0.1'
  port = port || 11898
  ssl = ssl || false

  return new Promise((resolve, reject) => {
    if (!filename) return reject(new Error('Must supply wallet filename'))
    if (!password) return reject(new Error('Must supply wallet password'))

    this._post('/wallet/create', {
      daemonHost: host,
      daemonPort: port,
      daemonSSL: ssl,
      filename: filename,
      password: password
    }).then(() => {
      return resolve()
    }).catch((err) => {
      return reject(handleError(err))
    })
  })
}

WalletAPI.prototype.close = function () {
  return new Promise((resolve, reject) => {
    this._delete('/wallet').then(() => {
      return resolve()
    }).catch((err) => {
      return reject(handleError(err))
    })
  })
}

/* Address Operations */

WalletAPI.prototype.addresses = function () {
  return new Promise((resolve, reject) => {
    this._get('/addresses').then((result) => {
      return resolve(result.addresses)
    }).catch((err) => {
      return reject(handleError(err))
    })
  })
}

WalletAPI.prototype.deleteAddress = function (address) {
  address = address || false
  return new Promise((resolve, reject) => {
    if (!address) return reject(new Error('Must supply wallet address'))

    const url = util.format('/addresses/%s', address)
    this._delete(url).then(() => {
      return resolve()
    }).catch((err) => {
      return reject(handleError(err))
    })
  })
}

WalletAPI.prototype.primaryAddress = function () {
  return new Promise((resolve, reject) => {
    this._get('/addresses/primary').then((result) => {
      return resolve(result.address)
    }).catch((err) => {
      return reject(handleError(err))
    })
  })
}

WalletAPI.prototype.createAddress = function () {
  return new Promise((resolve, reject) => {
    this._post('/addresses/create').then((result) => {
      return resolve(result)
    }).catch((err) => {
      return reject(handleError(err))
    })
  })
}

WalletAPI.prototype.importAddress = function (spendKey, scanHeight) {
  spendKey = spendKey || false
  scanHeight = scanHeight || 0

  return new Promise((resolve, reject) => {
    if (!spendKey) return reject(new Error('Must supply private spend key'))

    this._post('/addresses/import', {
      privateSpendKey: spendKey,
      scanHeight: scanHeight
    }).then((result) => {
      return resolve(result.address)
    }).catch((err) => {
      return reject(handleError(err))
    })
  })
}

WalletAPI.prototype.importViewAddress = function (spendKey, scanHeight) {
  spendKey = spendKey || false
  scanHeight = scanHeight || 0

  return new Promise((resolve, reject) => {
    if (!spendKey) return reject(new Error('Must supply public spend key'))

    this._post('/addresses/import/view', {
      publicSpendKey: spendKey,
      scanHeight: scanHeight
    }).then((result) => {
      return resolve(result.address)
    }).catch((err) => {
      return reject(handleError(err))
    })
  })
}

WalletAPI.prototype.createIntegratedAddress = function (address, paymentId) {
  address = address || false
  paymentId = paymentId || false

  return new Promise((resolve, reject) => {
    if (!address) return reject(new Error('Must supply wallet address'))
    if (!paymentId) return reject(new Error('Must supply payment ID'))

    const url = util.format('/addresses/%s/%s', address, paymentId)
    this._get(url).then((result) => {
      return resolve(result.integratedAddress)
    }).catch((err) => {
      return reject(handleError(err))
    })
  })
}

/* Node Operations */

WalletAPI.prototype.getNode = function () {
  return new Promise((resolve, reject) => {
    this._get('/node').then((result) => {
      return resolve(result)
    }).catch((err) => {
      return reject(handleError(err))
    })
  })
}

WalletAPI.prototype.setNode = function (host, port, ssl) {
  host = host || false
  port = port || false
  ssl = ssl || false

  return new Promise((resolve, reject) => {
    if (!host && !port) return reject(new Error('Must specify a minimum a host or port parameter'))

    const request = {
      daemonHost: host,
      daemonPort: port,
      daemonSSL: ssl
    }

    if (!request.daemonHost) delete request.daemonHost
    if (!request.daemonPort) delete request.daemonPort

    this._put('/node', request).then(() => {
      return resolve()
    }).catch((err) => {
      return reject(handleError(err))
    })
  })
}

/* Key Operations */

WalletAPI.prototype.keys = function (address) {
  address = address || false

  return new Promise((resolve, reject) => {
    const url = (address) ? util.format('/keys/%s', address) : '/keys'
    this._get(url).then((result) => {
      return resolve(result.privateViewKey)
    }).catch((err) => {
      return reject(handleError(err))
    })
  })
}

WalletAPI.prototype.keysMnemonic = function (address) {
  address = address || false

  return new Promise((resolve, reject) => {
    if (!address) return reject(new Error('Must supply a wallet address'))

    const url = util.format('/keys/mnemonic/%s', address)
    this._get(url).then((result) => {
      return resolve(result.mnemonicSeed)
    }).catch((err) => {
      return reject(handleError(err))
    })
  })
}

/* Transaction Operations */

WalletAPI.prototype.transactions = function (startHeight, endHeight) {
  startHeight = startHeight || false
  endHeight = endHeight || false

  return new Promise((resolve, reject) => {
    var url = '/transactions'

    if (startHeight) {
      url += util.format('/%s', startHeight)
      if (endHeight) {
        url += util.format('/%s', endHeight)
      }
    }

    this._get(url).then((result) => {
      /* Convert amounts to human readable amounts */
      for (var i = 0; i < result.transactions.length; i++) {
        result.transactions[i].fee = this.fromAtomicUnits(result.transactions[i].fee)

        for (var j = 0; j < result.transactions[i].transfers.length; j++) {
          result.transactions[i].transfers[j].amount = this.fromAtomicUnits(result.transactions[i].transfers[j].amount)
        }
      }

      return resolve(result.transactions)
    }).catch((err) => {
      return reject(handleError(err))
    })
  })
}

WalletAPI.prototype.transactionByHash = function (hash) {
  hash = hash || false

  return new Promise((resolve, reject) => {
    if (!hash) return reject(new Error('Must supply transaction hash'))

    const url = util.format('/transactions/hash/%s', hash)
    this._get(url).then((result) => {
      /* Convert amounts to human readable amounts */
      result.transaction.fee = this.fromAtomicUnits(result.transaction.fee)

      for (var i = 0; i < result.transaction.transfers.length; i++) {
        result.transaction.transfers[i].amount = this.fromAtomicUnits(result.transaction.transfers[i].amount)
      }

      return resolve(result.transaction)
    }).catch((err) => {
      return reject(handleError(err))
    })
  })
}

WalletAPI.prototype.unconfirmedTransactions = function (address) {
  address = address || false

  return new Promise((resolve, reject) => {
    const url = (address) ? util.format('/transactions/unconfirmed/%s', address) : '/transactions/unconfirmed'
    this._get(url).then((result) => {
      /* Convert amounts to human readable amounts */
      for (var i = 0; i < result.transactions.length; i++) {
        result.transactions[i].fee = this.fromAtomicUnits(result.transactions[i].fee)

        for (var j = 0; j < result.transactions[i].transfers.length; j++) {
          result.transactions[i].transfers[j].amount = this.fromAtomicUnits(result.transactions[i].transfers[j].amount)
        }
      }

      return resolve(result.transactions)
    }).catch((err) => {
      return reject(handleError(err))
    })
  })
}

WalletAPI.prototype.transactionsByAddress = function (address, startHeight, endHeight) {
  address = address || false
  startHeight = startHeight || false
  endHeight = endHeight || false

  return new Promise((resolve, reject) => {
    if (!address) return reject(new Error('Must supply wallet address'))
    if (typeof startHeight === 'undefined') return reject(new Error('Must supply start height'))

    var url = util.format('/transactions/address/%s/%s', address, startHeight)

    if (endHeight) {
      url += util.format('/%s', endHeight)
    }

    this._get(url).then((result) => {
      /* Convert amounts to human readable amounts */
      for (var i = 0; i < result.transactions.length; i++) {
        result.transactions[i].fee = this.fromAtomicUnits(result.transactions[i].fee)

        for (var j = 0; j < result.transactions[i].transfers.length; j++) {
          result.transactions[i].transfers[j].amount = this.fromAtomicUnits(result.transactions[i].transfers[j].amount)
        }
      }

      return resolve(result.transactions)
    }).catch((err) => {
      return reject(handleError(err))
    })
  })
}

WalletAPI.prototype.sendBasic = function (address, amount, paymentId) {
  address = address || false
  amount = amount || false
  paymentId = paymentId || false

  return new Promise((resolve, reject) => {
    if (!address) return reject(new Error('Must supply wallet address'))
    if (typeof amount === 'undefined') return reject(new Error('Must supply amount'))

    amount = this.toAtomicUnits(amount)

    const request = {
      destination: address,
      amount: amount,
      paymentID: paymentId
    }

    if (!request.paymentID) delete request.paymentID

    this._post('/transactions/send/basic', request).then((result) => {
      return resolve(result.transactionHash)
    }).catch((err) => {
      return reject(handleError(err))
    })
  })
}

WalletAPI.prototype.newDestination = function (address, amount) {
  return {
    address: address,
    amount: this.toAtomicUnits(amount)
  }
}

WalletAPI.prototype.sendAdvanced = function (destinations, mixin, fee, sourceAddresses, paymentId, changeAddress, unlockTime) {
  destinations = destinations || []
  mixin = mixin || this.defaultMixin
  fee = fee || this.defaultFee
  sourceAddresses = sourceAddresses || []
  paymentId = paymentId || false
  changeAddress = changeAddress || false
  unlockTime = unlockTime || this.defaultUnlockTime

  fee = this.toAtomicUnits(fee)

  return new Promise((resolve, reject) => {
    if (!Array.isArray(destinations)) return reject(new Error('Must supply an array of destinations'))

    for (var i = 0; i < destinations.length; i++) {
      if (!destinations[i].address) return reject(new Error('Must supply a wallet address in destination object'))
      if (typeof destinations[i].amount === 'undefined') return reject(new Error('Must supply an amount in destination object'))
    }

    if (!Array.isArray(sourceAddresses)) return reject(new Error('Must supply an array of source wallet addresses'))

    const request = {
      destinations: destinations,
      mixin: mixin,
      fee: fee,
      sourceAddresses: sourceAddresses,
      paymentID: paymentId,
      changeAddress: changeAddress,
      unlockTime: unlockTime
    }

    if (!request.mixin) delete request.mixin
    if (request.sourceAddresses.length === 0) delete request.sourceAddresses
    if (!request.paymentID) delete request.paymentID
    if (!request.changeAddress) delete request.changeAddress

    this._post('/transactions/send/advanced', request).then((result) => {
      return resolve(result.transactionHash)
    }).catch((err) => {
      return reject(handleError(err))
    })
  })
}

WalletAPI.prototype.sendFusionBasic = function () {
  return new Promise((resolve, reject) => {
    this._post('/transactions/send/fusion/basic').then((result) => {
      return resolve(result.transactionHash)
    }).catch((err) => {
      return reject(handleError(err))
    })
  })
}

WalletAPI.prototype.sendFusionAdvanced = function (address, mixin, sourceAddresses) {
  address = address || false
  mixin = mixin || this.defaultMixin
  sourceAddresses = sourceAddresses || []

  return new Promise((resolve, reject) => {
    if (!address) return reject(new Error('Must supply a wallet address'))
    if (!Array.isArray(sourceAddresses)) return reject(new Error('Must supply an array of source wallet addresses'))

    const request = {
      destination: address,
      mixin: mixin,
      sourceAddresses: sourceAddresses
    }

    if (!request.mixin) delete request.mixin
    if (request.sourceAddresses.length === 0) delete request.sourceAddresses

    this._post('/transactions/send/fusion/advanced', request).then((result) => {
      return resolve(result.transactionHash)
    }).catch((err) => {
      return reject(handleError(err))
    })
  })
}

WalletAPI.prototype.transactionPrivateKey = function (hash) {
  hash = hash || false

  return new Promise((resolve, reject) => {
    if (!hash) return reject(new Error('Must supply transaction hash'))

    const url = util.format('/transactions/privatekey/%s', hash)
    this._get(url).then((result) => {
      return resolve(result.transactionPrivateKey)
    }).catch((err) => {
      return reject(handleError(err))
    })
  })
}

/* Balance Operations */

WalletAPI.prototype.balance = function (address) {
  address = address || false

  return new Promise((resolve, reject) => {
    const url = (address) ? util.format('/balance/%s', address) : '/balance'
    this._get(url).then((result) => {
      /* Convert the amounts to human readable amounts */
      result.unlocked = this.fromAtomicUnits(result.unlocked)
      result.locked = this.fromAtomicUnits(result.locked)

      return resolve(result)
    }).catch((err) => {
      return reject(handleError(err))
    })
  })
}

WalletAPI.prototype.balances = function () {
  return new Promise((resolve, reject) => {
    this._get('/balances').then((result) => {
      /* Convert the amounts to human readable amounts */
      for (var i = 0; i < result.length; i++) {
        result[i].unlocked = this.fromAtomicUnits(result[i].unlocked)
        result[i].locked = this.fromAtomicUnits(result[i].locked)
      }

      return resolve(result)
    }).catch((err) => {
      return reject(handleError(err))
    })
  })
}

/* Misc Operations */

WalletAPI.prototype.save = function () {
  return new Promise((resolve, reject) => {
    this._put('/save').then(() => {
      return resolve()
    }).catch((err) => {
      return reject(handleError(err))
    })
  })
}

WalletAPI.prototype.reset = function (scanHeight) {
  scanHeight = scanHeight || 0

  return new Promise((resolve, reject) => {
    this._put('/reset', {
      scanHeight: scanHeight
    }).then(() => {
      return resolve()
    }).catch((err) => {
      return reject(handleError(err))
    })
  })
}

WalletAPI.prototype.validateAddress = function (address) {
  return new Promise((resolve, reject) => {
    this._post('/addresses/validate', {
      address: address
    }).then((result) => {
      return resolve(result)
    }).catch((err) => {
      return reject(handleError(err))
    })
  })
}

WalletAPI.prototype.status = function () {
  return new Promise((resolve, reject) => {
    this._get('/status').then((result) => {
      return resolve(result)
    }).catch((err) => {
      return reject(handleError(err))
    })
  })
}

WalletAPI.prototype._get = function (path) {
  return new Promise((resolve, reject) => {
    if (!path) return reject(new Error('Must supply a path'))
    const protocol = (this.ssl) ? 'https' : 'http'

    request({
      uri: util.format('%s://%s:%s%s', protocol, this.host, this.port, path),
      method: 'GET',
      json: true,
      timeout: this.timeout,
      headers: {
        'X-API-KEY': this.rpcPassword,
        'User-Agent': this.userAgent
      }
    }).then((result) => {
      return resolve(result)
    }).catch((error) => {
      return reject(error)
    })
  })
}

WalletAPI.prototype._post = function (path, payload) {
  return new Promise((resolve, reject) => {
    if (!path) return reject(new Error('Must supply a path'))
    const protocol = (this.ssl) ? 'https' : 'http'

    request({
      uri: util.format('%s://%s:%s%s', protocol, this.host, this.port, path),
      method: 'POST',
      json: true,
      timeout: this.timeout,
      headers: {
        'X-API-KEY': this.rpcPassword,
        'User-Agent': this.userAgent
      },
      body: payload
    }).then((result) => {
      return resolve(result)
    }).catch((error) => {
      return reject(error)
    })
  })
}

WalletAPI.prototype._put = function (path, payload) {
  return new Promise((resolve, reject) => {
    if (!path) return reject(new Error('Must supply a path'))
    const protocol = (this.ssl) ? 'https' : 'http'

    request({
      uri: util.format('%s://%s:%s%s', protocol, this.host, this.port, path),
      method: 'PUT',
      json: true,
      timeout: this.timeout,
      headers: {
        'X-API-KEY': this.rpcPassword,
        'User-Agent': this.userAgent
      },
      body: payload
    }).then((result) => {
      return resolve(result)
    }).catch((error) => {
      return reject(error)
    })
  })
}

WalletAPI.prototype._delete = function (path) {
  return new Promise((resolve, reject) => {
    if (!path) return reject(new Error('Must supply a path'))
    const protocol = (this.ssl) ? 'https' : 'http'

    request({
      uri: util.format('%s://%s:%s%s', protocol, this.host, this.port, path),
      method: 'DELETE',
      json: true,
      timeout: this.timeout,
      headers: {
        'X-API-KEY': this.rpcPassword,
        'User-Agent': this.userAgent
      }
    }).then((result) => {
      return resolve(result)
    }).catch((error) => {
      return reject(error)
    })
  })
}

function handleError (err) {
  const errorMessage = (err.error && err.error.errorMessage) ? err.error.errorMessage : ''
  switch (err.statusCode) {
    case 400: return new Error('A parse error occured, or an error occured processing your request: ' + errorMessage)
    case 401: return new Error('API key is missing or invalid')
    case 403: return new Error('This operation requires a wallet to be open and one has not been opened')
    case 404: return new Error('The item requested does not exist')
    case 500: return new Error('An exception was thrown while processing the request. See the console for logs')
    default: return new Error(err.toString())
  }
}

module.exports = WalletAPI
