using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Zhuz.net.BaseModels.Edit;
using Zhuz.net.BaseModels.User;
using Zhuz.net.BaseServices;
using Zhuz.net.SysModels.Redis;
using Zhuz.net.SysServices;
using Zhuz.net.SysHelpers;
using Zhuz.net.SysMiddleware.SysRequirements;
using Zhuz.net.SysModels.Result;
using Zhuz.net.SysModels.SysFile;
using Zhuz.net.SysModels.SysJWT;
using Zhuz.net.ZhuzEntitys;

namespace Zhuz.net.BaseControllers;

#region 公开路由

[ApiController]
[Route("user/release")]
public class UserReleaseController : ControllerBase
{
    private readonly ISysCommonService _sysCommonService;
    private readonly IUserService _userService;
    private readonly ISysJWTService _jwtService;

    public UserReleaseController(ISysCommonService sysCommonService,
        IUserService userService, ISysJWTService jwtService)
    {
        _sysCommonService = sysCommonService;
        _userService = userService;
        _jwtService = jwtService;
    }

    /// <summary>
    /// 登录
    /// </summary>
    /// <param name="req"></param>
    /// <returns></returns>
    [HttpPost("login")]
    public async Task<SysResultModel<string>> Login(LoginReq req)
    {
        await SysValidatorHelper.Check<LoginReq>(new LoginVali(), req);
        await _sysCommonService.VerifyCaptchaHash(req.uuid, req.code);
        sys_user user = await _userService.Login(req);
        string userPassVersion = await _sysCommonService.GetUserPassVersion(user.id);
        string token = _jwtService.GetToken(new SysTokenModel
        {
            Sid = user.id,
            PassVersion = int.Parse(userPassVersion),
        });
        return SysResultHelper<string>.Ok(token, "登录成功!");
    }

    /// <summary>
    /// 注册
    /// </summary>
    /// <param name="req"></param>
    /// <returns></returns>
    [HttpPost("register")]
    public async Task<SysResultModel<AddUserRes>> Register(AddUserReq req)
    {
        await SysValidatorHelper.Check<AddUserReq>(new AddUserVali(), req);
        await _sysCommonService.VerifyCaptchaHash(req.uuid, req.code);
        AddUserRes user = await _userService.Rigster(req);
        return SysResultHelper<AddUserRes>.Ok(user, "注册成功!");
    }

    /// <summary>
    /// 获取验证码
    /// </summary>
    /// <returns></returns>
    [HttpGet("getcaptcha")]
    public async Task<IActionResult> GetCaptcha()
    {
        SysCaptchaModel captcha = _sysCommonService.CreateCaptcha(3);
        string uuid = SysRandomHelper.generateRandomString(15);
        await _sysCommonService.SetCaptchaHash(uuid, captcha.code);
        HttpContext.Response.Headers.Add("X-UUID", uuid);
        return File(captcha.Img, "image/png");
    }
}

#endregion


#region 用户级路由

[ApiController]
[Route("user/auth")]
public class UserAuthController : ControllerBase
{
    private readonly ISysCommonService _sysCommonService;
    private readonly IUserService _userService;
    private readonly ISysJWTService _jwtService;
    private readonly ISysFileService _sysFileService;
    private readonly EditOptionsModel _editOptions;

    public UserAuthController(ISysCommonService sysCommonService,IOptions<EditOptionsModel> editOptions,
        IUserService userService, ISysJWTService jwtService,ISysFileService sysFileService)
    {
        _sysCommonService = sysCommonService;
        _userService = userService;
        _jwtService = jwtService;
        _sysFileService = sysFileService;
        _editOptions = editOptions.Value;
    }
    /// <summary>
    /// 获取用户信息
    /// </summary>
    /// <returns></returns>
    [HttpGet("getuserinfo")]
    [Authorize(Policy = SysPolicyInfo.User)]
    public async Task<SysResultModel<AddUserRes>> GetUserInfo()
    {
        int sid = _sysCommonService.GetTokenSid(HttpContext);
        AddUserRes user = await _userService.GetUserInfo(sid); 
        return SysResultHelper<AddUserRes>.Ok(user);
    }
    
    /// <summary>
    /// 修改当前用户密码
    /// </summary>
    /// <returns></returns>
    [HttpPut("putpassword")]
    [Authorize(Policy = SysPolicyInfo.User)]
    public async Task<SysResultModel<string>> SetPass(SetPassReq req)
    {
        int sid = _sysCommonService.GetTokenSid(HttpContext);
        await SysValidatorHelper.Check<SetPassReq>(new SetPassVali(), req);
        await _userService.SetUserPass(sid, req);
        await _sysCommonService.UpdateUserPassVersion(sid);
        return SysResultHelper<string>.Ok("","修改成功!");
    }
    
    /// <summary>
    /// 修改当前用户信息
    /// </summary>
    /// <param name="req"></param>
    /// <returns></returns>
    [HttpPut("putuserinfo")]
    [Authorize(Policy = SysPolicyInfo.User)]
    public async Task<SysResultModel<AddUserRes>> SetUserInfo(SetUserInfoReq req)
    {
        int sid = _sysCommonService.GetTokenSid(HttpContext);
        await SysValidatorHelper.Check<SetUserInfoReq>(new SetUserInfoVali(), req);
        AddUserRes user = await _userService.SetUserInfo(sid, req);
        return SysResultHelper<AddUserRes>.Ok(user, "修改成功!");
    }

