namespace Zhuz.net.SysModels.SysJWT;

public class SysJwtOptionModel
{
    /// <summary>
    /// 受众
    /// </summary>
    public string Audience { get; set; }
    /// <summary>
    /// 密钥字符串
    /// </summary>
    public string SecurityKey { get; set; }
    /// <summary>
    /// 颁发者
    /// </summary>
    public string Issuer { get; set; }
    /// <summary>
    /// 有效时间  单位.小时
    /// </summary>
    public int EffectiveTime { get; set; }
}