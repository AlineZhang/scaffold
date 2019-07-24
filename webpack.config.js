const webpack =  require('webpack');
const nodeExternal = require('webpack-node-externals');
const path = require('path');


module.exports = {
  mode: 'production',
  entry: './src/server.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'server.js',
    publicPath: '/',
  },
  target: 'node',
  externals: nodeExternal(),
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader'
      }
    ]
  }
};

