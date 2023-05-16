const path = require('path');
const baseConfig = require('./webpack.base');
const nodeExternals = require('webpack-node-externals');
const { merge } = require('webpack-merge');

const config = {
  target: 'node',
  entry: './src/server/index.js',
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'server.js'
  },
  externals: [nodeExternals()]
}

module.exports = merge(baseConfig, config)