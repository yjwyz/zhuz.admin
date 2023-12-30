using System.ComponentModel;

namespace Zhuz.net.SysModels.Result;

public enum SysResultStatus
{
    Fail = 1406,
    Success = 1200,
    NoAuth = 1401,
    Forbidden = 1403,
    BadFail = 1400,
    NotFound = 1404
}

public static class SysResultStatusText
{
    public static string Fail { get; } = "操作失败,服务器无法根据客户端请求的内容特性完成请求!";
    public static string Success { get; } = "请求成功!";
    public static string NoAuth { get; } = "身份验证失败。";
    public static string Forbidden { get; } = "拒绝访问，权限不足。";
    public static string BadFail { get; } = "请求无效，服务器无法理解。";
    public static string NotFound { get; } = "访问了一个不存在的类型或者路径。";
    public static string DisSkipLevelOperation { get; } = "禁止越级操作。";
}

public class SysResultModel<T>
{
    public SysResultStatus Code { get; }
    public string? Message { get; }
    public T? Data { get; }

    public SysResultModel(SysResultStatus code, string message)
    {
        Code = code;
        Message = message;
    }

    public SysResultModel(SysResultStatus code, string message, T data)
    {
        Code = code;
        Message = message;
        Data = data;
    }
}