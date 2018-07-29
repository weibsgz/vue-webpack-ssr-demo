const path = require('path');
const createVueLoaderOptions = require('./vue-loader.config')

const isDev = process.env.NODE_ENV === 'development';
//__dirname:当前文件所在的目录 这里就是根目录
//path.join 生成绝对地址  
//用corss-env区分生产和开发环境  因为公用一份webpack.config.js 先安装cross-env
//然后在package.json里设置环境变量 
//"build": "cross-env NODE_ENV=production webpack --config webpack.config.js",
//"dev":"cross-env NODE_ENV=development webpack-dev-server --config webpack.config.js"

//我们在package.json里写在script里环境变量都存在 process.env下 可随便设置
const config = {
    target: 'web', //webpack可以为js的各种不同的宿主环境提供编译功能
    mode: process.env.NODE_ENV || 'production', //production || development  可针对不同环境自动优化
    entry: path.join(__dirname, '../client/index.js'),   // 输入：项目主文件（入口文件）
    output: {       // 输出
        filename: 'bundle.[hash:8].js',  // 输出的文件名
        path: path.join(__dirname, '../dist')  // 输出路径
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            //如果不指定使用vue.esm.js 那么在client/index.html中的 new VUE实例中不能写template模板语法
          'vue' : path.join(__dirname,'../node_modules/vue/dist/vue.esm.js')
        }
      },
    module: {       // 配置加载资源
        rules: [    // 规则
            {
                test: /\.vue$/,
                loader: 'vue-loader',
               //options: createVueLoaderOptions(isDev)
            },
            {
                test: /\.jsx$/,
                loader: 'babel-loader'
            },
            {
                test: /\.(gif|jpg|jpeg|png|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 1024,  // 文件小于1024字节，转换成base64编码，写入文件里面
                            name: 'resources/[path][name].[hash:8].[ext]'
                        }
                    }
                ]
            }
        ]
    },

    // webpack插件配置
    // plugins: [
    // //DefinePlugin 是判断生产/开发环境的
    //     new webpack.DefinePlugin({
    //         'process.env': {
    //             NODE_ENV: isDev ? '"development"' : '"production"'
    //         }
    //     }),
    //     new HTMLPlugin()
    // ]
};







module.exports = config;
