using FluentValidation;

namespace Zhuz.net.BaseModels.Role;

public class PutRoleReq
{
    public int role_id { get; init; } 
    public string role_name { get; init; }
}


public class PutRoleVali: AbstractValidator<PutRoleReq>
{
    public PutRoleVali()
    {
        RuleFor(v=>v.role_id).NotNull().NotEmpty().WithMessage("角色id不能为空!");
        RuleFor(item => item.role_name).NotEmpty().WithMessage("角色名称不能为空");
    }
}