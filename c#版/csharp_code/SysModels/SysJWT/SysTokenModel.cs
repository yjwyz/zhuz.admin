namespace Zhuz.net.SysModels.SysJWT;

public class SysTokenModel
{
    /// <summary>
    /// 用户id
    /// </summary>
    public int Sid { get; init; }
    /// <summary>
    /// 密码版本
    /// </summary>
    public int PassVersion { get; init; }
    /// <summary>
    /// token中存储用户id的属性名
    /// </summary>
    /// <returns></returns>
    public static string SidFieldName { get; } = "Sid";

    /// <summary>
    /// token中存储密码版本的属性名
    /// </summary>
    /// <returns></returns>
    public static string PassVersionFieldName { get; } = "PassVersion";
}