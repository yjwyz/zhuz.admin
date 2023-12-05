import InitDbService from '../../service/InitDBService';
import { CtxModel } from '../../types/model/HttpModel';
import { HttpException, ResultOk } from '../../utils/ResUtil';
import { CreateBaseTablesParams } from '../../types/dto/DBManageDto';

export default class DbManageController {
  /**
   * 生成数据库表
   * @param ctx
   */
  static async createBaseTables(ctx: CtxModel) {
    const params = ctx.params as CreateBaseTablesParams;
    if (params.secret === '88888888') {
      await InitDbService.createTables();
    } else {
      throw new HttpException('密钥错误!');
    }
    ctx.body = ResultOk(null, '创建成功');
  }
  /**
   * 初始化数据库数据
   * @param ctx
   */
  static async initDatabaseData(ctx: CtxModel) {
    const params = ctx.params as CreateBaseTablesParams;

    if (params.secret === '88888888') {
      await InitDbService.initDatabaseData();
    } else {
      throw new HttpException('密钥错误!');
    }
    ctx.body = ResultOk(null, '初始化成功');
  }
}
