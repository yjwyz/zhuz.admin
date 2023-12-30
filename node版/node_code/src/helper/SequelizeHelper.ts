import { Sequelize } from 'sequelize';
import ConfigShare from '../share/ConfigShare';
import { logger } from './Log4jsHelper';

function createSequelize(): Sequelize {
  const db = ConfigShare.db;

  return new Sequelize(db.dbName, db.user, db.password, {
    dialect: 'mysql',

    host: db.host,

    port: db.port,

    timezone: '+08:00',

    logging: false,

    define: {
      timestamps: false,
      underscored: true,
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    }
  });
}

const sequelize = createSequelize();

sequelize
  .authenticate()
  .then(() => {
    console.log('Database Connection successful .');
  })
  .catch((err: Error) => {
    console.log('Database Connection Error!!!!!! .', err);
    logger.error(err);
  });

export default sequelize;
