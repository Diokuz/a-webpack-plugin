const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const APlugin = require('../index')

const entry = {
  out: path.resolve(__dirname, './entry.js'),
}

const output = {
  path: path.resolve(__dirname),
  filename: '[name].[chunkhash:4].js',
}

const rules = [
  {
    test: /\.(css)$/,
    use: ExtractTextPlugin.extract({
      use: [
        {
          loader: 'css-loader',
          options: {
            modules: true,
            getLocalIdent: APlugin.getClassName,
          },
        },
      ],
    }),
  },
]

const plugins = [
  new APlugin(),
  new ExtractTextPlugin('out.[chunkhash:4].css')
]

module.exports = {
  target: 'node',
  entry,
  output,
  module: {
    rules,
  },
  plugins,
}
