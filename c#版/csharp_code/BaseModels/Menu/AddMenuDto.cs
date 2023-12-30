using FluentValidation;

namespace Zhuz.net.BaseModels.Menu;

public class BaseAddMenuReq
{
    public string menu_name { get; init; } // 菜单名称
    public string description { get; init; } // 描述
    public string icon { get; init; } // 图标
    public string uuid { get; init; } // uuid
    public string parent_uuid { get; init; } // 父级uuid
    public int order_num { get; init; } // 排序
    public bool shown { get; init; } // 是否显示
    public bool is_cache { get; init; } // 是否缓存
}

public class MenuRes
{
    public int id { get; init; } 
    public string menu_name { get; init; } // 菜单名称
    public string description { get; init; } // 描述
    public string icon { get; init; } // 图标
    public string uuid { get; init; } // uuid
    public string parent_uuid { get; init; } // 父级uuid
    public int order_num { get; init; } // 排序
    public bool shown { get; init; } // 是否显示
    public bool is_cache { get; init; } // 是否缓存
    public List<MenuRes> children { get; set; }
}

public class BaseAddMenuVali:AbstractValidator<BaseAddMenuReq>
{
    public BaseAddMenuVali()
    {
        RuleFor(v => v.menu_name).NotNull().NotEmpty().WithMessage("菜单名称不能为空!");
        RuleFor(v => v.description).NotNull().NotEmpty().WithMessage("描述不能为空!");
        RuleFor(v => v.icon).NotNull().NotEmpty().WithMessage("图标不能为空!");
        RuleFor(v => v.uuid).NotNull().NotEmpty().WithMessage("uuid不能为空!");
        RuleFor(v => v.order_num).NotNull().NotEmpty().WithMessage("排序不能为空!");
        RuleFor(v => v.shown).NotNull().WithMessage("是否显示不能为空!");
        RuleFor(v => v.is_cache).NotNull().WithMessage("是否缓存不能为空!");
    }
}