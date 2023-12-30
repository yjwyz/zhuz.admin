import { AdminRoleName, RootUserName } from '../constant/EditConstant';
import { SysRoleEntity } from '../entity/Init';
import { SysRoleListEntity } from '../entity/Init';
import { SysUserEntity } from '../entity/Init';
import { CreateRoleListReq, DelRoleListReq } from '../types/dto/SysRoleListDto';
import { HttpException } from '../utils/ResUtil';

export default class SysRoleListService {
  /**
   * 查找某用户拥有的所有角色
   * @param userId
   */
  static async findUserAllRole(userId: number) {
    const rolels = await SysRoleListEntity.findAll({
      where: { user_id: userId },
      include: [{ model: SysRoleEntity, as: 'role' }]
    });
    return rolels;
  }
  /**
   * 删除账户的某个角色
   * @param rolelId
   */
  static async delRoleL(req: DelRoleListReq) {
    const role = await SysRoleEntity.findOne({ where: { id: req.role_id } });
    if (!role) {
      throw new HttpException('没有此角色!');
    } else if (role.role_name == AdminRoleName) {
      throw new HttpException('禁止越级操作!');
    }
    const user = await SysUserEntity.findOne({ where: { id: req.user_id } });
    if (!user) {
      throw new HttpException('没有此用户!');
    } else if (user.user_name == RootUserName) {
      throw new HttpException('禁止越级操作!');
    }
    const rolel = await SysRoleListEntity.findOne({
      where: { role_id: role.id, user_id: user.id }
    });
    if (!rolel) {
      throw new HttpException('用户没有此角色!');
    }
    await rolel.destroy();
    return rolel;
  }
  /**
   * 为用户创建角色
   * @param req
   * @returns
   */
  static async createRoleL(req: CreateRoleListReq) {
    const role = await SysRoleEntity.findOne({ where: { id: req.role_id } });
    if (!role) {
      throw new HttpException('没有此角色!');
    } else if (role.role_name == AdminRoleName) {
      throw new HttpException('禁止越级操作!');
    }
    const user = await SysUserEntity.findOne({ where: { id: req.user_id } });
    if (!user) {
      throw new HttpException('没有此用户!');
    } else if (user.user_name == RootUserName) {
      throw new HttpException('禁止越级操作!');
    }
    const [rolel, created] = await SysRoleListEntity.findOrCreate({
      where: { role_id: role.id, user_id: user.id },
      defaults: req
    });
    if (!created) {
      throw new HttpException('已经存在,无法创建!');
    }
    return rolel;
  }
}
