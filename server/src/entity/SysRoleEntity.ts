import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import sequelize from '../helper/SequelizeHelper';

class __ISysRole__ extends Model<
  InferAttributes<__ISysRole__>,
  InferCreationAttributes<__ISysRole__>
> {
  declare id?: number;
  declare role_name: string;
}

__ISysRole__.init(
  {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    role_name: {
      type: DataTypes.STRING(191),
      allowNull: false,
      unique: true
    }
  },
  {
    sequelize,
    modelName: 'sys_role',
    freezeTableName: true,
    timestamps: false
  }
);

export default __ISysRole__;
