namespace Zhuz.net.SysConstants;

public static class RedisLocalKey
{
    /// <summary>
    /// 验证码hash存储键名
    /// </summary>
    public static string CaptchaHashKey { get; } = "USERCAPTCHA";
    /// <summary>
    /// 用户密码版本存储键名
    /// </summary>
    public static string UserPassVerssionKey { get; } = "PASSVERSION";
}