    /// <summary>
    /// 修改头像
    /// </summary>
    /// <returns></returns>
    [HttpPut("putavatar")]
    [Authorize(Policy = SysPolicyInfo.User)]
    public async Task<SysResultModel<string>> SetAvatar()
    {
        int sid = _sysCommonService.GetTokenSid(HttpContext);
        //获取Form提交的文件
        IFormFile? file = Request.Form.Files["avatar"];
        string currentAvatarPath = await _sysFileService.SaveFileDataToTarget(new SysSaveFileDataToTargetModel
        {
            File = file,
            Formats = _editOptions.AvatarFormats.Split(","),
            MaxSize = _editOptions.AvatarMaxSize,
            TargetFinderName = _editOptions.TempFinderName,
        });
        string targetFilePath = _editOptions.AvatarFinderName + "/" + Path.GetFileName(currentAvatarPath);
        await _userService.SetAvatar(sid, targetFilePath);
        SysFileHelper.FileMove(SysFileHelper.GetTargetPwd(currentAvatarPath),SysFileHelper.GetTargetPwd(targetFilePath));
        return SysResultHelper<string>.Ok(targetFilePath);
    }
}

#endregion

#region 超管级路由

[ApiController]
[Route("user/admin")]
public class UserAdminController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly ISysCommonService _sysCommonService;
    public UserAdminController(IUserService userService,ISysCommonService sysCommonService)
    {
        _userService = userService;
        _sysCommonService = sysCommonService;
    }
    /// <summary>
    /// 查看所有的账号信息
    /// </summary>
    /// <returns></returns>
    [HttpGet("readallusers")]
    [Authorize(Policy = SysPolicyInfo.Admin)]
    public async Task<SysResultModel<List<AddUserRes>>> GetAllUsers()
    {
        List<AddUserRes> users = await _userService.GetAllUsers();
        return SysResultHelper<List<AddUserRes>>.Ok(users);
    }
    /// <summary>
    /// 冻结禁用某个账号
    /// </summary>
    /// <param name="userId"></param>
    /// <returns></returns>
    [HttpPut("disuser/{userId}")]
    [Authorize(Policy = SysPolicyInfo.Admin)]
    public async Task<SysResultModel<string>> FreezeUser(int userId)
    {
        bool isAdmin = await _sysCommonService.IsAdmin(userId);
        if (isAdmin)
        {
            throw new Exception(SysResultStatusText.DisSkipLevelOperation);
        }
        string username = await _userService.FreezeOrthawUser(userId, true);
        await _sysCommonService.UpdateUserPassVersion(userId);
        return SysResultHelper<string>.Ok("",$"成功冻结-{username}-账号!");
    }
    /// <summary>
    /// 解冻某个账号
    /// </summary>
    /// <param name="userId"></param>
    /// <returns></returns>
    [HttpPut("enbuser/{userId}")]
    [Authorize(Policy = SysPolicyInfo.Admin)]
    public async Task<SysResultModel<string>> ThawUser(int userId)
    {
        bool isAdmin = await _sysCommonService.IsAdmin(userId);
        if (isAdmin)
        {
            throw new Exception(SysResultStatusText.DisSkipLevelOperation);
        }
        string username = await _userService.FreezeOrthawUser(userId, false);
        await _sysCommonService.UpdateUserPassVersion(userId);
        return SysResultHelper<string>.Ok("",$"{username}-账号已解冻,可继续使用!");
    }
}

#endregion

#region Root级路由

[ApiController]
[Route("user/root")]
public class UserRootController : ControllerBase
{
    private readonly ISysCommonService _sysCommonService;
    private readonly IUserService _userService;
    public UserRootController(ISysCommonService sysCommonService,IUserService userService)
    {
        _sysCommonService = sysCommonService;
        _userService = userService;
    }
    /// <summary>
    /// 添加某账号为超管角色
    /// </summary>
    /// <param name="userId"></param>
    /// <returns></returns>
    [HttpPut("adduseradmin/{userId}")]
    [Authorize(Policy = SysPolicyInfo.Root)]
    public async Task<SysResultModel<string>> AddUserToAdmin(int userId)
    {
        bool isRoot = await _sysCommonService.IsRoot(userId);
        if (isRoot)
        {
            throw new Exception(SysResultStatusText.DisSkipLevelOperation);
        }
        string userName= await _userService.UserAddAdmin(userId);
        await _sysCommonService.UpdateUserPassVersion(userId);
        return SysResultHelper<string>.Ok("",$"添加成功,{userName}现已是超管权限。");
    }
    /// <summary>
    /// 删除某用户的超管角色
    /// </summary>
    /// <param name="userId"></param>
    /// <returns></returns>
    /// <exception cref="Exception"></exception>
    [HttpPut("revokeuseradmin/{userId}")]
    [Authorize(Policy = SysPolicyInfo.Root)]
    public async Task<SysResultModel<string>> RevokeUserAdmin(int userId)
    {
        bool isRoot = await _sysCommonService.IsRoot(userId);
        if (isRoot)
        {
            throw new Exception(SysResultStatusText.DisSkipLevelOperation);
        }
        string username= await _userService.UserRemoveAdmin(userId);
        await _sysCommonService.UpdateUserPassVersion(userId);
        return SysResultHelper<string>.Ok("",$"已删除-{username}-账号的超管权限!");
    }
    /// <summary>
    /// 重置某账号的密码
    /// </summary>
    /// <param name="userId"></param>
    /// <returns></returns>
    [HttpPut("restuserpass/{userId}")]
    [Authorize(Policy = SysPolicyInfo.Root)]
    public async Task<SysResultModel<string>> ResetUserPass(int userId)
    {
        bool isRoot = await _sysCommonService.IsRoot(userId);
        if (isRoot)
        {
            throw new Exception(SysResultStatusText.DisSkipLevelOperation);
        }
        string newPass= await _userService.ResetUserPass(userId);
        await _sysCommonService.UpdateUserPassVersion(userId);
        return SysResultHelper<string>.Ok(newPass,"重置成功!!");
    }
}

#endregion