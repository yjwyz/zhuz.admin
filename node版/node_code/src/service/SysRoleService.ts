import { AdminRoleName } from '../constant/EditConstant';
import { SysRoleEntity } from '../entity/Init';
import { CreateRoleReq, PutRoleReq } from '../types/dto/SysRoleDto';
import { HttpException } from '../utils/ResUtil';

export default class SysRoleService {
  /**
   * 该角色是否为超管
   */
  static async IsAdminRole(roleId: number) {
    const role = await SysRoleEntity.findOne({ where: { id: roleId } });
    if (!role || role.role_name != AdminRoleName) {
      return false;
    }
    return true;
  }
  /**
   * 查找所有角色信息
   */
  static async findAll() {
    const roles = await SysRoleEntity.findAll();
    return roles;
  }
  /**
   * 更新/读取/删除一个角色
   * @param roleId
   */
  static async urdRole(roleId: number, mode: 'U' | 'R' | 'D', putParams?: PutRoleReq) {
    const role = await SysRoleEntity.findOne({ where: { id: roleId } });
    if (!role) {
      throw new HttpException('没有此角色!');
    }
    if (mode == 'D') {
      if (role.role_name == AdminRoleName) {
        throw new HttpException('禁止越级操作!');
      }
      await role.destroy();
    } else if (mode == 'U') {
      if (role.role_name == AdminRoleName) {
        throw new HttpException('禁止越级操作!');
      }
      role.role_name = putParams?.role_name ?? role.role_name;
      await role.save();
    }
    return role.dataValues;
  }
  /**
   * 创建一个角色
   * @param req
   */
  static async createRole(req: CreateRoleReq) {
    const [role, created] = await SysRoleEntity.findOrCreate({
      where: { role_name: req.role_name },
      defaults: {
        role_name: req.role_name
      }
    });
    if (!created) {
      throw new HttpException('已经存在,无法创建!');
    }
    return role;
  }
}
