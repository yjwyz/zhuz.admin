using System.Security.Cryptography;
using System.Text;

namespace Zhuz.net.SysHelpers;

public static class SysCryptoHelper
{
    /// <summary>
    /// 盐
    /// </summary>
    private static readonly string SALT = "zhuzpassssssss";
    /// <summary>
    /// 生成一个加盐的密码
    /// </summary>
    /// <param name="password"></param>
    /// <returns></returns>
    public static string EncryptPassword(string password)
    {
        var sha256 = SHA256.Create();
        var hashedPassword = sha256.ComputeHash(Encoding.UTF8.GetBytes(password + SALT));
        return Convert.ToBase64String(hashedPassword);
    }
    /// <summary>
    /// 校验密码与加密后的密码是否一致
    /// </summary>
    /// <param name="password"></param>
    /// <param name="encryptedPassword"></param>
    /// <returns></returns>
    public static bool VerifyPassword(string password, string encryptedPassword)
    {
        var sha256 = SHA256.Create();
        var hashedPassword = sha256.ComputeHash(Encoding.UTF8.GetBytes(password + SALT));
        var encryptedPasswordBytes = Convert.FromBase64String(encryptedPassword);
        return hashedPassword.SequenceEqual(encryptedPasswordBytes);
    }
}