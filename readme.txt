1. 介绍

zhuz-admin 个人封装的简易的后台框架

ui-个人
配色-参照若依

后端
koa2+ts+mysql+redis
前端
vue3+ts+tailwindcss+vite

路由/控制器/dto,服务,实体,工具拆分(router,service,entity,helper)
分环境加载配置文件(share)
全局统一异常捕获,灵活错误提示(exception.middleware)
全局统一响应数据结构(response.middleware)
通过接口对数据库生成表和初始化数据操作
日志管理
生成uuid,验证码,存储uuid验证码到redis,验证客户端请求uuid跟验证码
jwt鉴权,密码hash加密
joi参数校验,灵活错误提示
文件上传中间件封装
apipost 接口文件

node v16.20.1

yarn v1.22.19 (可选)


2. 运行

- 开发环境

npm run dev
or
yarn dev

- 部署生产

npm run prod
or
yarn prod