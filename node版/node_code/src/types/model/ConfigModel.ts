type ProgramConfigModel = {
  port: number;
};

type JwtConfigModel = {
  secret: string;
  expiresIn: number; // 小时
};

type DbConfigModel = {
  dbName: string;
  user: string;
  password: string;
  host: string;
  port: number;
};

type RedisModel = {
  port: number;
  host: string;
  username: string;
  password: string;
  db: number;
};

type ResourceModel = {
  tempPath: string;
  avatarPath: string;
};

type ResourceAccessModel = {
  avatar: string;
};

export type ConfigShareModel = {
  db: DbConfigModel;
  program: ProgramConfigModel;
  jwt: JwtConfigModel;
  redis: RedisModel;
  resource: ResourceModel;
  wwwroot: string; // 静态资源根路径
  resourceAccess: ResourceAccessModel; // 静态资源访问名称
};
