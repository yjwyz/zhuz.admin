export const UserResKeys = [
  'user_name',
  'nick_name',
  'id',
  'avatar',
  'qq',
  'wechat',
  'email',
  'github',
  'is_del',
  'createdAt',
  'updatedAt'
];
export type UserRes = {
  user_name: string;
  nick_name: string;
  id: number;
  avatar: string;
  qq: string;
  wechat: string;
  email: string;
  github: string;
  is_del: boolean;
  createdAt: Date;
  password?: string;
  updatedAt: Date;
};

// 修改当前密码
export type PutPasswordReq = {
  oldPass: string;
  newPass: string;
  confirmPass: string;
};

// 获取某个用户信息
export type GetUserInfoReq = {
  userId?: number;
  userName?: string;
};

// 创建用户
export type CreateUserReq = {
  id?: number;
  user_name: string;
  password: string;
  nick_name: string;
  avatar?: string;
  qq?: string;
  wechat?: string;
  email?: string;
  github?: string;
  is_del?: boolean;
};

// 修改当前用户信息
export type PutUserInfoReq = {
  nick_name?: string;
  qq?: string;
  wechat?: string;
  email?: string;
  github?: string;
};

// 注册
export type RegisterReq = {
  username: string; // 账号
  password: string; // 密码
  repeat_password: string; // 确认密码
  code: string; // 验证码
  uuid: string; // 会话id
};

// 登录
export type LoginReq = Omit<RegisterReq, 'repeat_password'>;
