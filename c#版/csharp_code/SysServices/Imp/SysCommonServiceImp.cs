using SqlSugar;
using Zhuz.net.SysConstants;
using Zhuz.net.SysModels.Redis;
using Zhuz.net.SysHelpers;
using Zhuz.net.SysModels.Result;
using Zhuz.net.SysModels.SysJWT;
using Zhuz.net.ZhuzEntitys;

namespace Zhuz.net.SysServices.Imp;

public class SysCommonServiceImp : ISysCommonService
{
    private readonly ISysRedisService _sysRedisService;
    private readonly ISqlSugarClient _sqlSugarClient;
    public SysCommonServiceImp(ISysRedisService sysRedisService,ISqlSugarClient sqlSugarClient)
    {
        _sysRedisService = sysRedisService;
        _sqlSugarClient = sqlSugarClient;
    }
    public SysCaptchaModel CreateCaptcha(int len)
    {
        char[] strChar =
        {
            'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
            'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3',
            '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K',
            'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
        };
        string charCode = string.Empty;
        Random random = new Random();
        for (int i = 0; i < len; i++)
        {
            charCode += strChar[random.Next(strChar.Length)];
        }

        SysImageCaptchaHelper iCode = new SysImageCaptchaHelper(120, 40);
        iCode.Clear();
        iCode.WriteText(charCode);
        iCode.Confuse(1);
        return new SysCaptchaModel()
        {
            Img = iCode.GetImg(),
            code = charCode
        };
    }
    
    public async Task SetCaptchaHash(string key, string value)
    {
        await _sysRedisService.HashSet(RedisLocalKey.CaptchaHashKey, key, value, 1);
    }

    public async Task<bool> VerifyCaptchaHash(string uuid,string code)
    {
        string uuidValue=await _sysRedisService.HashGet(RedisLocalKey.CaptchaHashKey, uuid);
        if (string.IsNullOrEmpty(uuidValue))
        {
            throw new Exception("验证码已失效!");
        }
        if (!String.Equals(uuidValue, code, StringComparison.OrdinalIgnoreCase))
        {
            throw new Exception("验证码错误!");
        }
        return false;
    }

    public async Task<string> GetUserPassVersion(int userId)
    {
        string currentVersion = await _sysRedisService.HashGet(RedisLocalKey.UserPassVerssionKey, userId.ToString());
        if (string.IsNullOrEmpty(currentVersion))
        {
            int initVersion = 1;
            await _sysRedisService.HashSet(RedisLocalKey.UserPassVerssionKey, userId.ToString(),
                initVersion.ToString());
            return initVersion.ToString();
        }

        return currentVersion;
    }

    public async Task<string> UpdateUserPassVersion(int userId)
    {
        string currentVersion =await GetUserPassVersion(userId);
        int newVersion = int.Parse(currentVersion) + 1;
        await _sysRedisService.HashSet(RedisLocalKey.UserPassVerssionKey, userId.ToString(), newVersion.ToString());
        string putAfter=await GetUserPassVersion(userId);
        return putAfter;
    }

    public int GetTokenSid(HttpContext cx)
    {
        string? sid = cx.User.Claims.FirstOrDefault(it => it.Type == SysTokenModel.SidFieldName)?.Value;
        if (string.IsNullOrEmpty(sid))
        {
            throw new Exception(SysResultStatusText.Forbidden);
        }

        return int.Parse(sid);
    }

    public async Task<bool> IsAdmin(int userId,sys_user? user=null)
    {
        sys_user? userR;
        if (user != null)
        {
            userR = user;
        }
        else
        {
            userR= await _sqlSugarClient.Queryable<sys_user>().FirstAsync(it => it.id == userId);
            if (userR == null)
            {
                throw new Exception("未查询到此用户!");
            }
        }

        if (userR.user_name == InitDbData.RootUserName)
        {
            return true;
        }

        sys_role? role = await _sqlSugarClient.Queryable<sys_role>()
            .FirstAsync(it => it.role_name == InitDbData.AdminRoleName);
        if (role == null)
        {
            throw new Exception("未查询到角色信息!");
        }

        bool isExists = await _sqlSugarClient.Queryable<sys_role_list>()
            .AnyAsync(it => it.role_id == role.id && it.user_id == userR.id);
        return isExists;
    }

    public async Task<bool> IsRoot(int userId, sys_user? user = null)
    {
        sys_user? userR;
        if (user != null)
        {
            userR = user;
        }
        else
        {
            userR= await _sqlSugarClient.Queryable<sys_user>().FirstAsync(it => it.id == userId);
            if (userR == null)
            {
                throw new Exception("未查询到此用户!");
            }
        }

        if (userR.user_name == InitDbData.RootUserName)
        {
            return true;
        }

        return false;
    }
}