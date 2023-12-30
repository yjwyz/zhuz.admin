import { cloneDeep, isDate, toLower } from 'lodash';
import redis from '../helper/RedisHelper';
import { HttpException, NoAuthException } from '../utils/ResUtil';

export default class RedisService {
  private static readonly captchaHashKey = 'USERCAPTCHA';
  private static readonly userPassVerssionKey = 'PASSVERSION';
  private static readonly captchaTimeSuffix = '_expire';
  /**
   * 存储验证码hash
   * @param key
   * @param value
   */
  static setCaptchaHash<T>(key: string, value: T) {
    this._setHash(this.captchaHashKey, key, value);
    const clonedTime = cloneDeep(new Date());
    clonedTime.setMinutes(clonedTime.getMinutes() + 1);
    this._setHash(this.captchaHashKey, key + this.captchaTimeSuffix, clonedTime.toISOString());
  }
  /**
   * 校验验证码是否有效
   * @param uuid
   * @param value
   */
  static async compareCaptchaHash(uuid: string, value: string): Promise<boolean> {
    const timeUUID = uuid + this.captchaTimeSuffix;
    const captchaTime = (await this._getHash(this.captchaHashKey, timeUUID)) || '';
    if (isDate(new Date(captchaTime)) && new Date() < new Date(captchaTime)) {
      // 是否过期
      const code = (await this._getHash(this.captchaHashKey, uuid)) || '';
      if (toLower(code) === toLower(value)) {
        // 是否一致
        this._delHash(this.captchaHashKey, timeUUID);
        return true;
      } else {
        throw new HttpException('验证码错误!');
      }
    } else {
      this._delHash(this.captchaHashKey, timeUUID);
      throw new HttpException('验证码已过期!');
    }
  }
  /**
   * 更新用户密码版本hash
   * @param key
   * @param value
   */
  static async putUserPassVersionHash<T>(key: string) {
    const result = await this.getUserPassVersionHash(key);
    const newVersion = Number(result);
    this._setHash(this.userPassVerssionKey, key, newVersion + 1);
  }
  /**
   * 获取用户密码版本
   * @param key
   */
  static async getUserPassVersionHash(key: string) {
    const result = await this._getHash(this.userPassVerssionKey, key);
    if (!result) {
      this._setHash(this.userPassVerssionKey, key, 1);
      const v = await this._getHash(this.userPassVerssionKey, key);
      return v;
    }
    return result;
  }
  /**
   * 校验密码版本
   * @param key
   */
  static async comparePassVersionHash(key: string, version: string) {
    const result = await this._getHash(this.userPassVerssionKey, key);
    if (!result || result != version) {
      throw new NoAuthException('授权已更新,请重新登录!');
    }
  }
  private static async _setHash<T>(primaryKey: string, key: string, value: T) {
    await redis.hset(primaryKey, { [key]: value });
  }
  private static async _getHash(primaryKey: string, key: string): Promise<string | null> {
    const result = await redis.hget(primaryKey, key);
    return result;
  }
  private static async _delHash(primaryKey: string, key: string) {
    await redis.hdel(primaryKey, key);
  }
}
