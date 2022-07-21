## @142vip/egg-grpc-server插件使用示例

### 快速开始

安装@142vip/egg-grpc-server插件

```bash
## 安装最新版本
npm install @142vip/egg-grpc-server
## 安装指定版本
npm install @142vip/egg-grpc-server@xxx
```

在config.js中配置：

```javascript
// 默认配置
config.grpcServer = {
    protoDir: 'app/grpc', // 存放proto文件的目录，扫描.proto后缀文件
    serviceDir: 'app/grpc', // 存放服务端远程方法的目录，扫描.js后缀文件
    host: '127.0.0.1', // 服务主机ip，建议填写0.0.0.0
    port: '50051', // grpc服务端口
    loaderOptions: {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
    },
    agent: false, // 是否在agent.js中加载，默认false
    app: true,
};
```

按照配置中`protoDir`和`serviceDir`字段来确定对应的`js`和`proto`，例如，新建app/grpc目录，写下对应的proto文件和js函数类，可以直接看示例

### 运行项目

```bash
## 安装依赖
npm install
## 运行项目
npm run dev
## 可以看到grpc和服务启动的日志输出
2022-07-21 10:45:15,258 INFO 99110 [master] egg version 2.36.0
2022-07-21 10:45:16,197 INFO 99110 [master] agent_worker#1:99112 started (937ms)
2022-07-21 10:45:17,293 INFO 99113 [egg-grpc-server] grpc server will be loaded on app.js
2022-07-21 10:45:17,328 INFO 99113 [egg-grpc-server] grpc server started at http://127.0.0.1:50051 (34ms)
2022-07-21 10:45:17,337 INFO 99110 [master] egg started on http://127.0.0.1:8848 (2079ms)

## 打开浏览器，访问grpc示例
open http://127.0.0.1:8848 

```

### 部署

```bash
## 启动服务
npm run start
## 暂停服务
npm run stop
```

小技巧：在生产环境采用`npm run start`启动服务，由于egg.js的master-worker架构，会启动多个worker（根据cpu核数确定），导致配置app启动时grpc-server端口会存在冲突；

在日志中可以明显看见，但实际上只要配置正确存在一个worker启动grpc-server服务，解决日志报错推荐config配置为：

```javascript
// 配置只在agent时候启动，只有一个实例，不存在端口冲突
exports.grpcServer = {
    ...,
    app: false,
    agent: true
}
```

### 证书

```text
MIT License

Copyright (c) 2022 142vip FairySister Rong姐姐好可爱

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```