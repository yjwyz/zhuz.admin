namespace Zhuz.net.SysHelpers;

public static class SysRandomHelper
{
    /// <summary>
    /// 随机生成一串字符串
    /// </summary>
    /// <param name="len"></param>
    /// <returns></returns>
    public static string generateRandomString(int len)
    {
        const string characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        Random random = new Random();
        char[] result = new char[len];

        for (int i = 0; i < len; i++)
        {
            result[i] = characters[random.Next(characters.Length)];
        }
        return new string(result);
    }
}