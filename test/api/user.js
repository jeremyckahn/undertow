const { describe, it, before, beforeEach } = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const _ = require('lodash');
const app = require('../../app');
const DataAdapter = require('../../db/data-adapter');
const MockDataAdapter = require('../utils/mock-data-adapter');
chai.use(chaiHttp);

const { expect } = chai;

const {
  newUserName,
  newUserPassword,
  existingUserName,
  existingUserPassword,
  existingUserId,
  tempUserId
} = MockDataAdapter;

describe('/api', function () {
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
      const name = newUserName;
      const password = newUserPassword;
      const id = tempUserId;

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
          .send({ name: MockDataAdapter.existingUserName, password: '_' })
          .then(res =>
            expect(res)
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
                .to.have.deep.property('body')
                  .that
                  .deep.equals({
                    errorMessage: DataAdapter.INVALID_CREDENTIALS
                  })
            )
        );
      });

      describe('valid credentials', function () {
        const name = existingUserName;
        const id = existingUserId;
        const password = existingUserPassword;

        it('returns a cookied response with a user object', () =>
          chai.request(app)
            .post('/api/user/login')
            .send({ name, password })
            .then(res =>
              expect(res)
                .to.have.header('Set-Cookie', /sid=.*;/)
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
      });
    });

    describe('/logout', function () {
      it('responds', () =>
        chai.request(app)
          .post('/api/user/logout')
          .then(res =>
            expect(res).to.have.status(200)
          )
      );

      describe('pre-login', function () {
        it('returns error object', () =>
          chai.request(app)
            .post('/api/user/logout')
            .then(res =>
              expect(res)
                .to.have.deep.property('body')
                .that
                .deep.equals({
                  errorMessage: DataAdapter.NOT_LOGGED_IN
                })
            )
        );
      });

      describe('post-login', function () {
        let agent;
        beforeEach(function () {
          const name = existingUserName;
          const password = existingUserPassword;
          agent = chai.request.agent(app);

          return agent
            .post('/api/user/login')
            .send({ name, password });
        });

        it('logs the user out', () =>
          agent.post('/api/user/logout')
            .then(res =>
              expect(res)
                .to.have.deep.property('body')
                .that
                .equals(true)
            )
        );
      });
    });

    describe('/logged-in', function () {
      const name = existingUserName;
      const password = existingUserPassword;

      it('responds', () =>
        chai.request(app)
          .post('/api/user/logged-in')
          .then(res =>
            expect(res).to.have.status(200)
          )
      );

      describe('not logged in', function () {
        it('returns correct response', () =>
          chai.request(app)
            .post('/api/user/logged-in')
            .then(res =>
              expect(res)
                .to.have.deep.property('body')
                .that
                .equals(false)
            )
        );
      });

      describe('logged in', function () {
        let agent;
        beforeEach(function () {
          agent = chai.request.agent(app);

          return agent
            .post('/api/user/login')
            .send({ name, password });
        });

        it('returns correct response', () =>
          agent.post('/api/user/logged-in')
            .then(res =>
              expect(res)
                .to.have.deep.property('body')
                .that
                .equals(true)
            )
        );
      });

      describe('post-login/logout sequence', function () {
        let agent;
        beforeEach(function () {
          agent = chai.request.agent(app);

          return agent
            .post('/api/user/login')
            .send({ name, password })
            .then(() =>
              agent.post('/api/user/logout')
            );
        });

        it('returns correct response', () =>
          agent.post('/api/user/logged-in')
            .then(res =>
              expect(res)
                .to.have.deep.property('body')
                .that
                .equals(false)
            )
        );
      });
    });
  });
});
