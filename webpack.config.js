/*
* webpack.config.js
*/

const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const WebappWebpackPlugin = require('webapp-webpack-plugin');
require("@babel/register");

const config = {

  // Entry
  entry: './src/index.js',

  // Output
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js',
  },

  // Loaders
  module: {
    rules : [
      // JavaScript/JSX Files
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          { loader: 'babel-loader',
            options: {
              presets: [
                "@babel/preset-env",
                "@babel/preset-react"
              ]
            }
          }
        ]
      },
      // CSS Files
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      // Image Files
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true, // webpack@1.x
              disable: true, // webpack@2.x and newer
            },
          },
        ],
      }
    ]
  },

  resolve: {
    extensions: ['*', '.js', '.jsx']
  },

  // Plugins
  plugins: [
    new htmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      hash: true
    }),
    new WebappWebpackPlugin('./src/images/bitcoinbay.jpeg')
  ],

  // Optionals
  // Reload on File onChange
  watch: true,
  // Development Tools
  devtool: "source-map",
};

module.exports = config;
