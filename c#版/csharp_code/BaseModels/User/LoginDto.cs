using FluentValidation;

namespace Zhuz.net.BaseModels.User;


public class LoginReq
{
    public string username { get; init; }
    public string password { get; init; }
    public string uuid { get; init; }
    public string code { get; init; }
}

public class LoginVali: AbstractValidator<LoginReq>
{
    public LoginVali()
    {
        RuleFor(item => item.username).NotEmpty().WithMessage("用户名不能为空");
        RuleFor(item => item.password).NotEmpty().WithMessage("密码不能为空");
        RuleFor(item => item.uuid).NotEmpty().WithMessage("UUID不能为空");
        RuleFor(item => item.code).NotEmpty().WithMessage("验证码不能为空");
    }
}