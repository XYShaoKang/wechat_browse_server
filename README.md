# 微信聊天记录查询服务器

## 使用前提

- 需要 Prisma 服务器
  - [在本地 Docker 部署](https://www.prisma.io/docs/1.30/get-started/01-setting-up-prisma-new-database-TYPESCRIPT-t002/#install-docker)
- 复制`.env.example`为`.env`,并填写对应的值

```sh
# env
PRISMA_MANAGEMENT_API_SECRET= [PRISMA 服务器管理密码,如果没有可以忽略]
PRISMA_SERVER_SECRET= [PRISMA 端点密码,如果没有可以忽略]
PRISMA_SERVER_ENDPOINT= <PRISMA 端点 Url>
APP_SECRET= <用户认证加密密钥>
```

## 运行

```sh
yarn install # 安装依赖
yarn deploy # 将服务配置部署到Prisma服务
yarn start # 运行查询服务器
```

## 其他命令

```sh
yarn play # 打开 GraphQL Playground
yarn admin # 打开 Prisma Admin
```
