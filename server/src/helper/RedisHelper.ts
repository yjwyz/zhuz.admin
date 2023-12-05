import IRedis from 'ioredis';
import ConfigShare from '../share/ConfigShare';
import { logger } from './Log4jsHelper';

const redisConfig = ConfigShare.redis;

const redis = new IRedis({
  port: redisConfig.port,
  host: redisConfig.host,
  username: redisConfig.username,
  password: redisConfig.password,
  db: redisConfig.db,
  maxRetriesPerRequest: 10,
  retryStrategy: function (times) {
    if (times > 10) {
      return undefined;
    }
    return Math.min(times * 5000, 2000);
  }
});

redis.on('error', function (err) {
  logger.error('Redis 连接发生异常:', err);
  console.log('Redis 连接发生异常:', err);
});

redis.on('ready', () => {
  console.log('Redis Connection successful .');
});

export default redis;
