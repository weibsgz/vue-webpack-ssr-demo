const Koa = require('koa');

const app = new Koa();

const isDev = process.env.NODE_ENV === 'development'

//Koa 提供一个 Context 对象，表示一次对话的上下文（包括 HTTP 请求和 HTTP 回复）。通过加工这个对象，就可以控制返回给用户的内容。
app.use(async (cxt,next)=>{
    try {
        console.log('request with pah ${ctx.path}')
        await next()
    }catch(err){
        console.log(err)
        ctx.status = 500
        if(isDev) {
            ctx.body = err.message //直接输出到页面
        }
        else {
            ctx.body = 'please try again later'
        }
    }
})


