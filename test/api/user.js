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

  describe('calls to nonexistent methods', function () {
    it('returns a 404', function (done) {
      chai.request(app)
        .post('/api/user/some-nonexistent-endpoint')
        .end(res => {
          expect(res).to.have.status(404);
          done();
        });
    });
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

    describe('/does-exist', function () {
      it('responds', () =>
        chai.request(app)
          .post('/api/user/does-exist')
          .then(res =>
            expect(res).to.have.status(200)
          )
      );

      describe('lookup by name', function () {
        describe('user exists', function () {
          it('returns correct result', () =>
            chai.request(app)
              .post('/api/user/does-exist')
              .send({ name: MockDataAdapter.existingUserName })
              .then(res =>
                expect(res)
                  .to.have.status(200)
                  .and
                  .to.have.deep.property('body')
                    .that
                    .deep.equals({
                      doesExist: true
                    })
              )
          );
        });

        describe('user does not exist', function () {
          it('returns correct result', () =>
            chai.request(app)
              .post('/api/user/does-exist')
              .send({ name: MockDataAdapter.nonExistingUserName })
              .then(res =>
                expect(res)
                  .to.have.status(200)
                  .and
                  .to.have.deep.property('body')
                    .that
                    .deep.equals({
                      doesExist: false
                    })
              )
          );
        });
      });

      describe('lookup by id', function () {
        describe('user exists', function () {
          it('returns correct result', () =>
            chai.request(app)
              .post('/api/user/does-exist')
              .send({ id: MockDataAdapter.existingUserId })
              .then(res =>
                expect(res)
                  .to.have.status(200)
                  .and
                  .to.have.deep.property('body')
                    .that
                    .deep.equals({
                      doesExist: true
                    })
              )
          );
        });

        describe('user does not exist', function () {
          it('returns correct result', () =>
            chai.request(app)
              .post('/api/user/does-exist')
              .send({ id: MockDataAdapter.nonExistingUserId })
              .then(res =>
                expect(res)
                  .to.have.status(200)
                  .and
                  .to.have.deep.property('body')
                    .that
                    .deep.equals({
                      doesExist: false
                    })
              )
          );
        });
      });
    });

    describe('/login', function () {
      it('responds', () =>
        chai.request(app)
          .post('/api/user/login')
          .then(res =>
            expect(res).to.have.status(200)
          )
      );

      describe('invalid credentials', function () {
        it('returns error object', () =>
          chai.request(app)
            .post('/api/user/login')
            .send({})
            .then(res =>
              expect(res)
                .to.have.status(200)
                .and
                .to.have.deep.property('body')
                  .that
                  .deep.equals({
                    errorMessage: 'invalid credentials'
                  })
            )
        );
      });
    });
  });
});
