const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.[contenthash].js',
    clean: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html', // Your template file
      filename: 'index.html' // Output file
    }),
    
    new CopyWebpackPlugin({
      patterns: [
        { from: './assets', to: 'assets' },
        { from: './css', to: 'css' },
        { from: './js', to: 'js' },
        { from: './img', to: 'img' },       
      ],
    })
        
  ]  
};