using Zhuz.net.SysModels.Result;

namespace Zhuz.net.SysHelpers;

public class SysResultHelper<T>
{
    /// <summary>
    /// 成功类型响应结构
    /// </summary>
    /// <param name="data"></param>
    /// <param name="message"></param>
    /// <returns></returns>
    public static SysResultModel<T> Ok(T data,string message="操作成功!")
    {
        return new SysResultModel<T>(SysResultStatus.Success, message, data);
    }
    /// <summary>
    /// 失败类型响应结构
    /// </summary>
    /// <param name="code"></param>
    /// <param name="message"></param>
    /// <returns></returns>
    public static SysResultModel<string> Error(string message="操作失败!",SysResultStatus code=SysResultStatus.Fail)
    {
        return new SysResultModel<string>(code, message);
    }
}