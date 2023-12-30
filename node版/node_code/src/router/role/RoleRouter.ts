import Router from 'koa-router';
import { jwt_admin_middleware, jwt_base_middleware } from '../../middleware/JWTMiddleware';
import RoleController from './RoleController';

const roleRouter = new Router({ prefix: '/role' });
roleRouter.use(jwt_base_middleware as any);

const authRouter = new Router({ prefix: '/auth' });
authRouter.get('/getcurrentuserrole', RoleController.findUserOneRole);

const adminRouter = new Router({ prefix: '/admin' });
adminRouter.use(jwt_admin_middleware as any);
adminRouter.post('/addrolecategory', RoleController.addRole);
adminRouter.del('/removerolecategory/:roleId', RoleController.delRole);
adminRouter.put('/putrolecategory', RoleController.putRole);
adminRouter.get('/findrole/:roleId', RoleController.findRole);
adminRouter.get('/findallrole', RoleController.findAllRole);
adminRouter.post('/addroletheuser', RoleController.userAddRole);
adminRouter.post('/delroletheuser', RoleController.delUserRole);
adminRouter.get('/getuserallrole/:userId', RoleController.findUserAllRole);

roleRouter.use(authRouter.routes());
roleRouter.use(adminRouter.routes());

export default roleRouter;
