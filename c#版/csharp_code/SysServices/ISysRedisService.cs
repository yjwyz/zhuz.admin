using StackExchange.Redis;

namespace Zhuz.net.SysServices;

public interface ISysRedisService
{
    /// <summary>
    /// 获取redis数据库实例
    /// </summary>
    /// <returns></returns>
    public IDatabase GetDatabase();
    /// <summary>
    /// 测试redis链接
    /// </summary>
    /// <returns></returns>
    public Task<int> TestRedis();
    /// <summary>
    /// 存储一对hash
    /// </summary>
    /// <param name="primaryKey"></param>
    /// <param name="key"></param>
    /// <param name="value"></param>
    /// <param name="expirationTime">过期时间,默认不设置过期时间</param>
    public Task HashSet(string primaryKey, string key, string value, int expirationTime = 0);
    /// <summary>
    /// 获取一对hash
    /// </summary>
    /// <param name="primaryKey"></param>
    /// <param name="key"></param>
    /// <returns></returns>
    public Task<string> HashGet(string primaryKey, string key);
}