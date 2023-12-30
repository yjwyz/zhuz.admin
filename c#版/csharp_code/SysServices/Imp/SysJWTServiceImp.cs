using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Zhuz.net.SysModels.SysJWT;

namespace Zhuz.net.SysServices.Imp;

public class SysJWTServiceImp:ISysJWTService
{
    private readonly SysJwtOptionModel _jwtOption;
    public SysJWTServiceImp(IOptions<SysJwtOptionModel> jwtOption)
    {
        _jwtOption = jwtOption.Value;
    }
    /// <summary>
    /// 生成token
    /// </summary>
    /// <param name="tokenStruct"></param>
    /// <returns></returns>
    public string GetToken(SysTokenModel tokenStruct)
    {
        // 有效载荷,爱写多少写多少
        var claims = new[]
        {
            new Claim(SysTokenModel.SidFieldName, tokenStruct.Sid.ToString()),
            new Claim(SysTokenModel.PassVersionFieldName, tokenStruct.PassVersion.ToString()),
        };
        // 创建了一个对称密钥对象
        SymmetricSecurityKey key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtOption.SecurityKey));
        // 用对称密钥创建一个签名凭证
        SigningCredentials creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        DateTime now = DateTime.Now; // 获取当前的UTC时间

        TimeSpan tokenValidity = TimeSpan.FromHours(_jwtOption.EffectiveTime); // 设置JWT令牌的有效时间，这里是1小时
        
        JwtSecurityToken token = new JwtSecurityToken(
            issuer: _jwtOption.Issuer,// 颁发者 如: vgoapp
            audience: _jwtOption.Audience,// 受众 如: people
            claims: claims,// 令牌信息
            expires: now.Add(tokenValidity), // 1小时
            signingCredentials: creds // 签名凭证
        );
        // 将JwtSecurityToken 对象转换为字符串
        string returnToken = new JwtSecurityTokenHandler().WriteToken(token);
        return returnToken;
    }
}