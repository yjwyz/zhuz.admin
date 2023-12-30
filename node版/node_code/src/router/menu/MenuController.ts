import SysMenuService from '../../service/SysMenuService';
import {
  CreateMenuReq,
  PutMenuReq,
  RoleAddMenusReq,
  RoleDelMenusReq
} from '../../types/dto/SysMenuDto';
import { CtxModel } from '../../types/model/HttpModel';
import {
  addMenuValidator,
  putMenuValidator,
  roleAddMenuArrayValidator,
  roleDelMenuArrayValidator
} from '../../types/schema/SysMenuSchema';
import { HttpException, ResultOk } from '../../utils/ResUtil';
import SysMenuListService from '../../service/SysMenuListService';
import SysRoleListService from '../../service/SysRoleListService';
import { AdminRoleName, RootUserName } from '../../constant/EditConstant';
import { uniqBy } from 'lodash';

export default class MenuController {
  /**
   * 查找当前用户拥有的菜单
   * @param ctx
   */
  static async findCurrentUserMenus(ctx: CtxModel) {
    const userId = ctx.state.user.id;
    const rolel = await SysRoleListService.findUserAllRole(userId);
    // 是否存在admin超管角色
    const hasAdmin = rolel.findIndex((v) => (v as any)?.role.role_name == AdminRoleName);
    let menus: any[] = [];
    if (hasAdmin >= 0 || ctx.state.user.user_name == RootUserName) {
      // 超管角色拥有所有菜单权限
      menus = await SysMenuService.findAllMenu();
    } else {
      menus = await SysMenuListService.findRolesTMenus(rolel.map((v) => v.role_id));
      menus = uniqBy(menus, 'uuid');
    }
    // const treeData = SysMenuService.menuBuildTree(menus, 'parent_uuid');
    ctx.body = ResultOk(menus);
  }
  /**
   * 查找某角色拥有的菜单
   * @param ctx
   */
  static async findRoleMenus(ctx: CtxModel) {
    const roleId = ctx.params.roleId;
    if (!roleId) {
      throw new HttpException('请选择要查找的角色!');
    }
    const menus = await SysMenuListService.findRoleMenus(Number(roleId));
    ctx.body = ResultOk(menus);
  }
  /**
   * 为某角色批量删除某些菜单
   * @param ctx
   */
  static async roleDelMenu(ctx: CtxModel) {
    const body: RoleDelMenusReq = ctx.request.body;
    await roleDelMenuArrayValidator(body);
    const rowNum = await SysMenuListService.roleAddOrDelMenus(body, true);
    ctx.body = ResultOk(rowNum, `${rowNum}条菜单已被删除!`);
  }
  /**
   * 为某角色批量添加某些菜单
   * @param ctx
   */
  static async roleAddMenus(ctx: CtxModel) {
    const body: RoleAddMenusReq = ctx.request.body;
    await roleAddMenuArrayValidator(body);
    const rowNum = await SysMenuListService.roleAddOrDelMenus(body, false);
    ctx.body = ResultOk(rowNum, `添加${rowNum}条菜单成功!`);
  }
  /**
   * 为某角色批量更新菜单
   * @param ctx
   */
  static async roleUpdateMenus(ctx: CtxModel) {
    const body: RoleAddMenusReq = ctx.request.body;
    await roleAddMenuArrayValidator(body);
    const rowNum = await SysMenuListService.roleUpdateMenus(body);
    ctx.body = ResultOk(rowNum, `已成功更新${rowNum}条菜单!`);
  }
  /**
   * 查看所有菜单
   * @param ctx
   */
  static async findAllMenu(ctx: CtxModel) {
    const menus = await SysMenuService.findAllMenu();
    const treeData = SysMenuService.menuBuildTree(menus, 'parent_uuid');
    ctx.body = ResultOk(treeData);
  }
  /**
   * 查看一条菜单
   * @param ctx
   */
  static async findMenu(ctx: CtxModel) {
    const menuId = ctx.params.menuId;
    if (!menuId) {
      throw new HttpException('请选择需要查看的菜单!');
    }
    const menu = await SysMenuService.urdMenu(Number(menuId), 'R');
    ctx.body = ResultOk(menu);
  }
  /**
   * 修改一条菜单
   * @param ctx
   */
  static async putMenu(ctx: CtxModel) {
    const body: PutMenuReq = ctx.request.body;
    await putMenuValidator(body);
    const menu = await SysMenuService.urdMenu(body.id, 'U', body);
    ctx.body = ResultOk(menu, '修改成功!');
  }
  /**
   * 删除一条菜单
   * @param ctx
   */
  static async delMenu(ctx: CtxModel) {
    const menuId = ctx.params.menuId;
    if (!menuId) {
      throw new HttpException('请选择需要删除的菜单!');
    }
    const menu = await SysMenuService.urdMenu(Number(menuId), 'D');
    ctx.body = ResultOk(menu, `${menu.menu_name} 菜单项已删除!`);
  }
  /**
   * 添加一条菜单
   * @param ctx
   */
  static async addMenu(ctx: CtxModel) {
    const body: CreateMenuReq = ctx.request.body;
    await addMenuValidator(body);
    const menu = await SysMenuService.createMenu(body);
    ctx.body = ResultOk(menu, '添加成功!');
  }
}
