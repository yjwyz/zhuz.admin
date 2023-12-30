import SysRoleListService from '../../service/SysRoleListService';
import SysRoleService from '../../service/SysRoleService';
import { CreateRoleReq, PutRoleReq } from '../../types/dto/SysRoleDto';
import { CreateRoleListReq, DelRoleListReq } from '../../types/dto/SysRoleListDto';
import { CtxModel } from '../../types/model/HttpModel';
import {
  addRoleValidator,
  delUserRoleValidator,
  putRoleValidator,
  userAddRoleValidator
} from '../../types/schema/SysRoleSchema';
import { HttpException, ResultOk } from '../../utils/ResUtil';

export default class RoleController {
  /**
   * 获取当前用户的角色
   * @param ctx
   */
  static async findUserOneRole(ctx: CtxModel) {
    const rolels = await SysRoleListService.findUserAllRole(Number(ctx.state.user.id));
    ctx.body = ResultOk(rolels);
  }
  /**
   * 查找某用户拥有的所有角色
   * @param ctx
   */
  static async findUserAllRole(ctx: CtxModel) {
    const userId = ctx.params.userId;
    if (!userId) {
      throw new HttpException('请选择要查询的用户!');
    }
    const rolels = await SysRoleListService.findUserAllRole(Number(userId));
    ctx.body = ResultOk(rolels);
  }
  /**
   * 删除账户的某个角色
   * @param ctx
   */
  static async delUserRole(ctx: CtxModel) {
    const body: DelRoleListReq = ctx.request.body;
    await delUserRoleValidator(body);
    const rolel = await SysRoleListService.delRoleL(body);
    ctx.body = ResultOk(rolel, '删除成功!');
  }
  /**
   * 为某用户添加某个角色
   * @param ctx
   */
  static async userAddRole(ctx: CtxModel) {
    const body: CreateRoleListReq = ctx.request.body;
    await userAddRoleValidator(body);
    const rolel = await SysRoleListService.createRoleL(body);
    ctx.body = ResultOk(rolel, '添加成功!');
  }
  /**
   * 查找所有角色信息
   * @param ctx
   */
  static async findAllRole(ctx: CtxModel) {
    const roles = await SysRoleService.findAll();
    ctx.body = ResultOk(roles);
  }
  /**
   * 查找一个角色
   * @param ctx
   */
  static async findRole(ctx: CtxModel) {
    const roleId = ctx.params.roleId;
    if (!roleId) {
      throw new HttpException('请选择要查询的角色!');
    }
    const role = await SysRoleService.urdRole(Number(roleId), 'R');
    ctx.body = ResultOk(role);
  }
  /**
   * 修改一个角色
   * @param ctx
   */
  static async putRole(ctx: CtxModel) {
    const body: PutRoleReq = ctx.request.body;
    await putRoleValidator(body);
    const role = await SysRoleService.urdRole(body.role_id, 'U', body);
    ctx.body = ResultOk(role, `修改成功!`);
  }
  /**
   * 删除一个角色
   * @param ctx
   */
  static async delRole(ctx: CtxModel) {
    const roleId = ctx.params.roleId;
    if (!roleId) {
      throw new HttpException('请选择要删除的角色!');
    }
    const role = await SysRoleService.urdRole(Number(roleId), 'D');
    ctx.body = ResultOk(role, `${role.role_name} 角色已删除!`);
  }
  /**
   * 添加角色
   * @param ctx
   */
  static async addRole(ctx: CtxModel) {
    const body: CreateRoleReq = ctx.request.body;
    await addRoleValidator(body);
    const role = await SysRoleService.createRole(body);
    ctx.body = ResultOk(role, '添加成功!');
  }
}
