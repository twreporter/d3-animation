const path = require('path');

module.exports = {
  entry: {
    'dots-plot': './table1/index.js',
    'opportunity-calculator': './table2/index.js',
  },
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [{
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: function (loader) {
                return [
                  require('autoprefixer')({ browsers: [ 'safari >= 7', 'ie >= 9' ] }),
                  require('postcss-nested')
                ]
              }
            }
          }
        ]
      },
      {
        test: /\.js?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['react', ['env', {
              targets: {
                "browsers": ['safari >= 7', 'ie >= 9']
              }
            }]]
          }
        }
      }
    ]
  },
  resolve: {
    alias: {
      'react': 'preact-compat',
      'react-dom': 'preact-compat'
    }
  }
}