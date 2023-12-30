import type { Context } from 'koa';

// 响应中间件需要放在路由注册完的后面
const response_middleware = (ctx: Context) => {
  // console.log(ctx.headers);
};

export default response_middleware;
