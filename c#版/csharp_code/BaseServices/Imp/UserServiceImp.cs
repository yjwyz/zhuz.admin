using AutoMapper;
using Microsoft.Extensions.Options;
using SqlSugar;
using Zhuz.net.BaseModels.Edit;
using Zhuz.net.BaseModels.User;
using Zhuz.net.SysConstants;
using Zhuz.net.SysHelpers;
using Zhuz.net.SysModels.Result;
using Zhuz.net.ZhuzEntitys;

namespace Zhuz.net.BaseServices;

public class UserServiceImp:IUserService
{
    private readonly ISqlSugarClient _sqlSugarClient;
    private readonly IMapper _mapper;
    private readonly EditOptionsModel _editOptions;
    public UserServiceImp(ISqlSugarClient sqlSugarClient,IMapper mapper,IOptions<EditOptionsModel> editOptions)
    {
        _sqlSugarClient = sqlSugarClient;
        _mapper = mapper;
        _editOptions = editOptions.Value;
    }
    public async Task<AddUserRes> Rigster(AddUserReq req)
    {
        bool isExist = await _sqlSugarClient.Queryable<sys_user>().AnyAsync(it=>it.user_name==req.username);
        if (isExist)
        {
            throw new Exception("该用户已经存在!");
        }

        await _sqlSugarClient.Insertable<sys_user>(new sys_user
        {
            user_name = req.username,
            password = SysCryptoHelper.EncryptPassword(req.password),
            nick_name = "新用户",
            is_admin = false
        }).ExecuteCommandAsync();
        sys_user newUser = await _sqlSugarClient.Queryable<sys_user>().FirstAsync(it => it.user_name == req.username);
        return _mapper.Map<AddUserRes>(newUser);
    }

    public async Task<sys_user> Login(LoginReq req)
    {
        sys_user user = await _sqlSugarClient.Queryable<sys_user>().Where(it => it.user_name == req.username)
            .FirstAsync();
        if (user == null)
        {
            throw new Exception("未查询到用户信息!");
        }

        if (!SysCryptoHelper.VerifyPassword(req.password, user.password))
        {
            throw new Exception("密码不正确!");
        }

        if (user.is_del)
        {
            throw new Exception("该用户已被冻结,请联系管理解冻!");
        }
        return user;
    }

    public async Task<AddUserRes> GetUserInfo(int userId)
    {
        sys_user? user = await _sqlSugarClient.Queryable<sys_user>().FirstAsync(it => it.id == userId);
        if (user == null)
        {
            throw new Exception("未查询到用户信息!");
        }

        return _mapper.Map<AddUserRes>(user);
    }

    public async Task<sys_user> SetUserPass(int userId, SetPassReq req)
    {
        sys_user? user = await _sqlSugarClient.Queryable<sys_user>().FirstAsync(it => it.id == userId);
        if (user == null)
        {
            throw new Exception("未查询到用户信息!");
        }

        bool isCompare = SysCryptoHelper.VerifyPassword(req.oldPass, user.password);
        if (!isCompare)
        {
            throw new Exception("密码错误!");
        }
        user.password = SysCryptoHelper.EncryptPassword(req.newPass);
        int rowNum = await _sqlSugarClient.Updateable<sys_user>(user).UpdateColumns(it => new { it.password })
            .ExecuteCommandAsync();
        if (rowNum <= 0)
        {
            throw new Exception("更新了0条记录!");
        }

        return user;
    }

    public async Task<AddUserRes> SetUserInfo(int userId, SetUserInfoReq req)
    {
        sys_user? user = await _sqlSugarClient.Queryable<sys_user>().FirstAsync(it => it.id == userId);
        if (user == null)
        {
            throw new Exception("未查询到用户信息!");
        }

        user.nick_name = req.nickName;
        user.qq = req.qq;
        user.wechat = req.wechat;
        user.email = req.email;
        user.github = req.github;
        int rowNum = await _sqlSugarClient.Updateable<sys_user>(user).ExecuteCommandAsync();
        if (rowNum <= 0)
        {
            throw new Exception("更新了0条记录!");
        }

        return _mapper.Map<AddUserRes>(user);
    }

