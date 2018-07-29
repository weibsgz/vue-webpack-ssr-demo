//处理开发时的服务端渲染

const Router = require('koa-router');
const axios = require('axios');
const MemoryFS = require('memory-fs')
const webpack = require('webpack')
const VueServerRenderer = require('vue-server-renderer')
const serverConfig = require('../../build/webpack.config.server')
//EJS 模板使用
const fs = require('fs')


//首先要在NODE里跑起来webpack的配置
const serverCompiler = webpack(serverConfig)

//将文件存入内存中读写比较快
const mfs = new MemoryFS()
//指定在NODE跑webpack生成的bundle的输出目录
serverCompiler.outputFileSystem = mfs

//记录webpack每次打包生成的新的文件
let bundle
//watch每次修改重新打包
serverCompiler.watch({}, (err, stats) => {
  if (err) throw err
    //如果有一些代码错误
  stats = stats.toJson()
  stats.errors.forEach(err => console.log(err))
  stats.warnings.forEach(warn => console.warn(err))
  //输出路径 拼接  输出的是JSON文件 因为在webpack.config.server.js中指定了使用vue-server-renderer
  const bundlePath = path.join(
    serverConfig.output.path,
    'vue-ssr-server-bundle.json'
  )
  //指定编码 否则是二进制 这样读出来是字符串 再转为JSON
  //这样 每次修改重新打包 我们就拿到了新的打包出来的bundle这个JSON文件
  bundle = JSON.parse(mfs.readFileSync(bundlePath, 'utf-8'))
  console.log('new bundle generated')
})


//帮我们处理服务端渲染返回的东西
const handleSSR = async (ctx) => {
  //如果服务刚起刚打包  有可能不存在
  if (!bundle) {
    ctx.body = '你等一会，别着急......'
    return
  }
 //awit最主要的意图是用来等待 Promise 对象的状态被 resolved
 //目的是我们有2个进程 一个是 dev-server  一个是 KOA的服务 
 //我们在 webpack.config.client.js中通过VueClientPlugin 生成下面的JSON文件
 //通过AXIOS拿到这个文件  渲染EJS模板
  const clientManifestResp = await axios.get(
    'http://127.0.0.1:8000/public/vue-ssr-client-manifest.json'
  )
  const clientManifest = clientManifestResp.data

   //开始服务端渲染的过程，，只是HTML中body的内容，需要生成完整的HTML
  //利用EJS模板 
 //读取模板内容 ejs模板
  const template = fs.readFileSync(
    path.join(__dirname, '../server.template.ejs'),
    'utf-8'
  )
  //形成带有JS标签的字符串插入到EJS中
  const renderer = VueServerRenderer
    .createBundleRenderer(bundle, {
      inject: false,
      clientManifest
    })

  await serverRender(ctx, renderer, template)
}