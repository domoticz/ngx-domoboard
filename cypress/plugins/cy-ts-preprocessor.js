const wp = require('@cypress/webpack-preprocessor')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

const webpackOptions = {
  resolve: {
    extensions: ['.ts', '.js'],
    plugins: [new TsconfigPathsPlugin({ configFile: "cypress/tsconfig.cypress.json" })]
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loaders: ['ts-loader', 'angular2-template-loader'],
        exclude: [/node_modules/],
      },
      {
        test: /\.(html|css|scss)$/,
        loader: 'raw-loader',
        exclude: /\.async\.(html|css)$/
      },
      {
        test: /\.async\.(html|css)$/,
        loaders: ['file?name=[name].[hash].[ext]', 'extract']
      }
    ]
  }
}

const options = {
  webpackOptions
}

module.exports = wp(options)
