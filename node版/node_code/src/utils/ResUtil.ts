import { HttpStatus, ResModel } from '../types/model/HttpModel';
import { includeChinese } from './ZhuzUtil';

export function ResultOk<T>(data: T, msg?: string): ResModel<T> {
  return {
    code: HttpStatus.Success,
    data: data,
    message: msg || HttpStatus.SuccessText
  };
}

export function ResultFail(msg: string, code?: HttpStatus): ResModel<null> {
  return {
    code: code || HttpStatus.Fail,
    data: null,
    message: msg
  };
}

export function ResultConsole(msg: string, code?: HttpStatus): ResModel<null> {
  return {
    code: code || HttpStatus.ConsoleError,
    data: null,
    message: HttpStatus.ConsoleErrorText + msg
  };
}

export class HttpException extends Error {
  constructor(msg = '服务器异常') {
    super();
    this.message = msg || HttpStatus.FailText;
  }
}

export class NoAuthException extends Error {
  constructor(msg = '权限不足') {
    super();
    if (!includeChinese(msg)) {
      msg = HttpStatus.NoAuthText;
    }
    this.message = msg || HttpStatus.NoAuthText;
  }
}
