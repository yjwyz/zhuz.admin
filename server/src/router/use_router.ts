import koaBody from 'koa-body';
import type Koa from 'koa';
import userRouter from './user/UserRouter';
import dbmanageRouter from './dbmanage/DBManageRouter';
import testRouter from './test/TestRouter';
import roleRouter from './role/RoleRouter';
import menuRouter from './menu/MenuRouter';

export default function useRouter(koa: Koa<Koa.DefaultState, Koa.DefaultContext>) {
  koa.use(koaBody({ multipart: false }));
  koa.use(testRouter.routes());
  koa.use(dbmanageRouter.routes());
  koa.use(userRouter.routes());
  koa.use(roleRouter.routes());
  koa.use(menuRouter.routes());
}
