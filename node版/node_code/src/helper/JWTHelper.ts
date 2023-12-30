import configShare from '../share/ConfigShare';
import { TokenStructModel } from '../types/model/JWTModel';
import Jwt from 'jsonwebtoken';

/**
 * 解析token
 * @param token
 */
export function decodeToken(token: string): TokenStructModel {
  const tokenInfo = Jwt.verify(token, configShare.jwt.secret) as TokenStructModel;
  return tokenInfo;
}

/**
 * 生成token
 * @param data
 * @returns
 */
export function generateToken(data: TokenStructModel) {
  return Jwt.sign(data, configShare.jwt.secret, { expiresIn: configShare.jwt.expiresIn + 'h' });
}
