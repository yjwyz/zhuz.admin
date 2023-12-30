import { Context, Next } from 'koa';
import { decodeToken } from '../helper/JWTHelper';
import { HttpException, NoAuthException } from '../utils/ResUtil';
import SysUserService from '../service/SysUserService';
import RedisService from '../service/RedisService';
import { SysRoleEntity } from '../entity/Init';
import { AdminRoleName, RootUserName } from '../constant/EditConstant';
import { SysRoleListEntity } from '../entity/Init';

export async function jwt_base_middleware(ctx: Context, next: Next) {
  const token = (ctx.request.headers.authorization as string)?.split(' ')[1] || null;
  if (typeof token === 'string') {
    try {
      let tokenStruct = decodeToken(token);
      // 监测用户id跟useid是否对应,密码版本是否对应
      const user = await SysUserService.getUserInfo({
        userId: tokenStruct.userId,
        userName: tokenStruct.userName
      });
      if (user.is_del) {
        throw new HttpException('账号已冻结,请联系管理员处理!');
      }
      await RedisService.comparePassVersionHash(
        user.id.toString(),
        tokenStruct.passVerssion.toString()
      );
      ctx.state.user = user;
      ctx.state.passVerssion = tokenStruct.passVerssion;
    } catch (error) {
      if (error instanceof NoAuthException) {
        throw new NoAuthException(error.message);
      } else {
        throw new NoAuthException((error as Error).message);
      }
    }
  } else {
    throw new NoAuthException();
  }
  await next();
}

export async function jwt_admin_middleware(ctx: Context, next: Next) {
  try {
    if (ctx.state.user.user_name != RootUserName) {
      const role = await SysRoleEntity.findOne({ where: { role_name: AdminRoleName } });
      const roleList = await SysRoleListEntity.findOne({
        where: { role_id: role?.id, user_id: ctx.state.user.id }
      });
      if (!roleList) {
        throw new NoAuthException('非超管禁止访问!');
      }
    }
  } catch (error) {
    if (error instanceof NoAuthException) {
      throw new NoAuthException(error.message);
    } else {
      throw new NoAuthException((error as Error).message);
    }
  }
  await next();
}

export async function jwt_root_middleware(ctx: Context, next: Next) {
  try {
    if (ctx.state.user.user_name !== RootUserName) {
      throw new NoAuthException(`非${RootUserName}禁止访问!`);
    }
  } catch (error) {
    if (error instanceof NoAuthException) {
      throw new NoAuthException(error.message);
    } else {
      throw new NoAuthException((error as Error).message);
    }
  }
  await next();
}
