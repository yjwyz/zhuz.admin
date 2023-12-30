export type LoginApiParam = {
  username: string; // 账号
  password: string; // 密码
  code: string; // 验证码
  uuid: string; // 会话id
};

export type RegisterApiParam = LoginApiParam & {
  repeat_password: string;
};
