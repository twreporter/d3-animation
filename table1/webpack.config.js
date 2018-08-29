const path = require('path');

module.exports = {
  entry: "./index.js",
  mode: 'production',
  output: {
    path: __dirname,
    filename: "app.bundle.js"
  },
  module: {
    rules: [

      {
        test: /\.css$/,
        use: [{
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          }
        ]
      },
      {
        test: /\.js?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['react',["env", {
              "targets": {
                "browsers": ["safari >= 7 ", "ie >= 9"]
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