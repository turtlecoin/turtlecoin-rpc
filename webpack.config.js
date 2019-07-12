'use strict'

module.exports = {
  mode: 'production',
  entry: './index.js',
  output: {
    filename: 'TurtleCoinRPC.js',
    library: 'TurtleCoinRPC',
    libraryTarget: 'umd'
  },
  node: {
    fs: 'empty',
    tls: 'empty',
    net: 'empty'
  },
  target: 'web'
}
