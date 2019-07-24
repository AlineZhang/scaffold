# BFF脚手架预研

## 前言
BFF概念
### 技术栈
 node web:  node、koa2、
 service api: GraphQL
 html-template: react

## 项目使用指南
### 1、安装依赖
#### 开发编译依赖包  
  * 编译工具
  ```
    "webpack": "^4.30.0",
    "webpack-cli": "^3.3.1",
    "webpack-dev-server": "^3.3.1",
    "webpack-node-externals": "^1.7.2"
  ```

  * 本地服务
  ```
    "mz": "^2.7.0", // node服务API的封装
    "koa": "^2.7.0",  // 服务
    "koa-body": "^4.1.0", // 内容解析
    "koa-compose": "^4.1.0", // ?
    "koa-router": "^7.4.0", // 路由处理
    "koa-static": "^5.0.0", // 静态资源处理
  ```

  * ES6+ babel依赖包及配置文件
  ```
    "babel-core": "^6.26.3",
    "babel-loader": "^7.1.5",
    "babel-plugin-transform-runtime": "^6.23.0",
    "babel-preset-env": "^1.7.0",
    "babel-preset-react": "^6.24.1",
    "babel-register": "^6.26.0",
  ```
  babel配置文件 .bablerc
  ```
    "presets": [ "env", "react" ],
    "plugins": ["transform-runtime"]
  ```


  * css 预处理器  css/less/sass/stylus
  ```
    //- 基础css编译
    "css-loader": "^3.1.0",
    "style-loader": "^0.23.1",
    //- 预处理器编译
    "postcss-loader": "^3.0.0",
    "postcss-preset-env": "^6.7.0",
    "less": "^3.9.0",
  ```
  
  * html 模板解析
  ```
    "react": "^16.8.6",
    "react-dom": "^16.8.6",
    "react-router-dom": "^5.0.0"
  ```

