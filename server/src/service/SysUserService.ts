import { File } from '@koa/multer';
import { SysUserEntity } from '../entity/Init';
import { compareHash, generateHash } from '../helper/BcryptHelper';
import { handleMapper } from '../helper/MapperHelper';
import {
  CreateUserReq,
  GetUserInfoReq,
  LoginReq,
  PutPasswordReq,
  PutUserInfoReq,
  UserRes,
  UserResKeys
} from '../types/dto/SysUserDto';
import { HttpException } from '../utils/ResUtil';
import ConfigShare from '../share/ConfigShare';
import { getStaticRootFolderPath, pipeStream, removeFile } from '../helper/StreamHelper';
import { parse } from 'path';
import { AdminRoleName, AdminUserName, RootUserName } from '../constant/EditConstant';
import { SysRoleEntity } from '../entity/Init';
import { SysRoleListEntity } from '../entity/Init';

export default class SysUserService {
  /**
   * 冻结或者解冻某个账号
   * @param userId
   * @param isAdd
   */
  static async disOrEnbUser(userId: number, isDis: boolean) {
    if (!userId) {
      if (isDis) {
        throw new HttpException('请选择需要冻结的用户!');
      } else {
        throw new HttpException('请选择需要解冻的用户!');
      }
    }
    const user = await SysUserEntity.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpException('用户不存在!');
    }
    if (user.user_name == RootUserName || user.user_name == AdminUserName) {
      throw new HttpException('禁止越级操作!');
    }
    if (isDis) {
      if (user.is_del) {
        throw new HttpException('已是冻结状态,无需再次冻结!');
      }
      user.is_del = true;
    } else {
      if (!user.is_del) {
        throw new HttpException('未被冻结,无需解冻!');
      }
      user.is_del = false;
    }
    await user.save();
    return user;
  }
  /**
   * 添加或者撤销某个用户的超管权限
   */
  static async addOrDelUserAdmin(userId: number, isAdd: boolean) {
    if (!userId) {
      if (isAdd) {
        throw new HttpException('请选择需要添加的用户!');
      } else {
        throw new HttpException('请选择需要撤销的用户!');
      }
    }
    const user = await SysUserEntity.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpException('用户不存在!');
    }
    if (user.user_name == RootUserName) {
      throw new HttpException('禁止越级操作!');
    }
    const role = await SysRoleEntity.findOne({ where: { role_name: AdminRoleName } });
    if (isAdd) {
      const [roleList, created] = await SysRoleListEntity.findOrCreate({
        where: { user_id: userId, role_id: role?.id },
        defaults: {
          role_id: role?.id as number,
          user_id: user?.id as number
        }
      });
      if (!created) {
        throw new HttpException('已是超管,无需添加!');
      }
    } else {
      await SysRoleListEntity.destroy({ where: { user_id: userId, role_id: role?.id } });
    }

    return user;
  }
  /**
   * 重置某用户密码
   * @param userId
   */
  static async resetUserPass(userId: number) {
    if (!userId) {
      throw new HttpException('请选择需要重置密码的用户!');
    }
    const user = await SysUserEntity.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpException('用户不存在!');
    }
    const newPass = '123456';
    user.password = generateHash(newPass);
    await user.save();
    return newPass;
  }
  /**
   * 查找所有用户
   * @returns
   */
  static async findAllUser() {
    const users = await SysUserEntity.findAll({ attributes: { exclude: ['password'] } });
    return users;
  }
  /**
   * 修改头像
   * @param file
   * @param userId
   */
  static async putAvatar(file: File, userId: number) {
    const user = await SysUserEntity.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpException('查找不到用户!');
    }
    let oldAvatar = user.avatar;
    user.avatar = ConfigShare.resourceAccess.avatar + '/' + file.filename;
    await user.save();
    await pipeStream(
      file.path,
      getStaticRootFolderPath(ConfigShare.resource.avatarPath) + '/' + file.filename
    );
    if (oldAvatar) {
      oldAvatar = parse(oldAvatar)['base'];
    }
    removeFile(getStaticRootFolderPath(ConfigShare.resource.avatarPath) + '/' + oldAvatar);
    return user.avatar;
  }
  /**
   * 修改当前用户信息
   * @param req
   */
  static async putUserInfo(req: PutUserInfoReq, userId: number) {
    const user = await SysUserEntity.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpException('此用户不存在!');
    }
    user.email = req.email ?? user.email;
    user.github = req.github ?? user.github;
    user.qq = req.qq ?? user.qq;
    user.nick_name = req.nick_name ?? user.nick_name;
    user.wechat = req.wechat ?? user.wechat;
    await user.save();
    return handleMapper<UserRes>(UserResKeys, user);
  }
  /**
   * 修改密码
   * @param req
   */
  static async putPassword(req: PutPasswordReq, userId: number) {
    const user = await SysUserEntity.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpException('此用户不存在!');
    }
    const isCompare = compareHash(req.oldPass, user.password as string);
    if (!isCompare) {
      throw new HttpException('密码错误!');
    }
    user.password = generateHash(req.newPass);
    await user.save();
  }
  /**
   * 获取某用户的用户信息
   * @param req
   */
  static async getUserInfo(req: GetUserInfoReq): Promise<UserRes> {
    let user;
    if (req.userId) {
      user = await SysUserEntity.findOne({ where: { id: req.userId } });
    }
    if (req.userName) {
      user = await SysUserEntity.findOne({ where: { user_name: req.userName } });
    }
    if (!user) {
      throw new HttpException('此用户不存在!');
    }
    return handleMapper<UserRes>(UserResKeys, user.dataValues);
  }
  /**
   * 登录
   * @param req
   * @returns
   */
  static async login(req: LoginReq) {
    const user = await SysUserEntity.findOne({ where: { user_name: req.username } });
    if (!user) {
      throw new HttpException('此用户不存在!');
    }
    if (!compareHash(req.password, user.password)) {
      throw new HttpException('密码错误!');
    }
    if (user.is_del) {
      throw new HttpException('该用户已被冻结,请联系管理解冻!');
    }
    return handleMapper<UserRes>(UserResKeys, user.dataValues);
  }
  /**
   * 创建一个用户
   * @param req
   */
  static async createUser(req: CreateUserReq) {
    const [user, created] = await SysUserEntity.findOrCreate({
      where: { user_name: req.user_name },
      defaults: {
        user_name: req.user_name,
        nick_name: req.nick_name,
        password: generateHash(req.password),
        avatar: req.avatar,
        email: req.email,
        github: req.github,
        qq: req.qq,
        wechat: req.wechat
      }
    });
    if (!created) {
      throw new HttpException('已经存在,无法创建!');
    }
    return handleMapper<UserRes>(UserResKeys, user.dataValues);
  }
}
