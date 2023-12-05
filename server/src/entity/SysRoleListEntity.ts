import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import sequelize from '../helper/SequelizeHelper';
import __ISysRole__ from './SysRoleEntity';

class __ISysRoleList__ extends Model<
  InferAttributes<__ISysRoleList__>,
  InferCreationAttributes<__ISysRoleList__>
> {
  declare id?: number;
  declare role_id: number;
  declare user_id: number;
}

__ISysRoleList__.init(
  {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'sys_role',
        key: 'id'
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'sys_user',
        key: 'id'
      }
    }
  },
  {
    sequelize,
    modelName: 'sys_role_list',
    freezeTableName: true,
    timestamps: false,
    indexes: [
      {
        name: 'role_list_role_id_user_id_key',
        unique: true,
        fields: [{ name: 'role_id' }, { name: 'user_id' }]
      }
    ]
  }
);

export default __ISysRoleList__;
