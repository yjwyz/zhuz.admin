import Router from 'koa-router';
import UserController from './UserController';
import {
  jwt_admin_middleware,
  jwt_base_middleware,
  jwt_root_middleware
} from '../../middleware/JWTMiddleware';
import uploadMiddleware from '../../middleware/UploadMiddleware';

const userRouter = new Router({ prefix: '/user' });

const releaseRouter = new Router({ prefix: '/release' });
releaseRouter.get('/getcaptcha', UserController.getCaptcha);
releaseRouter.post('/register', UserController.register);
releaseRouter.post('/login', UserController.login);

const authRouter = new Router({ prefix: '/auth' });
authRouter.use(jwt_base_middleware as any);
authRouter.get('/getuserinfo', UserController.getUserInfo);
authRouter.put('/putpassword', UserController.putPassword);
authRouter.put('/putuserinfo', UserController.putUserInfo);
authRouter.put(
  '/putavatar',
  uploadMiddleware({
    maxSize: 3,
    mimeTypes: ['image/png', 'image/jpeg']
  }).single('avatar') as any,
  UserController.putAvatar
);

const adminRouter = new Router({ prefix: '/admin' });
adminRouter.use(jwt_base_middleware as any);
adminRouter.use(jwt_admin_middleware as any);
adminRouter.get('/readallusers', UserController.findAllUser);
adminRouter.put('/disuser/:userId', UserController.disUser);
adminRouter.put('/enbuser/:userId', UserController.enbuser);

const rootRouter = new Router({ prefix: '/root' });
rootRouter.use(jwt_base_middleware as any);
rootRouter.use(jwt_root_middleware as any);
rootRouter.put('/revokeuseradmin/:userId', UserController.revokeUserAdmin);
rootRouter.put('/adduseradmin/:userId', UserController.addUserAdmin);
rootRouter.put('/restuserpass/:userId', UserController.resetUserPass);

userRouter.use(releaseRouter.routes());
userRouter.use(authRouter.routes());
userRouter.use(adminRouter.routes());
userRouter.use(rootRouter.routes());

export default userRouter;
