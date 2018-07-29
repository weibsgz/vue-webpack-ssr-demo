const path = require('path');
const HTMLPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
//const ExtractPlugin = require('extract-text-webpack-plugin'); //CSS单独打包
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')

const isDev = process.env.NODE_ENV === 'development';


const defaultPluins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: isDev ? '"development"' : '"production"'
    }
  }),
  new HTMLPlugin({
    template: path.join(__dirname,'template.html')
  })
]

if (isDev) {
    // 开发坏境的配置


    config = merge(baseConfig, {
        //devtool 方便调试的时候映射源代码（因为被压缩过）
        devtool: '#cheap-module-eval-source-map',
        module: {
          rules: [
            {
              test: /\.styl/,
              use: [
                'vue-style-loader', //不用style-loader 可以让改.vue文件中的CSS时候热刷新
                'css-loader',
                {
                  loader: 'postcss-loader',
                  options: {
                    sourceMap: true,
                  }
                },
                'stylus-loader'
              ]
            }
          ]
        },
        devServer:{
              port: 8000,
              host: '0.0.0.0',
              overlay: {
                errors: true,
              },
              hot: true
        },

        plugins: defaultPluins.concat([
          new webpack.HotModuleReplacementPlugin()
        ])
   })

} else {
   
   config = merge(baseConfig, {
    entry: {
      app: path.join(__dirname, '../client/index.js')
      // vendor: ['vue']
    },
    output: {
      filename: '[name].[chunkhash:8].js'
    },
    module: {
      rules: [
        {
          test: /\.styl$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true
              }
            },
            'stylus-loader'
          ]
        }
      ]
    },
    optimization: {
      splitChunks: {
        chunks: 'all'  //分离打包
      },
      runtimeChunk: true
    },
    plugins: defaultPluins.concat([
      //new ExtractPlugin('styles.[contentHash:8].css'),
      new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    })

      // new webpack.optimize.CommonsChunkPlugin({
      //   name: 'vendor'
      // }),
      // new webpack.optimize.CommonsChunkPlugin({
      //   name: 'runtime'
      // })
    ])
  })



    // config.optimization = {
    //     splitChunks: {
    //         cacheGroups: {                  // 这里开始设置缓存的 chunks
    //             commons: {
    //                 chunks: 'initial',      // 必须三选一： "initial" | "all" | "async"(默认就是异步)
    //                 minSize: 0,             // 最小尺寸，默认0,
    //                 minChunks: 2,           // 最小 chunk ，默认1
    //                 maxInitialRequests: 5   // 最大初始化请求书，默认1
    //             },
    //             vendor: {
    //                 test: /node_modules/,   // 正则规则验证，如果符合就提取 chunk
    //                 chunks: 'initial',      // 必须三选一： "initial" | "all" | "async"(默认就是异步)
    //                 name: 'vendor',         // 要缓存的 分隔出来的 chunk 名称
    //                 priority: 10,           // 缓存组优先级
    //                 enforce: true
    //             }
    //         }
    //     },
    //     runtimeChunk: true
    // }


}

module.exports = config;
