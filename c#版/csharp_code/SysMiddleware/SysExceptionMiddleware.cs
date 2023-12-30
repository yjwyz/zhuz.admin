using MySqlConnector;
using Zhuz.net.SysHelpers;
using Zhuz.net.SysModels.Result;

namespace Zhuz.net.SysMiddleware;

public class SysExceptionMiddleware
{
       private readonly RequestDelegate _next;  // 用来处理上下文请求

        public SysExceptionMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        /// <summary>
        /// 执行中间件
        /// </summary>
        /// <param name="httpContext"></param>
        /// <returns></returns>
        public async Task InvokeAsync(HttpContext httpContext)
        {
            try
            {
                await _next(httpContext); //要么在中间件中处理，要么被传递到下一个中间件中去
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(httpContext, ex); // 捕获异常了 在HandleExceptionAsync中处理
            }
        }

        /// <summary>
        /// 异步处理异常
        /// </summary>
        /// <param name="context"></param>
        /// <param name="exception"></param>
        /// <returns></returns>
        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";  // 返回json 类型

            string errMsg = exception.Message;
            
            switch (exception)
            {
                case MySqlException ex:
                    string content = errMsg.Split("for")[0];
                    errMsg = content.Replace("Duplicate entry", "重复内容");
                    break;
                default:
                    break;
            }
     
            SysResultModel<string> result = SysResultHelper<string>.Error(errMsg);
            string jsonStrResult = SysJsonHelper.StringifyToCamelCase(result);
            await context.Response.WriteAsync(jsonStrResult);
        }
}