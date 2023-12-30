import { ParameterizedContext } from 'koa';
import Router from 'koa-router';

export enum HttpStatus {
  FailText = '操作失败,服务器无法根据客户端请求的内容特性完成请求!',
  Fail = 1406,
  SuccessText = '请求成功!',
  Success = 1200,
  NoAuthText = '身份验证失败。',
  NoAuth = 1401,
  ForbiddenText = '拒绝访问，权限不足。',
  Forbidden = 1403,
  BadFailText = '请求无效，服务器无法理解。',
  BadFail = 1400,
  NotFoundText = '访问了一个不存在的类型或者路径。',
  NotFound = 1404,
  ConsoleErrorText = '接口控制台错误提示:',
  ConsoleError = 1555
}

export type ResModel<T> = {
  code: HttpStatus;
  message: HttpStatus | string;
  data: T;
};

export type CtxModel = ParameterizedContext<any, Router.IRouterParamContext<any, {}>, any>;
