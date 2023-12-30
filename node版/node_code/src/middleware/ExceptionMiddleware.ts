import { NoAuthException, ResultConsole, ResultFail } from '../utils/ResUtil';
import type { Context, Next } from 'koa';
import { HttpException } from '../utils/ResUtil';
import { HttpStatus } from '../types/model/HttpModel';
import { logger } from '../helper/Log4jsHelper';
import { MulterError } from 'multer';

const exception_middleware = async (ctx: Context, next: Next) => {
  return next().catch((error) => {
    if (error instanceof HttpException) {
      // 普通异常
      ctx.body = ResultFail(error.message);
    } else if (error instanceof NoAuthException) {
      // 无权限
      ctx.body = ResultFail(error.message || HttpStatus.NoAuthText, HttpStatus.NoAuth);
    } else if (error instanceof MulterError) {
      if (error.message == 'File too large') {
        error.message = '文件过大!';
      }
      ctx.body = ResultFail(error.message);
    } else if (error.name == 'ValidationError') {
      if (error.message.includes('is not allowed')) {
        error.message = error.message.replace('is not allowed', '是接口提交参数中多余的属性!');
        ctx.body = ResultConsole(error.message);
      } else {
        ctx.body = ResultFail(error.message);
      }
    } else {
      console.log(error.name);
      if (error.message == 'Unexpected end of form') {
        error.message = '请选择文件!';
      }
      // 其它异常
      ctx.body = ResultFail(error.message);
    }

    logger.error(error);

    ctx.status = 200;
    return Promise.resolve();
  });
};

export default exception_middleware;
