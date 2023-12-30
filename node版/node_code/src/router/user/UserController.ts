import { CtxModel } from '../../types/model/HttpModel';
import { ResultOk } from '../../utils/ResUtil';
import SvgCaptcha from 'svg-captcha';
import { generateString } from '../../utils/ZhuzUtil';
import RedisService from '../../service/RedisService';
import {
  loginValidate,
  putPasswordValidator,
  registerValidate
} from '../../types/schema/SysUserSchema';
import { LoginReq, PutPasswordReq, PutUserInfoReq, RegisterReq } from '../../types/dto/SysUserDto';
import SysUserService from '../../service/SysUserService';
import { generateToken } from '../../helper/JWTHelper';

export default class UserController {
  /**
   * 重置某账号密码
   * @param ctx
   */
  static async resetUserPass(ctx: CtxModel) {
    const userId = ctx.params.userId;
    const newPass = await SysUserService.resetUserPass(Number(userId));
    await RedisService.putUserPassVersionHash(userId);
    ctx.body = ResultOk(newPass, '此用户密码已重置!');
  }
  /**
   * 添加某个账号的超管权限
   * @param ctx
   */
  static async addUserAdmin(ctx: CtxModel) {
    const userId = ctx.params.userId;
    const user = await SysUserService.addOrDelUserAdmin(Number(userId), true);
    ctx.body = ResultOk(null, `${user.user_name}已添加成为超管!`);
  }
  /**
   * 撤销某个账号的超管权限
   * @param ctx
   */
  static async revokeUserAdmin(ctx: CtxModel) {
    const userId = ctx.params.userId;
    const user = await SysUserService.addOrDelUserAdmin(Number(userId), false);
    ctx.body = ResultOk(null, `已撤销${user.user_name}的超管角色!`);
  }
  /**
   * 解冻某个账号
   * @param ctx
   */
  static async enbuser(ctx: CtxModel) {
    const userId = ctx.params.userId;
    const user = await SysUserService.disOrEnbUser(Number(userId), false);
    RedisService.putUserPassVersionHash(user.id?.toString() as string);
    ctx.body = ResultOk(null, `账号${user.user_name}已解冻!`);
  }
  /**
   * 冻结某个账号
   * @param ctx
   */
  static async disUser(ctx: CtxModel) {
    const userId = ctx.params.userId;
    const user = await SysUserService.disOrEnbUser(Number(userId), true);
    RedisService.putUserPassVersionHash(user.id?.toString() as string);
    ctx.body = ResultOk(null, `账号${user.user_name}已被冻结!`);
  }
  /**
   * 查找所有账号信息
   * @param ctx
   */
  static async findAllUser(ctx: CtxModel) {
    const users = await SysUserService.findAllUser();
    ctx.body = ResultOk(users);
  }
  /**
   * 修改头像
   * @param ctx
   */
  static async putAvatar(ctx: CtxModel) {
    const file = ctx.request.file;
    const avatar = await SysUserService.putAvatar(file, ctx.state.user.id);
    ctx.body = ResultOk(avatar, '修改成功!');
  }
  /**
   * 修改用户信息
   * @param ctx
   */
  static async putUserInfo(ctx: CtxModel) {
    const body: PutUserInfoReq = ctx.request.body;
    const user = await SysUserService.putUserInfo(body, ctx.state.user.id);
    ctx.body = ResultOk(user, '修改成功!');
  }
  /**
   * 修改当前用户的密码
   * @param ctx
   */
  static async putPassword(ctx: CtxModel) {
    const body: PutPasswordReq = ctx.request.body;
    await putPasswordValidator(body);
    await SysUserService.putPassword(body, ctx.state.user.id);
    await RedisService.putUserPassVersionHash(ctx.state.user.id.toString());
    ctx.body = ResultOk(body.newPass, '修改成功!');
  }
  /**
   * 获取当前用户信息
   * @param ctx
   */
  static async getUserInfo(ctx: CtxModel) {
    ctx.body = ResultOk(ctx.state.user);
  }
  /**
   * 登录
   * @param ctx
   */
  static async login(ctx: CtxModel) {
    const body: LoginReq = ctx.request.body;
    await loginValidate(body);
    await RedisService.compareCaptchaHash(body.uuid, body.code);
    const user = await SysUserService.login(body);
    const passVersion = await RedisService.getUserPassVersionHash(user.id.toString());
    const token = generateToken({
      userName: user.user_name,
      userId: user.id,
      passVerssion: Number(passVersion)
    });
    ctx.body = ResultOk(token, '登录成功!');
  }
  /**
   * 注册
   * @param ctx
   */
  static async register(ctx: CtxModel) {
    const body: RegisterReq = ctx.request.body;
    await registerValidate(body);
    await RedisService.compareCaptchaHash(body.uuid, body.code);
    const user = await SysUserService.createUser({
      user_name: body.username,
      nick_name: '新用户',
      password: body.password
    });
    ctx.body = ResultOk(user, '注册成功!');
  }
  /**
   * 获取验证码
   * @param ctx
   */
  static getCaptcha(ctx: CtxModel) {
    const captcha = SvgCaptcha.create({
      size: 3,
      fontSize: 50,
      width: 120,
      height: 34
    });
    const uuid = generateString();
    ctx.set('x-uuid', uuid);
    ctx.response.type = 'image/svg+xml';
    RedisService.setCaptchaHash(uuid, captcha.text);
    ctx.body = captcha.data;
  }
}
