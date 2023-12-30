using System.Text.Json;

namespace Zhuz.net.SysHelpers;

public class CamelCaseNamingPolicy : JsonNamingPolicy
{
    public override string ConvertName(string name) =>
        char.ToLower(name[0]) + name.Substring(1);
}

public class SysJsonHelper
{
    private static JsonSerializerOptions GetCamelCaseSerializerOptions()
    {
        var options = new JsonSerializerOptions
        {
            PropertyNamingPolicy = new CamelCaseNamingPolicy(),
        };
        return options;
    }
    /// <summary>
    /// 将对象序列化成字符串,并配置策略为驼峰命名
    /// </summary>
    /// <param name="obj"></param>
    /// <returns></returns>
    public static string StringifyToCamelCase(object obj)
    {
        var options = GetCamelCaseSerializerOptions();
        return JsonSerializer.Serialize(obj, options);
    }
}