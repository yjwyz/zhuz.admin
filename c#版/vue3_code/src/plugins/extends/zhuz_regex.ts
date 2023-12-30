/**
 * 是否存在中文
 * @param str 字符串
 * @returns
 */
export function isHaveChinese(str: string) {
  return /[\u4e00-\u9fa5]/.test(str);
}
