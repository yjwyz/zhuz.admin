using SqlSugar;
namespace Zhuz.net.ZhuzEntitys
{
    ///<summary>
    ///角色表
    ///</summary>
    [SugarIndex("unique_sys_role_role_name",nameof(sys_role.role_name),OrderByType.Desc,true)]
    public partial class sys_role
    {
           public sys_role(){


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
           [SugarColumn(ColumnName="role_name", ColumnDataType="varchar", Length=191)]
           public string role_name {get;set;}

    }
}
