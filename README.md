## @142vip/egg-grpc-server

#### 可能有用

- 客户端插件：[egg-grpc-client](https://github.com/142vip/egg-grpc-client)
- 服务端插件：[egg-grpc-server](https://github.com/142vip/egg-grpc-server)

#### 功能规划

- [x] grpc server自定义配置,平滑启动服务端
- [x] 支持agent.js 单例挂载
- [x] app.js 多worker工作进程挂载，但存在端口冲突
- [x] proto文件自动扫描、解析，支持语法报错检查
- [x] js类自动实例化，仿Controller写法，最大限度支持egg.js框架
- [x] 多worker启动，端口冲突解决 , 灵活配置agent加载
- [x] 日志优化，插件集成egg.js日志，方便进行切割与划分

#### 安装

```bash
## 安装插件
npm install @142vip/egg-grpc-server --save

## 安装指定版本
npm install @142vip/egg-grpc-server@xxx --save
```

#### 快速使用

```js
// {app_root}/config/plugin.js
exports.grpcServer = {
    enable: true,
    package: '@142vip/egg-grpc-server',
};
```

#### 配置

```js
// {app_root}/config/config.default.js
exports.grpcServer = {
    protoDir: 'app/grpc',   // 存放proto文件的目录，扫描.proto后缀文件
    serviceDir: 'app/grpc', // 存放服务端远程方法的目录，扫描.js后缀文件
    host: '127.0.0.1',      // 服务主机ip，建议填写0.0.0.0
    port: '50051',          // grpc服务端口
    loaderOptions: {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
    },
    agent: false,          // 是否在agent.js中加载，默认false
    app: true,             // 是否在app.js中加载，默认true
};


// 用户配置会和默认配置进行对象深拷贝
exports.grpcServer = {
    ...
}

```

查看默认配置 [config/config.default.js](config/config.default.js)

#### 使用示例

新建fairySister.js文件

```js
// {app_root}/app/grpc/fairySister.js
'use strict';

const {GrpcBaseController} = require('egg-grpc-server')

class FairySisterController extends GrpcBaseController {


    /**
     * 调用示例
     * @param request 请求参数，已封装成对象，具体属性可自行解构
     * @returns{Object} 返回值，建议返回对象
     */
    async sayHello(request) {
        // 可以从this对象中解构出ctx和app，类似与egg中controller
        const {ctx} = this;
        const {username, password} = request
        // 支持service调用 ctx.sevice.xxxx
        // 返回对象，方便对应客户端解析
        return {username, password}
    }


    /**
     * 健康检查
     * @param data 请求参数，已封装成对象，具体属性可自行解构
     * @returns{Object} 返回值，建议返回对象
     */
    async healthCheck(request) {
        const {ctx} = this
        // 注意校验规则
        ctx.validate({}, request)

        return {started: true}
    }
}

```

新建fairySister.proto文件

```protobuf
// {app_root}/app/grpc/fairySister.proto

syntax = "proto3";

package FairySister;

// 服务 可以有多个 , 但约定为一个
service vip {
  rpc sayHello (RequestData) returns (ResponseData) {}
  rpc healthCheck (RequestData) returns (ResponseData) {}
}

// grpc请求体结构 约定，无序改动
message RequestData {
  string data = 1;
}

// grpc响应体结构 约定，无序改动
message ResponseData {
  string data = 1;
}
```

以上两个文件名称没有强制要求统一，但请注意：

- .js文件建议导出class文件，并且继承`GrpcBaseController`类方便集成到egg.js中
- .proto文件需要遵循protobuf规范，但注意插件本身封装的强约束
- 建议用户只需要关注package、service、rpc这三部分，并且packageName 和 serviceName建议唯一，rpcName即对应方法可有多个，名称也唯一

完成上述配置后，便可以如普通插件一样，执行npm指令启动egg项目，可以在启动日志中看到grpc服务端启动成功

![img.png](./grpc-server-started.png)

关于插件的任何问题，欢迎issues交流。详细grpc客户端、服务端插件使用，可以查看插件示例[egg-grpc-demo](https://github.com/142vip/egg-grpc-demo)

#### 证书

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
