import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import sequelize from '../helper/SequelizeHelper';

class __ISysUser__ extends Model<
  InferAttributes<__ISysUser__>,
  InferCreationAttributes<__ISysUser__>
> {
  declare id?: number;
  declare user_name: string;
  declare password: string;
  declare nick_name: string;
  declare avatar?: string;
  declare qq?: string;
  declare wechat?: string;
  declare email?: string;
  declare github?: string;
  declare is_del?: boolean;
}

__ISysUser__.init(
  {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_name: {
      allowNull: false,
      type: DataTypes.STRING(191),
      unique: true
    },
    password: {
      type: DataTypes.STRING(191),
      allowNull: false
    },
    nick_name: {
      type: DataTypes.STRING(191),
      allowNull: true
    },
    avatar: {
      type: DataTypes.STRING(191),
      allowNull: true
    },
    qq: {
      type: DataTypes.STRING(191),
      allowNull: true
    },
    wechat: {
      type: DataTypes.STRING(191),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(191),
      allowNull: true
    },
    github: {
      type: DataTypes.STRING(191),
      allowNull: true
    },
    is_del: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  },
  {
    sequelize,
    modelName: 'sys_user',
    freezeTableName: true,
    timestamps: true
  }
);

export default __ISysUser__;
