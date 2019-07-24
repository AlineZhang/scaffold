
## 管理端

## 服务端
```{
  "name": "koa-example",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "open:server": "node ./dist/server",
    "start:server": "npm run build:server&& npm run open:server",
    "restart:server": "npm run clean&&npm run build:server&& npm run open:server",
    "build": "webpack",
    "clean": "rm -rf ./dist",
    "build:server": "webpack --config webpack.config.server.js",
    "dev": "webpack && node ./dist/server "
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "koa": "^2.7.0",
    "koa-body": "^4.1.0",
    "koa-compose": "^4.1.0",
    "koa-router": "^7.4.0",
    "koa-static": "^5.0.0",
    "mz": "^2.7.0",
    "react": "^16.8.6",
    "react-dom": "^16.8.6",
    "react-router-dom": "^5.0.0"
  },
  "devDependencies": {
    "babel-core": "^6.26.3",
    "babel-loader": "^7.1.5",
    "babel-plugin-transform-runtime": "^6.23.0",
    "babel-preset-env": "^1.7.0",
    "babel-preset-react": "^6.24.1",
    "babel-register": "^6.26.0",
    "express": "^4.16.4",
    "webpack": "^4.30.0",
    "webpack-cli": "^3.3.1",
    "webpack-dev-server": "^3.3.1",
    "webpack-node-externals": "^1.7.2"
  }
}
```