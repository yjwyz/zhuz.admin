using FluentValidation;

namespace Zhuz.net.BaseModels.MenuList;

public class PutMenuListReq
{
    public int role_id { get; init; }
    public List<int> menus_id { get; init; }
}


public class PutMenuListVali:AbstractValidator<PutMenuListReq>
{
    public PutMenuListVali()
    {
        RuleFor(v => v.role_id).NotNull().NotEmpty().WithMessage("角色id不能为空!");
        RuleFor(v => v.menus_id).NotNull().NotEmpty().WithMessage("菜单id不能为空,且应为数组,元素为数组!");
    }
}