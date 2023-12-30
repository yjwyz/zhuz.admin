using FluentValidation;

namespace Zhuz.net.BaseModels.User;

public class SetUserInfoReq
{
    public string nickName { get; init; }
    public string? qq { get; init; }
    public string? wechat { get; init; }
    public string? email { get; init; }
    public string? github { get; init; }
}


public class SetUserInfoVali:AbstractValidator<SetUserInfoReq>
{
    public SetUserInfoVali()
    {
        RuleFor(item=>item.nickName).NotEmpty().WithMessage("网名不能为空!");
    }
}