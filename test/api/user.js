const { describe, it, beforeEach } = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');
chai.use(chaiHttp);

const { expect } = chai;

describe('/api', function () {
  describe('/user', function () {
    describe('/create', function () {
      it('responds', function () {
        chai.request(app)
          .post('/api/user/create')
          .end(function (err, res) {
            expect(res).to.have.status(200);
          });
      });
    });
  });
});
