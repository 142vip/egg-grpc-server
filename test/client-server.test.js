'use strict';

const mock = require('egg-mock');

describe('test/client-server.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/client-server-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('should GET /', () => {
    return app.httpRequest()
      .get('/')
      .expect('hi, clientServer')
      .expect(200);
  });
});
