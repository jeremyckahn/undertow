const { describe, it, before, beforeEach } = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');
const MockDataAdapter = require('../utils/mock-data-adapter');
chai.use(chaiHttp);

const { expect } = chai;

describe('/api', function () {
  before(function () {
    const dataAdapter = new MockDataAdapter();
    return dataAdapter.connect().then(_ => app.start(dataAdapter));
  });

  describe('/user', function () {
    describe('/create', function () {
      it('responds', () =>
        chai.request(app)
          .post('/api/user/create')
          .then(res =>
            expect(res).to.have.status(200)
          )
      );
    });
  });
});
