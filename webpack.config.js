/**
 * Created by aman on 3/9/2018.
 */
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');


module.exports = {
  entry: {
    server: './src/main.ts',
  },
  output: {
    filename: '[name].js',
    path: path.join(process.cwd(), 'dist')
  },
  resolve: {
    extensions: ['.js', '.json', '.ts', '.jade']
  },
  stats: 'errors-only',
  externals: {},
  target: 'node',
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: 'ts-loader'
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new CopyWebpackPlugin([
      {
        context: 'src',
        from: {
          glob: path.join(process.cwd(), 'src/static/**/*'),
          dot: true
        },
        to: ''
      }
    ], {
      ignore: [],
      debug: 'warning'
    }),
    new UglifyJSPlugin(),
    new ProgressPlugin()
  ],
  node: false
};
