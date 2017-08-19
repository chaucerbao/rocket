const path = require('path')

const config = {
  entry: path.resolve('public', 'components', 'rocket.ts'),
  output: {
    filename: 'rocket.js',
    path: path.resolve('public', 'components')
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: 'ts-loader',
          options: {
            compilerOptions: {
              outDir: '',
              declaration: false
            }
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader', options: { sourceMap: true } }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js', '.json']
  },
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    publicPath: '/components/',
    contentBase: path.resolve('public')
  }
}

module.exports = config
