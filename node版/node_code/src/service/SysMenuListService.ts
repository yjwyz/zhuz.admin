import { Op } from 'sequelize';
import { SysMenuEntity, SysMenuListEntity, SysRoleEntity } from '../entity/Init';
import { RoleAddMenusReq, RoleDelMenusReq } from '../types/dto/SysMenuDto';
import { HttpException } from '../utils/ResUtil';
import SysMenuService from './SysMenuService';
import SysRoleService from './SysRoleService';

export default class SysMenuListService {
  /**
   * 查找多个角色所拥有的菜单
   * @param roleIds
   */
  static async findRolesTMenus(roleIds: number[]) {
    const menul = await SysMenuListEntity.findAll({
      where: {
        [Op.or]: roleIds.map((v) => ({ role_id: v }))
      },
      include: [{ model: SysMenuEntity, as: 'menu' }]
    });
    return menul.map((v) => (v.get({ plain: true }) as any)['menu']);
  }
  /**
   * 查找某角色拥有的菜单
   * @param userId
   */
  static async findRoleMenus(roleId: number) {
    const isAdminR = await SysRoleService.IsAdminRole(roleId);
    if (isAdminR) {
      const menus = await SysMenuService.findAllMenu();
      return menus;
    } else {
      const menul = await SysMenuListEntity.findAll({
        where: { role_id: roleId },
        include: [{ model: SysMenuEntity, as: 'menu' }]
      });
      const menus = menul.map((v) => (v.get({ plain: true }) as any)['menu']);
      return menus;
    }
  }

  /**
   * 为某角色批量 添加/删除 某些菜单
   */
  static async roleAddOrDelMenus(req: RoleAddMenusReq | RoleDelMenusReq, isDel: boolean) {
    const isAdmin = await SysRoleService.IsAdminRole(req.role_id);
    if (isAdmin) {
      if (isDel) {
        throw new HttpException('超管拥有所有菜单权限,无需删除!');
      } else {
        throw new HttpException('超管拥有所有菜单权限,无需添加!');
      }
    }
    if (isDel) {
      const rowNum = await SysMenuListEntity.destroy({
        where: {
          role_id: req.role_id,
          [Op.or]: req.menus_id.map((v) => ({ menu_id: v }))
        }
      });
      return rowNum;
    } else {
      const role = await SysRoleEntity.findOne({ where: { id: req.role_id } });
      if (!role) {
        throw new HttpException('没有此角色!');
      }
      // 获取已经拥有的菜单id
      const existingMenus = await SysMenuListEntity.findAll({
        where: {
          role_id: role.id,
          [Op.or]: req.menus_id.map((v) => ({ menu_id: v }))
        },
        attributes: ['menu_id']
      });
      const existingMenuIds = existingMenus.map((existingMenu) => existingMenu.menu_id);
      // 排除掉已经存在的id
      const newMenuIds = req.menus_id.filter((menu_id) => !existingMenuIds.includes(menu_id));

      // 如果还有需要添加的id就添加
      if (newMenuIds.length > 0) {
        const newMenuRecords = newMenuIds.map((menu_id) => ({
          role_id: req.role_id,
          menu_id
        }));
        await SysMenuListEntity.bulkCreate(newMenuRecords);
      }
      return newMenuIds.length;
    }
  }

  /**
   * 为某角色批量 修改菜单
   */
  static async roleUpdateMenus(req: RoleAddMenusReq) {
    const isAdmin = await SysRoleService.IsAdminRole(req.role_id);
    if (isAdmin) {
      throw new HttpException('超管拥有所有菜单权限,无需修改!');
    }
    const role = await SysRoleEntity.findOne({ where: { id: req.role_id } });
    if (!role) {
      throw new HttpException('没有此角色!');
    }

    // 先清空当前角色的信息
    const delnum = await SysMenuListEntity.destroy({ where: { role_id: req.role_id } });

    // 清空完后添加
    const newMenuIds = req.menus_id;
    if (newMenuIds.length) {
      const newMenuRecords = newMenuIds.map((menu_id) => ({
        role_id: req.role_id,
        menu_id
      }));
      await SysMenuListEntity.bulkCreate(newMenuRecords);
    }
    return newMenuIds.length || delnum;
  }
}
