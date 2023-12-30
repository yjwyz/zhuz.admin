import Router from 'koa-router';
import { ResultOk } from '../../utils/ResUtil';
import { pipeStream } from '../../helper/StreamHelper';
import ConfigShare from '../../share/ConfigShare';
import uploadMiddleware from '../../middleware/UploadMiddleware';

const testRouter = new Router({ prefix: '/test' });

testRouter.post(
  '/upload',
  uploadMiddleware({
    maxSize: 1,
    mimeTypes: ['image/png', 'image/jpeg']
  }).single('file'),
  async (ctx) => {
    const file = ctx.request.file;
    console.log(file);
    const writePath =
      ConfigShare.wwwroot + '/' + ConfigShare.resource.avatarPath + '/' + file.filename;
    await pipeStream(file.path, writePath);
    ctx.body = ResultOk(file);
  }
);

export default testRouter;
