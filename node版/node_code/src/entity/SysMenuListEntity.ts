import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import sequelize from '../helper/SequelizeHelper';

class __ISysMenuList__ extends Model<
  InferAttributes<__ISysMenuList__>,
  InferCreationAttributes<__ISysMenuList__>
> {
  declare id?: number;
  declare menu_id: number;
  declare role_id: number;
}

__ISysMenuList__.init(
  {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    menu_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'sys_menu',
        key: 'id'
      }
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'sys_role',
        key: 'id'
      }
    }
  },
  {
    sequelize,
    modelName: 'sys_menu_list',
    freezeTableName: true,
    timestamps: false,
    indexes: [
      {
        name: 'menu_list_menu_id_role_id_key',
        unique: true,
        fields: [{ name: 'menu_id' }, { name: 'role_id' }]
      }
    ]
  }
);

export default __ISysMenuList__;
