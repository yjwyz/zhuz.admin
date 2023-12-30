using SqlSugar;
namespace Zhuz.net.ZhuzEntitys
{
    ///<summary>
    ///菜单表
    ///</summary>
    [SugarIndex("unique_sys_menu_menu_name",nameof(sys_menu.menu_name),OrderByType.Desc,true)]
    [SugarIndex("unique_sys_menu_uuid",nameof(sys_menu.uuid),OrderByType.Desc,true)]
    public partial class sys_menu
    {
           public sys_menu(){


           }
           /// <summary>
           /// Desc:
           /// Default:
           /// Nullable:False
           /// </summary>           
           [SugarColumn(IsPrimaryKey=true, IsIdentity=true, ColumnName="id", ColumnDataType="int", Length=11)]
           public int id {get;set;}

           /// <summary>
           /// Desc:菜单名称
           /// Default:
           /// Nullable:False
           /// </summary>           
           [SugarColumn(ColumnName="menu_name", ColumnDataType="varchar", Length=191, ColumnDescription="菜单名称")]
           public string menu_name {get;set;}

           /// <summary>
           /// Desc:菜单描述
           /// Default:
           /// Nullable:False
           /// </summary>           
           [SugarColumn(ColumnName="description", ColumnDataType="varchar", Length=191, ColumnDescription="菜单描述")]
           public string description {get;set;}

           /// <summary>
           /// Desc:
           /// Default:
           /// Nullable:False
           /// </summary>           
           [SugarColumn(ColumnName="icon", ColumnDataType="varchar", Length=191)]
           public string icon {get;set;}

           /// <summary>
           /// Desc:菜单唯一值
           /// Default:
           /// Nullable:False
           /// </summary>           
           [SugarColumn(ColumnName="uuid", ColumnDataType="varchar", Length=191, ColumnDescription="菜单唯一值")]
           public string uuid {get;set;}

           /// <summary>
           /// Desc:父级菜单唯一值
           /// Default:
           /// Nullable:False
           /// </summary>           
           [SugarColumn(ColumnName="parent_uuid", ColumnDataType="varchar", Length=191, ColumnDescription="父级菜单唯一值")]
           public string parent_uuid {get;set;}

           /// <summary>
           /// Desc:菜单排序
           /// Default:
           /// Nullable:False
           /// </summary>           
           [SugarColumn(ColumnName="order_num", ColumnDataType="int", Length=11, ColumnDescription="菜单排序")]
           public int order_num {get;set;}

           /// <summary>
           /// Desc:是否显示
           /// Default:true
           /// Nullable:False
           /// </summary>           
           [SugarColumn(ColumnName="shown", ColumnDataType="bit", Length=1, ColumnDescription="是否显示")]
           public bool shown {get;set;}

           /// <summary>
           /// Desc:是否缓存
           /// Default:true
           /// Nullable:False
           /// </summary>           
           [SugarColumn(ColumnName="is_cache", ColumnDataType="bit", Length=1, ColumnDescription="是否缓存")]
           public bool is_cache {get;set;}

           /// <summary>
           /// Desc:
           /// Default:
           /// Nullable:False
           /// </summary>           
           [SugarColumn(UpdateSql = "CONVERT_TZ(NOW(), '+00:00', '+08:00')",InsertSql = "CONVERT_TZ(NOW(), '+00:00', '+08:00')",ColumnName = "created_at", ColumnDataType="datetime", Length=0)]
           public DateTime created_at {get;set;}

           /// <summary>
           /// Desc:
           /// Default:
           /// Nullable:False
           /// </summary>           
           [SugarColumn(UpdateSql = "CONVERT_TZ(NOW(), '+00:00', '+08:00')",InsertSql = "CONVERT_TZ(NOW(), '+00:00', '+08:00')",ColumnName="updated_at", ColumnDataType ="datetime", Length=0)]
           public DateTime updated_at {get;set;}

    }
}
