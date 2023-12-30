using Zhuz.net.SysModels.Redis;
using Zhuz.net.ZhuzEntitys;

namespace Zhuz.net.SysServices;

public interface ISysCommonService
{
    /// <summary>
    /// 创建一个验证码
    /// </summary>
    /// <returns></returns>
    public SysCaptchaModel CreateCaptcha(int len);
    /// <summary>
    /// 存储验证码hash
    /// </summary>
    /// <returns></returns>
    public Task SetCaptchaHash(string key,string value);
    /// <summary>
    /// 验证验证码hash
    /// </summary>
    /// <returns></returns>
    public Task<bool> VerifyCaptchaHash(string uuid,string code);
    /// <summary>
    /// 获取某用户的密码版本
    /// </summary>
    /// <param name="userId"></param>
    /// <returns></returns>
    public Task<string> GetUserPassVersion(int userId);
    /// <summary>
    /// 更新某用户的密码版本
    /// </summary>
    /// <param name="userId"></param>
    /// <returns></returns>
    public Task<string> UpdateUserPassVersion(int userId);
    /// <summary>
    /// 获取token授权成功后的用户id(sid)
    /// </summary>
    /// <returns></returns>
    public int GetTokenSid(HttpContext cx);

    /// <summary>
    /// 查看某用户是否为超管(包含root)
    /// </summary>
    /// <param name="userId"></param>
    /// <param name="user"></param>
    /// <returns></returns>
    public Task<bool> IsAdmin(int userId,sys_user? user=null);
    /// <summary>
    /// 是否为root级账号
    /// </summary>
    /// <param name="userId"></param>
    /// <param name="user"></param>
    /// <returns></returns>
    public Task<bool> IsRoot(int userId, sys_user? user = null);
}