const AppThrowErrorKey = "AppThrowErrorKey-";

// 抛出自定义异常
export function appError_Throw(message: string) {
  throw new Error(AppThrowErrorKey + message);
}

// 捕获自定义异常-只对自定义异常做处理
export function appError_CatchCallback(
  e: string,
  callback: (msg: string) => void
) {
  const check = e.indexOf(AppThrowErrorKey);
  if (check >= 0) {
    const message = e.split(AppThrowErrorKey)[1];
    callback(message);
  }
}
