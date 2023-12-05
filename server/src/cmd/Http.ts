import Koa from 'koa';
import http from 'http';
import { getIpAddress } from '../utils/IpUtil';

export function createKoa(): Koa<Koa.DefaultState, Koa.DefaultContext> {
  const app = new Koa();
  return app;
}

export function run(koa: Koa<Koa.DefaultState, Koa.DefaultContext>, port: number = 9090) {
  const server = http.createServer(koa.callback());

  server.listen(port);

  server.on('error', (err: Error) => {
    console.log(err);
  });

  server.on('listening', () => {
    const ip = getIpAddress();
    const address = `http://${ip}:${port}`;
    const localAddress = `http://localhost:${port}`;
    console.log(`app started at address \n${localAddress}\n${address}`);
  });
}
