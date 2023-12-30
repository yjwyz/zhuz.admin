
using Zhuz.net.BaseModels.User;
using Zhuz.net.ZhuzEntitys;

namespace Zhuz.net.BaseServices;

public interface IUserService
{
    /// <summary>
    /// 注册
    /// </summary>
    /// <returns></returns>
    public Task<AddUserRes> Rigster(AddUserReq req);
    /// <summary>
    /// 登录
    /// </summary>
    /// <param name="req"></param>
    /// <returns></returns>
    public Task<sys_user> Login(LoginReq req);
    /// <summary>
    /// 获取某用户信息
    /// </summary>
    /// <returns></returns>
    public Task<AddUserRes> GetUserInfo(int userId);
    /// <summary>
    /// 修改某用户密码
    /// </summary>
    /// <param name="userId"></param>
    /// <param name="newpass"></param>
    /// <returns></returns>
    public Task<sys_user> SetUserPass(int userId, SetPassReq req);
    /// <summary>
    /// 修改当前用户信息
    /// </summary>
    /// <param name="userId"></param>
    /// <param name="req"></param>
    /// <returns></returns>
    public Task<AddUserRes> SetUserInfo(int userId, SetUserInfoReq req);
    /// <summary>
    /// 修改某用户头像
    /// </summary>
    /// <param name="userId"></param>
    /// <param name="avatarStr"></param>
    /// <returns></returns>
    public Task<string> SetAvatar(int userId, string avatarStr);
    /// <summary>
    /// 获取所有的账号信息
    /// </summary>
    /// <returns></returns>
    public Task<List<AddUserRes>> GetAllUsers();
    /// <summary>
    /// 冻结或者解冻某个账号
    /// </summary>
    /// <param name="userId"></param>
    /// <param name="isFreeze"></param>
    /// <returns></returns>
    public Task<string> FreezeOrthawUser(int userId, bool isFreeze);
    /// <summary>
    /// 为某用户添加超管权限
    /// </summary>
    /// <param name="userId"></param>
    /// <returns></returns>
    public Task<string> UserAddAdmin(int userId);
    /// <summary>
    /// 删除某用户的超管角色
    /// </summary>
    /// <param name="userId"></param>
    /// <returns></returns>
    public Task<string> UserRemoveAdmin(int userId);
    /// <summary>
    /// 重置某账号密码
    /// </summary>
    /// <param name="userId"></param>
    /// <returns></returns>
    public Task<string> ResetUserPass(int userId);
}