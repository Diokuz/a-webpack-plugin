const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const APlugin = require('../index')

const entry = {
  out: path.resolve(__dirname, './entry.js'),
}

const output = {
  path: path.resolve(__dirname, 'build'),
  filename: '[name].[chunkhash:4].js',
}

const rules = [
  {
    test: /\.(css)$/,
    use: [
      MiniCssExtractPlugin.loader,
      {
        loader: 'css-loader',
        options: {
          modules: true,
          getLocalIdent: APlugin.getClassName,
        },
      },
    ],
  },
]

const plugins = [
  // Remove that line, and css will be back
  new APlugin(),

  new MiniCssExtractPlugin(),
]

module.exports = {
  target: 'node',
  mode: 'development',
  entry,
  output,
  module: {
    rules,
  },
  plugins,
}
