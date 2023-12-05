/**
 * 生成随机长度的字符串
 * @param length
 * @returns
 */
export function generateString(length: number = 10) {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let captcha = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    captcha += chars[randomIndex];
  }
  return captcha;
}

/**
 * 是否存在中文
 * @param str
 * @returns
 */
export function includeChinese(str: string): boolean {
  const pattern_Ch = new RegExp('[\u4E00-\u9FA5]');
  return pattern_Ch.test(str);
}
