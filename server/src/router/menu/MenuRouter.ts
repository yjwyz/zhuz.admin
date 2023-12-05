import Router from 'koa-router';
import { jwt_admin_middleware, jwt_base_middleware } from '../../middleware/JWTMiddleware';
import MenuController from './MenuController';

const menuRouter = new Router({ prefix: '/menu' });
menuRouter.use(jwt_base_middleware as any);

const authRouter = new Router({ prefix: '/auth' });
authRouter.get('/readcurrentusermenus', MenuController.findCurrentUserMenus);

const adminRouter = new Router({ prefix: '/admin' });
// adminRouter.use(jwt_admin_middleware as any);
adminRouter.post('/addonemenu', MenuController.addMenu);
adminRouter.del('/delonemenu/:menuId', MenuController.delMenu);
adminRouter.put('/putmenu', MenuController.putMenu);
adminRouter.get('/findmenu/:menuId', MenuController.findMenu);
adminRouter.get('/findallmenu', MenuController.findAllMenu);
adminRouter.post('/roleupdatemenus', MenuController.roleUpdateMenus);
adminRouter.post('/roledelmenu', MenuController.roleDelMenu);
adminRouter.get('/readroleallmenu/:roleId', MenuController.findRoleMenus);

menuRouter.use(authRouter.routes());
menuRouter.use(adminRouter.routes());

export default menuRouter;
