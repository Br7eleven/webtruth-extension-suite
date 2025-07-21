const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    popup: './src/popup/index.jsx',
    background: './src/background/index.js',
    content_script: './src/content_script/index.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'public/manifest.json', to: '.' },
        { from: 'public/popup.html', to: '.' },
        { from: 'public/icons', to: 'icons' }
      ]
    })
  ]
};
