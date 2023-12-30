import { createKoa, run } from './cmd/Http';
import { loggerMiddleware } from './helper/Log4jsHelper';
import useStaticAccessPaths from './helper/StaticHelper';
import { useStaticResourceFolder } from './helper/StreamHelper';
import exceptionMiddleware from './middleware/ExceptionMiddleware';
import responseMiddleware from './middleware/ResponseMiddleware';
import useRouter from './router/use_router';
import ConfigShare from './share/ConfigShare';

const app = createKoa();

app.use(loggerMiddleware);

app.use(exceptionMiddleware);

useRouter(app);

useStaticResourceFolder();

useStaticAccessPaths(app);

app.use(responseMiddleware);

run(app, ConfigShare.program.port);
