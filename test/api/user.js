const { describe, it, before, beforeEach } = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const _ = require('lodash');
const app = require('../../app');
const DataAdapter = require('../../db/data-adapter');
const MockDataAdapter = require('../utils/mock-data-adapter');
chai.use(chaiHttp);

const { expect } = chai;

const testUserProps = {
  name: 'test-user',
  password: 'password'
};

describe('/api', function () {
  const { name, password } = testUserProps;
  const id = MockDataAdapter.tempUserId;

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

      it('returns user data upon success', () =>
        chai.request(app)
          .post('/api/user/create')
          .send({ name, password })
          .then(res =>
            expect(res)
              .to.have.status(200)
              .and
              .to.have.deep.property('body')
                .that
                .deep.equals({
                  isTempUser: false,
                  id,
                  name
                })
          )
      );

      it('returns error if user already exists', () =>
        chai.request(app)
          .post('/api/user/create')
          .send({ name: 'existing-user', password: '_' })
          .then(res =>
            expect(res)
              .to.have.status(200)
              .and
              .to.have.deep.property('body')
                .that
                .deep.equals({
                  errorMessage: DataAdapter.USER_EXISTS
                })
          )
      );
    });
  });
});
