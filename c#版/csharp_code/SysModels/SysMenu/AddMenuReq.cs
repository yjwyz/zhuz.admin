namespace Zhuz.net.SysModels.Menu;

public class AddMenuReq
{
    public string MenuName { get; init; } = null!;// 菜单名称
    public string Description { get; init; } = null!;// 描述
    public string Icon {  get; init; } = null!;// 图标
    public string UUID { get; init; } = null!;// uuid
    public string ParentUUID { get; init; } = null!;// 父级uuid
    public int OrderNum { get; init; }// 排序
    public bool Shown {  get; init; }// 是否显示
    public bool IsCache {  get; init; }// 是否缓存
}