namespace Zhuz.net.SysHelpers;

public static class SysTimeHelper
{
    /// <summary>
    /// 获取当前时间
    /// </summary>
    /// <param name="format"></param>
    /// <returns></returns>
    public static string GetNowDateTime(string format = "yyyy-MM-dd HH:mm:ss")
    {
        DateTime now = DateTime.Now;
        string dateTimeString = now.ToString(format);
        return dateTimeString;
    }

    /// <summary>
    /// 获取n分钟后的时间
    /// </summary>
    /// <param name="minutesLater"></param>
    /// <param name="format"></param>
    /// <returns></returns>
    public static string GetNowAfterTime(int minutesLater,string format = "yyyy-MM-dd HH:mm:ss")
    {
        DateTime datetime_ = DateTime.Now.AddMinutes(minutesLater);
        return datetime_.ToString(format);
    }
    /// <summary>
    /// 获取当前时间时间戳
    /// </summary>
    /// <returns></returns>
    public static string GetNowTimestamp()
    {
        return DateTimeOffset.Now.ToUnixTimeSeconds().ToString(); 
    }
}