    public async Task<string> SetAvatar(int userId, string avatarStr)
    {
        sys_user? user = await _sqlSugarClient.Queryable<sys_user>().FirstAsync(it => it.id == userId);
        if (user == null)
        {
            throw new Exception("未查询到用户信息!");
        }
        user.avatar = avatarStr;
        int rowNum = await _sqlSugarClient.Updateable<sys_user>(user).UpdateColumns(it=>new {it.avatar}).ExecuteCommandAsync();
        if (rowNum <= 0)
        {
            throw new Exception("更新了0条记录!");
        }

        return avatarStr;
    }

    public async Task<List<AddUserRes>> GetAllUsers()
    {
        List<sys_user> users = await _sqlSugarClient.Queryable<sys_user>().ToListAsync();
        return _mapper.Map<List<AddUserRes>>(users);
    }

    public async Task<string> FreezeOrthawUser(int userId, bool isFreeze)
    {
        sys_user? user = await _sqlSugarClient.Queryable<sys_user>().FirstAsync(it => it.id == userId);
        if (user == null)
        {
            throw new Exception("未查询到用户信息!");
        }

        user.is_del = isFreeze;
        int rowNum = await _sqlSugarClient.Updateable<sys_user>(user).UpdateColumns(it=>new {it.is_del}).ExecuteCommandAsync();
        if (rowNum <= 0)
        {
            throw new Exception("更新了0条记录!");
        }
        return user.user_name;
    }

    public async Task<string> UserAddAdmin(int userId)
    {
        sys_user? user = await _sqlSugarClient.Queryable<sys_user>().FirstAsync(it => it.id == userId);
        if (user == null)
        {
            throw new Exception("未查询到用户信息!");
        }
        sys_role? role = await _sqlSugarClient.Queryable<sys_role>()
            .FirstAsync(it => it.role_name == InitDbData.AdminRoleName);
        if (role == null)
        {
            throw new Exception("未查询到角色信息!");
        }

        bool isExists = await _sqlSugarClient.Queryable<sys_role_list>()
            .AnyAsync(it => it.role_id == role.id && it.user_id == user.id);
        if (isExists)
        {
            throw new Exception("此用户已经拥有超管权限,无需添加!");
        }

        await _sqlSugarClient.Insertable<sys_role_list>(new sys_role_list
        {
            role_id = role.id,
            user_id = userId
        }).ExecuteCommandAsync();
        user.is_admin = true;
        await _sqlSugarClient.Updateable<sys_user>(user).UpdateColumns(it => new { it.is_admin }).ExecuteCommandAsync();
        return user.user_name;
    }

    public async Task<string> UserRemoveAdmin(int userId)
    {
        sys_user? user = await _sqlSugarClient.Queryable<sys_user>().FirstAsync(it => it.id == userId);
        if (user == null)
        {
            throw new Exception("未查询到用户信息!");
        }

        if (user.user_name == InitDbData.AdminUserName)
        {
            throw new Exception(SysResultStatusText.DisSkipLevelOperation);
        }
        sys_role? role = await _sqlSugarClient.Queryable<sys_role>()
            .FirstAsync(it => it.role_name == InitDbData.AdminRoleName);
        if (role == null)
        {
            throw new Exception("未查询到角色信息!");
        }

        sys_role_list? rolel = await _sqlSugarClient.Queryable<sys_role_list>()
            .FirstAsync(it => it.role_id == role.id && it.user_id == user.id);
        if (rolel==null)
        {
            throw new Exception("此用户并非超管,无需删除!");
        }

        int rowNum= await _sqlSugarClient.Deleteable<sys_role_list>(rolel).ExecuteCommandAsync();
       
        if (rowNum <= 0)
        {
            throw new Exception("删除了0条记录!");
        }
        user.is_admin = false;
        await _sqlSugarClient.Updateable<sys_user>(user).UpdateColumns(it => new { it.is_admin }).ExecuteCommandAsync();
        return user.user_name;
    }

    public async Task<string> ResetUserPass(int userId)
    {
        sys_user? user = await _sqlSugarClient.Queryable<sys_user>().FirstAsync(it => it.id == userId);
        if (user == null)
        {
            throw new Exception("未查询到用户信息!");
        }

        user.password = SysCryptoHelper.EncryptPassword(_editOptions.InitPass);
        int rowNum = await _sqlSugarClient.Updateable<sys_user>(user).UpdateColumns(it => new { it.password })
            .ExecuteCommandAsync();
        if (rowNum <= 0)
        {
            throw new Exception("更新了0条记录!");
        }

        return _editOptions.InitPass;
    }
}