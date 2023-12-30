using Zhuz.net.SysModels.SysJWT;

namespace Zhuz.net.SysServices;

public interface ISysJWTService
{
    /// <summary>
    /// 获取token
    /// </summary>
    /// <param name="tokenStruct"></param>
    /// <returns></returns>
   public string GetToken(SysTokenModel tokenStruct);
}