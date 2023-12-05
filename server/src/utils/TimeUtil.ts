/**
 * 获取多少分钟后的时间
 * @param minutes
 * @returns
 */
export function getFutureTime(minutes: number): Date {
  const currentTime = new Date();
  const futureTime = new Date(currentTime.getTime() + minutes * 60000); // 1 minute = 60,000 milliseconds
  return futureTime;
}

/**
 * 校验time1与time2大小  time1大返回1 time1小返回-1 相等返回0
 * @param time1
 * @param time2
 * @returns
 */
export function compareTimes(time1: Date, time2: Date): number {
  if (time1 < time2) {
    return -1; // time1 小于 time2
  } else if (time1 > time2) {
    return 1; // time1 大于 time2
  } else {
    return 0; // time1 等于 time2
  }
}
