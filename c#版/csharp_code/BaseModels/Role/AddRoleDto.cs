using FluentValidation;

namespace Zhuz.net.BaseModels.Role;

public class AddRoleReq
{
    public string role_name { get; init; }
}


public class AddRoleVali: AbstractValidator<AddRoleReq>
{
    public AddRoleVali()
    {
        RuleFor(item => item.role_name).NotEmpty().WithMessage("角色名称不能为空");
    }
}