'use strict';

// 引用插件基类
const { GrpcBaseController } = require('@142vip/egg-grpc-server');
const { returnFormat } = require('../common/response-format');

/**
 * 用例控制器，插件对该类进行封装，只需要按照类定义方法来编写代码即可，上手简单
 * - 注意继承GrpcBaseController父类，以便使用egg.js框架中的对象、service层等
 */
class FairySisterController extends GrpcBaseController {
  /**
   * 示例函数
   * @param request  请求参数对象
   */
  async sayHello(request) {
    const { ctx } = this;
    try {
      // 参数校验
      ctx.validate(
        {
          name: { type: 'string', required: true },
          age: { type: 'int', required: true },
          description: { type: 'string', required: true },
        },
        request
      );
    } catch (e) {
      return returnFormat(false, '参数错误', 93);
    }

    return returnFormat({
      method: 'sayHello',
      status: true,
      description: '公众号：Rong姐姐好可爱',
    });
  }

  /**
   * 健康检查，参数任意，具体校验可以参考上面用例方法
   * @param request
   */
  async healthCheck(request) {
    const { ctx, app } = this;
    app.logger.info('[egg-grpc-server] 客户端请求的参数：', request);
    const data = await ctx.service.test.getServiceData();
    app.logger.info(
      '[egg-grpc-server] 插件调用service逻辑，返回用例数据:',
      data
    );
    // 插件约定好，返回客户端数据，包裹成对象，通过return返回
    return returnFormat({
      status: true,
      description: '公众号：Rong姐姐好可爱',
    });
  }
}

module.exports = FairySisterController;
