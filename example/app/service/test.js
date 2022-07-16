'use strict';

const { Service } = require('egg');
class TestService extends Service {


  async getServiceData() {
    const { app } = this;
    app.logger.info('[egg-grpc-server] grpc插件调用逻辑进入service层~');
    return {
      name: 'getServiceData',
      description: '公众号：Rong姐姐好可爱',
    };
  }

}

module.exports = TestService;
