module.exports = (isDev) => {
  return {
    preserveWhitepace: true, //template模板中去掉空格
    extractCSS: !isDev,//是否把VUE文件中的CSS 用extract单独打包
    cssModules: {
      localIdentName: isDev ? '[path]-[name]-[hash:base64:5]' : '[hash:base64:5]',
      camelCase: true
    },
    // hotReload: false, // 根据环境变量生成
  }
}