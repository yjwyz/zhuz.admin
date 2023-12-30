namespace Zhuz.net.SysHelpers;

public static class SysFileHelper
{
    /// <summary>
    /// 获取某个静态资源目录路径,空字符串则为wwwroot根路径
    /// </summary>
    /// <param name="finderName"></param>
    /// <returns></returns>
    public static string GetTargetPwd(string finderName)
    {
        return Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", finderName);
    }
    /// <summary>
    /// 移动文件
    /// </summary>
    /// <param name="orignFile">原始路径</param>
    /// <param name="newFile">新路径</param>
    /// <exception cref="ArgumentException"></exception>
    public static void FileMove(string orignFile, string newFile)
    {
        if (string.IsNullOrEmpty(orignFile))
        {
            throw new ArgumentException(orignFile);
        }
        if (string.IsNullOrEmpty(newFile))
        {
            throw new ArgumentException(newFile);
        }
        System.IO.File.Move(orignFile, newFile);
    }
    
    /// <summary>
    /// 创建一个资源目录
    /// </summary>
    public static string CreateStaticFinder(string finderName)
    {
        string targetFinderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", finderName);
        if (!Directory.Exists(targetFinderPath))
        {
            Directory.CreateDirectory(targetFinderPath);
        }

        return targetFinderPath;
    }
}