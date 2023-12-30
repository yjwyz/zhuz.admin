using System.Collections.Concurrent;
using StackExchange.Redis;
using Zhuz.net.SysHelpers;

namespace Zhuz.net.SysServices.Imp;

public class SysRedisServiceImp : ISysRedisService, IDisposable
{
    //连接字符串
    private readonly string _connectionString;
    //实例名称
    private readonly string _instanceName;
    //默认数据库
    private readonly int _defaultDB;
    // 到期时间后缀
    private string _captchaTimeSuffix { get; } = "_expire";
    private readonly ConcurrentDictionary<string, ConnectionMultiplexer> _connections;

    public SysRedisServiceImp(string connectionString, string instanceName, int defaultDB = 0)
    {
        _connectionString = connectionString;
        _instanceName = instanceName;
        _defaultDB = defaultDB;
        _connections = new ConcurrentDictionary<string, ConnectionMultiplexer>();
    }

    public async Task<int> TestRedis()
    {
        string testField = "test";
        string? v = await GetDatabase().StringGetAsync(testField);
        if (string.IsNullOrEmpty(v))
        {
            await GetDatabase().StringSetAsync(testField, "0");
            v = await GetDatabase().StringGetAsync(testField);
        }
        else
        {
            v = (int.Parse(v) + 1).ToString();
            await GetDatabase().StringSetAsync(testField, v);
            v = await GetDatabase().StringGetAsync(testField);
        }

        return int.Parse(v);
    }

    public IDatabase GetDatabase()
    {
        return GetConnect().GetDatabase(_defaultDB);
    }

    private ConnectionMultiplexer GetConnect()
    {
        return _connections.GetOrAdd(_instanceName, p => ConnectionMultiplexer.Connect(_connectionString));
    }
    /// <summary>
    /// 存储一对hash
    /// </summary>
    public async Task HashSet(string primaryKey, string key, string value, int expirationTime = 0)
    {
       await GetDatabase().HashSetAsync(primaryKey, new HashEntry[]
        {
            new HashEntry(key,value)
        });
        if (expirationTime > 0)
        {
         await GetDatabase().HashSetAsync(primaryKey, new HashEntry[]
            {
                new HashEntry(key+_captchaTimeSuffix,SysTimeHelper.GetNowAfterTime(1))
            });
        }
    }

    public async Task<string> HashGet(string primaryKey, string key)
    {
       string redisValue= await GetDatabase().HashGetAsync(primaryKey,key);
       // 查看是否设置了过期时间,如果过期,需要将其删除并且返回空字符
       string timeReidsValue= await GetDatabase().HashGetAsync(primaryKey,key+_captchaTimeSuffix);
       if (!string.IsNullOrEmpty(timeReidsValue))
       {
           DateTime redisTime = DateTime.Parse(timeReidsValue);
           if (DateTime.Compare(redisTime, DateTime.Now) < 0)
           {
               return "";// 已过期
           }
       }
       return redisValue;
    }


    public void Dispose()
    {
        if (_connections != null && _connections.Count > 0)
        {
            foreach (var item in _connections.Values)
            {
                item.Close();
            }
        }
    }
}