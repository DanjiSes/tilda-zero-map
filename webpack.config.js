const path = require('path');
const fs = require('fs')

/**
 * Plugins
 */

const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CreateHashFileWebpack = require('create-hash-file-webpack');

/**
 * Config
 */

const isProd = process.env.NODE_ENV === 'production';
const isDev = !isProd;

const filename = (ext) => (isDev ? `[name].${ext}` : `[name].[hash].${ext}`);

const jsLoaders = () => {
  const loaders = [
    {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env'],
      },
    },
  ];

  if (isDev) {
    loaders.push('eslint-loader');
  }

  return loaders;
};

module.exports = {
  // Common

  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: {
    bundle: ['./index.js'],
  },
  devtool: isDev && 'source-map',
  output: {
    filename: filename('js'),
    path: path.join(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@styles': path.resolve(__dirname, 'src/styles'),
    },
  },

  // Plugins

  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: filename('css'),
    }),
    new CreateHashFileWebpack([
      {
        // path to folder in which the file will be created
        path: './dist',
        // file name
        fileName: 'install.js',
        // content of the file
        content: fs.readFileSync('./src/install.js').toString(),
      },
    ]),
  ],

  // Loaders

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: jsLoaders(),
      },
    ],
  },

  // Dev Server

  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: 3000,
    open: false,
    disableHostCheck: true,
    hot: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
};
