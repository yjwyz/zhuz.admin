using FluentValidation;


namespace Zhuz.net.BaseModels.User;

public class AddUserReq
{
    public string username { get; init; }
    public string password { get; init; }
    public string uuid { get; init; }
    public string repeat_password { get; init; }
    public string code { get; init; }
}


public class AddUserRes
{
    public string user_name { get; init; }
    public string nick_name { get; init; }
    public int id { get; init; }
    public string avatar { get; init; }
    public string qq { get; init; }
    public string wechat { get; init; }
    public string email { get; init; }
    public string github { get; init; }
    public bool is_del { get; init; }
    public bool is_admin { get; init; }
    public DateTime created_at { get; init; }
    public DateTime updated_at { get; init; }
}


public class AddUserVali: AbstractValidator<AddUserReq>
{
    public AddUserVali()
    {
        RuleFor(item => item.username).NotEmpty().WithMessage("用户名不能为空");
        RuleFor(item => item.password).NotEmpty().WithMessage("密码不能为空");
        RuleFor(item => item.repeat_password).NotEmpty().Equal(x=>x.password).WithMessage("2次密码不一致");
        RuleFor(item => item.uuid).NotEmpty().WithMessage("UUID不能为空");
        RuleFor(item => item.code).NotEmpty().WithMessage("验证码不能为空");
    }
}