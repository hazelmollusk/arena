// const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const webpack = require('webpack')
const path = require('path')

module.exports = {
  name: 'arena',
  mode: 'development', // "production" | "development" | "none"
  target: 'web', // node
  entry: {
    walax: path.resolve(__dirname, 'js/src/app.js')
  },
  output: {
    path: path.resolve(__dirname, 'game/static/arena/'),
    filename: 'app.js',
    library: 'umd'
  },
  // resolve: {
  //     alias: {
  //         'process.env': 'process/browser'
  //     }
  // // },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // include .js files
        // exclude: /node_modules/, // exclu2234de any and all files in the `node_modules folder`
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: [
                // ['@babel/plugin-transform-runtime'],
                ['@babel/plugin-syntax-dynamic-import'],
                ['@babel/plugin-proposal-class-properties', { loose: true }],
                ['@babel/plugin-proposal-object-rest-spread'],
                ['@babel/plugin-proposal-logical-assignment-operators'],
                ['@babel/plugin-proposal-optional-chaining'],
                ['@babel/plugin-proposal-decorators', { legacy: true }],
                [
                  '@babel/plugin-transform-react-jsx',
                  {
                    pragma: 'm',
                    pragmaFrag: "'['"
                  }
                ],
                ['@babel/plugin-proposal-private-methods', { loose: true }],
                [
                  '@babel/plugin-proposal-private-property-in-object',
                  { loose: true }
                ]
              ]
            }
          }
        ]
      }
    ]
  },
  optimization: {
    minimize: false,
    moduleIds: 'named',
    chunkIds: 'named',
    removeAvailableModules: false,
    flagIncludedChunks: true,
    usedExports: true,
    providedExports: true,
    concatenateModules: false,
    sideEffects: false // <----- in prod defaults to true if left blank
  }
}
