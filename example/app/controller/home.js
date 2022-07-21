'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;

    ctx.body = {
      grpc: ctx.grpcServer,
    };
  }
}

module.exports = HomeController;
