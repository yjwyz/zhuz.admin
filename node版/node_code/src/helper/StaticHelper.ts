import type Koa from 'koa';
import mount from 'koa-mount';
import ConfigShare from '../share/ConfigShare';
import serve from 'koa-static';
import { join } from 'path';

export default function useStaticAccessPaths(koa: Koa<Koa.DefaultState, Koa.DefaultContext>) {
  koa.use(
    mount(
      ConfigShare.resourceAccess.avatar,
      serve(join(__dirname, '../../', ConfigShare.wwwroot, ConfigShare.resource.avatarPath))
    )
  );
}
