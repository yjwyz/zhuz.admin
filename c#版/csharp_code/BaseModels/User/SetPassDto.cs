using FluentValidation;

namespace Zhuz.net.BaseModels.User;


public class SetPassReq{
    public string oldPass { get; init; }
    public string newPass { get; init; }
    public string confirmPass { get; init; }
}


public class SetPassVali : AbstractValidator<SetPassReq>
{
    public SetPassVali()
    {
        RuleFor(item => item.oldPass).NotEmpty().WithMessage("旧密码不能为空!");
        RuleFor(item => item.newPass).NotEmpty().WithMessage("新密码不能为空!");
        RuleFor(item => item.confirmPass).NotEmpty().Equal(x=>x.newPass).WithMessage("2次密码不一致");
    }
}