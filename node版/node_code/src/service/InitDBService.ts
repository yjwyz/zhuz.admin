import { QueryTypes } from 'sequelize';
import { GetDatabaseTableCountQeuryStr } from '../constant/SQLConstant';
import { SysMenuEntity } from '../entity/Init';
import { SysMenuListEntity } from '../entity/Init';
import { SysRoleEntity } from '../entity/Init';
import { SysRoleListEntity } from '../entity/Init';
import { SysUserEntity } from '../entity/Init';
import sequelize from '../helper/SequelizeHelper';
import SysUserService from './SysUserService';
import { AdminRoleName, AdminUserName, RootUserName } from '../constant/EditConstant';
import SysRoleService from './SysRoleService';
import SysRoleListService from './SysRoleListService';
import menus from '../constant/initData/menus';
import SysMenuService from './SysMenuService';

export default class InitDbService {
  /**
   * 创建数据库表
   */
  static async createTables() {
    await SysUserEntity.sync();
    await SysRoleEntity.sync();
    await SysRoleListEntity.sync();
    await SysMenuEntity.sync();
    await SysMenuListEntity.sync();
  }
  /**
   * 初始化数据库数据
   */
  static async initDatabaseData() {
    try {
      await SysUserService.createUser({
        user_name: RootUserName,
        nick_name: 'root',
        password: '123456'
      });
    } catch (error) {}
    try {
      await SysUserService.createUser({
        user_name: AdminUserName,
        nick_name: 'admin',
        password: '123456'
      });
    } catch (error) {}
    try {
      await SysRoleService.createRole({ role_name: AdminRoleName });
    } catch (error) {}
    try {
      const user = await SysUserEntity.findOne({
        where: { user_name: AdminUserName },
        attributes: { include: ['id'] }
      });
      const role = await SysRoleEntity.findOne({
        where: { role_name: AdminRoleName },
        attributes: { include: ['id'] }
      });
      if (user && role) {
        await SysUserService.addOrDelUserAdmin(user?.id as number, true);
      }
    } catch (error) {}
    menus.forEach(async (menu) => {
      try {
        await SysMenuService.createMenu(menu);
      } catch (error) {}
    });
  }

  private static async _getDatabaseTableCount(): Promise<number> {
    const result = await sequelize.query(GetDatabaseTableCountQeuryStr, {
      type: QueryTypes.SELECT
    });
    return (result[0] as any).count || 0;
  }
}
