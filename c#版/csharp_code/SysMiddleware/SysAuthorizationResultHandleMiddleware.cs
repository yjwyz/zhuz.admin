using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Policy;
using Zhuz.net.SysHelpers;
using Zhuz.net.SysModels.Result;

namespace Zhuz.net.SysMiddleware;

public class SysAuthorizationResultHandleMiddleware:IAuthorizationMiddlewareResultHandler
{
    public async Task HandleAsync(RequestDelegate next, HttpContext context, AuthorizationPolicy policy,
        PolicyAuthorizationResult authorizeResult)
    {

        //这里授权是否成功
        if (!authorizeResult.Succeeded)
        {
            //将状态码定义为200
            context.Response.StatusCode = 200;
            if (!context.User.Identity.IsAuthenticated)
                await context.Response.WriteAsJsonAsync(SysResultHelper<string>.Error(SysResultStatusText.NoAuth,SysResultStatus.NoAuth));
            else
                await context.Response.WriteAsJsonAsync(SysResultHelper<string>.Error(SysResultStatusText.Forbidden,SysResultStatus.Forbidden));
            return;
        }
        //如果授权成功 继续执行后续的中间件 记住一定记得next 否则会管道会短路
        await next(context);
    }
}