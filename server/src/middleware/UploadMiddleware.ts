import Multer from '@koa/multer';
import { extname, parse } from 'path';
import { HttpException } from '../utils/ResUtil';
import { getStaticRootFolderPath } from '../helper/StreamHelper';
import ConfigShare from '../share/ConfigShare';

export type UploadOptions = {
  maxSize: number;
  mimeTypes: string[];
};

export default function uploadMiddleware(option: UploadOptions) {
  return Multer({
    storage: Multer.diskStorage({
      destination: getStaticRootFolderPath(ConfigShare.resource.tempPath),
      filename: (_, file, callback) => {
        const entend = extname(file.originalname);
        const name = parse(file.originalname)['name'];
        const fileName = `${name}_${new Date().getTime() + entend}`; // 自定义文件名
        return callback(null, fileName);
      }
    }),
    limits: { fileSize: Math.pow(1024, 2) * option.maxSize }, // 单位/M
    fileFilter(_, file, callback) {
      if (!option.mimeTypes.includes(file.mimetype)) {
        callback(new HttpException('文件类型错误'), false);
      } else {
        callback(null, true);
      }
    }
  });
}
