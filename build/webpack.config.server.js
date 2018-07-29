const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')
//vue-server-renderer这个插件让你打包输出不是JS文件 而是JSON，做服务端渲染工作
const VueServerPlugin = require('vue-server-renderer/server-plugin')

const isDev = process.env.NODE_ENV === 'development';


let config = merge(baseConfig, {
         target: 'node',
         entry: path.join(__dirname, '../client/server-entry.js'),
         devtool: 'source-map', //提供代码调试指引到出错文件
         output: {
            libraryTarget: 'commonjs2',//入口起点的返回值将分配给 module.exports 对象。这个名称也意味着模块用于 CommonJS 环境：
            filename: 'server-entry.js',
            path: path.join(__dirname, '../server-build')
          },
          externals: Object.keys(require('../package.json').dependencies), //排除['VUE','VUE-ROUTER'.....] 以免造成重复（和 node_modules）
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

        plugins: [
          new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
          }),
          new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),//JSON.stringfy只是为了加双引号
            'process.env.VUE_ENV': '"server"' //官方推荐
          }),
          new VueServerPlugin() //打包输出
        ]
   })

}

module.exports = config;
