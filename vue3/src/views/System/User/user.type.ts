export type TUserRes = {
  id: number;
  user_name: string;
  nick_name: string;
  avatar: string;
  qq: string;
  wechat: string;
  email: string;
  github: string;
  is_del: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TDialogForm = {};

export type TFindAllRoleRes = {
  id: number;
  role_name: string;
};

/**
 * 为某个账户添加某个角色
 */
export type TUserAddRoleParam = {
  user_id: number;
  role_id: number;
};
/**
 * 删除账号某个角色
 */
export type TDeleteUserRoleParams = {
  user_id: number;
  role_id: number;
};

/**
 * 查看账户拥有的角色
 */
export type TFindUserHasRoleRes = {
  id: number;
  role_id: number;
  user_id: number;
  role: {
    id: number;
    role_name: string;
  };
};
