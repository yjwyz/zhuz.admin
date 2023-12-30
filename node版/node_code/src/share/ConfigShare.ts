import devConfig from '../../config/setting.dev';
import prodConfig from '../../config/setting.prod';
import { ConfigShareModel } from '../types/model/ConfigModel';

export default {
  dev: devConfig,
  prod: prodConfig
}[process.argv[2] || 'dev'] as ConfigShareModel;
