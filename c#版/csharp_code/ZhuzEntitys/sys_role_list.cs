using SqlSugar;
namespace Zhuz.net.ZhuzEntitys
{
    ///<summary>
    ///角色分配表
    ///</
    [SugarIndex("unique_sys_role_list_user_id_role_id",nameof(sys_role_list.role_id),OrderByType.Desc,nameof(sys_role_list.user_id),OrderByType.Desc,true)]
    public partial class sys_role_list
    {
           public sys_role_list(){


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
           [SugarColumn(ColumnName="role_id", ColumnDataType="int", Length=11)]
           public int role_id {get;set;}

           /// <summary>
           /// Desc:
           /// Default:
           /// Nullable:False
           /// </summary>           
           [SugarColumn(ColumnName="user_id", ColumnDataType="int", Length=11)]
           public int user_id {get;set;}

    }
}
