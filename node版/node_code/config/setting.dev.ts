import { ConfigShareModel } from '../src/types/model/ConfigModel';

const _config: ConfigShareModel = {
  db: {
    dbName: 'dbName',
    host: '1.1.1.1',
    port: 3306,
    user: '1',
    password: '123456'
  },
  program: {
    port: 9090
  },
  jwt: {
    secret: 'sdqwesdqweqweqwsdqweqwee',
    expiresIn: 1
  },
  redis: {
    host: '1.1.1.1',
    port: 6379,
    db: 7,
    password: '',
    username: ''
  },
  wwwroot: 'wwwroot',
  resource: {
    tempPath: 'temp',
    avatarPath: 'avatar'
  },
  resourceAccess: {
    avatar: '/avatar'
  }
};

export default _config;
