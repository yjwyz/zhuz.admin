import { compareSync, genSaltSync, hashSync } from 'bcryptjs';

/**
 * 生成加盐的hash值
 * @param value
 * @returns
 */
export function generateHash(value: string): string {
  const salt = genSaltSync(10); // 生成10长度的同步hash盐值
  const hash = hashSync(value, salt);
  return hash;
}

/**
 * 校验值与hash是否一致
 * @param value
 * @param hash
 * @returns
 */
export function compareHash(value: string, hash: string): boolean {
  return compareSync(value, hash);
}
