using System.ComponentModel.DataAnnotations.Schema;
using SqlSugar;
namespace Zhuz.net.ZhuzEntitys
{
    ///<summary>
    ///
    ///</summary>
    [SugarIndex("unique_sys_user_user_name",nameof(sys_user.user_name),OrderByType.Desc,true)]
    public partial class sys_user
    {
           public sys_user(){


           }
           /// <summary>
           /// Desc:
           /// Default:
           /// Nullable:False
           /// </summary>           
           [SugarColumn(IsPrimaryKey=true, IsIdentity=true, ColumnName="id", ColumnDataType="int", Length=11)]
           public int id {get;set;}

           /// <summary>
           /// Desc:用户名
           /// Default:
           /// Nullable:False
           /// </summary>           
           [SugarColumn(ColumnName="user_name", ColumnDataType="varchar", Length=191, ColumnDescription="用户名")]
           public string user_name {get;set;}

           /// <summary>
           /// Desc:
           /// Default:
           /// Nullable:False
           /// </summary>           
           [SugarColumn(ColumnName="password", ColumnDataType="varchar", Length=191)]
           public string password {get;set;}

           /// <summary>
           /// Desc:网名
           /// Default:
           /// Nullable:True
           /// </summary>           
           [SugarColumn(IsNullable=true, ColumnName="nick_name", ColumnDataType="varchar", Length=191, ColumnDescription="网名")]
           public string nick_name {get;set;}

           /// <summary>
           /// Desc:
           /// Default:
           /// Nullable:True
           /// </summary>           
           [SugarColumn(IsNullable=true, ColumnName="avatar", ColumnDataType="varchar", Length=191)]
           public string avatar {get;set;}

           /// <summary>
           /// Desc:
           /// Default:
           /// Nullable:True
           /// </summary>           
           [SugarColumn(IsNullable=true, ColumnName="qq", ColumnDataType="varchar", Length=191)]
           public string qq {get;set;}

           /// <summary>
           /// Desc:
           /// Default:
           /// Nullable:True
           /// </summary>           
           [SugarColumn(IsNullable=true, ColumnName="wechat", ColumnDataType="varchar", Length=191)]
           public string wechat {get;set;}

           /// <summary>
           /// Desc:
           /// Default:
           /// Nullable:True
           /// </summary>           
           [SugarColumn(IsNullable=true, ColumnName="email", ColumnDataType="varchar", Length=191)]
           public string email {get;set;}

           /// <summary>
           /// Desc:
           /// Default:
           /// Nullable:True
           /// </summary>           
           [SugarColumn(IsNullable=true, ColumnName="github", ColumnDataType="varchar", Length=191)]
           public string github {get;set;}

           /// <summary>
           /// Desc:
           /// Default:False
           /// Nullable:False
           /// </summary>           
           [SugarColumn(ColumnName="is_del", ColumnDataType="bit", Length=1)]
           public bool is_del {get;set;}
           /// <summary>
           /// Desc:
           /// Default:False
           /// Nullable:False
           /// </summary>           
           [SugarColumn(ColumnName="is_admin", ColumnDataType="bit", Length=1)]
           public bool is_admin {get;set;}
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
