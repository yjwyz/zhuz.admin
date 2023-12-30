// axios 数据返回的数据结构
interface AxiosResponseDataType<T> {
  code: 1406 | 1200 | 1401 | 1403 | 1400 | 1404;
  message: string;
  data: T;
}

// [Description("操作失败,服务器无法根据客户端请求的内容特性完成请求!")]
// Fail = 1406,
// [Description("请求成功!")]
// Success = 1200,
// [Description("身份验证失败。")]
// NoAuth = 1401,
// [Description("拒绝访问，权限不足。")]
// Forbidden = 1403,
// [Description("请求无效，服务器无法理解。")]
// BadFail = 1400,
// [Description("访问了一个不存在的类型或者路径。")]
// NotFound = 1404
