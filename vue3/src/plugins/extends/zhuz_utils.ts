/**
 * 是否为空
 * @param value 值
 * @param nullIncludeZero 0是否算空
 * @returns
 */
export function appUtil_IsEmpty(value: any, nullIncludeZero = false) {
  if (!nullIncludeZero) {
    // 空不包含0
    if (value === 0) {
      return false;
    }
  }
  return (
    !value || JSON.stringify(value) === "{}" || JSON.stringify(value) === "[]"
  );
}

/**
 * 将字符串的中文字符替换成目标字符
 * @param originStr 源字符串
 * @param toStr 替换的目标字符串
 */
export function appUtil_ChineseReplaceToStr(
  originStr: string,
  toStr: string
): void {
  originStr.replace(/[\u4e00-\u9fa5]/g, toStr);
}
