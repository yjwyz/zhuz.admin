using SqlSugar;
namespace Zhuz.net.ZhuzEntitys
{
    ///<summary>
    ///菜单分配表
    ///</summary>
    [SugarIndex("unique_sys_menu_list_menu_id_role_id",nameof(sys_menu_list.role_id),OrderByType.Desc,nameof(sys_menu_list.menu_id),OrderByType.Desc,true)]
    public partial class sys_menu_list
    {
           public sys_menu_list(){


           }
           /// <summary>
           /// Desc:
           /// Default:
           /// Nullable:False
           /// </summary>           
           [SugarColumn(IsPrimaryKey=true, IsIdentity=true, ColumnName="id", ColumnDataType="int", Length=11)]
           public int id {get;set;}

           /// <summary>
           /// Desc:
           /// Default:
           /// Nullable:False
           /// </summary>           
           [SugarColumn(ColumnName="menu_id", ColumnDataType="int", Length=11)]
           public int menu_id {get;set;}

           /// <summary>
           /// Desc:
           /// Default:
           /// Nullable:False
           /// </summary>           
           [SugarColumn(ColumnName="role_id", ColumnDataType="int", Length=11)]
           public int role_id {get;set;}

    }
}
