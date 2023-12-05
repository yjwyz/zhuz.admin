import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import sequelize from '../helper/SequelizeHelper';

class __ISysMenu__ extends Model<
  InferAttributes<__ISysMenu__>,
  InferCreationAttributes<__ISysMenu__>
> {
  declare id?: number;
  declare menu_name: string;
  declare description: string;
  declare icon: string;
  declare uuid: string;
  declare parent_uuid: string;
  declare order_num: number;
  declare shown: boolean;
  declare is_cache: boolean;
}

__ISysMenu__.init(
  {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    menu_name: {
      type: DataTypes.STRING(191),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(191),
      allowNull: false
    },
    icon: {
      type: DataTypes.STRING(191),
      allowNull: false
    },
    uuid: {
      type: DataTypes.STRING(191),
      allowNull: false,
      unique: true
    },
    parent_uuid: {
      type: DataTypes.STRING(191),
      allowNull: false
    },
    order_num: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    shown: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    is_cache: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'sys_menu',
    freezeTableName: true,
    timestamps: true
  }
);

export default __ISysMenu__;
