import Router from 'koa-router';
import DbManageController from './DBManageController';

const dbmanageRouter = new Router({ prefix: '/db' });

dbmanageRouter.get('/createbasetables/:secret', DbManageController.createBaseTables);
dbmanageRouter.get('/initdbbasedata/:secret', DbManageController.initDatabaseData);

export default dbmanageRouter;
