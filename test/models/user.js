const { describe, it, beforeEach } = require('mocha');
const chai = require('chai');
const { expect } = chai;

const User = require('../../models/user');
const DataAdapter = require('../../db/data-adapter');
const MockDataAdapter = require('../utils/mock-data-adapter');
const { tempUserId } = MockDataAdapter;

describe('User model', function () {
  describe('constructor', function () {
    it('stores name', function () {
      let user = new User({ name: 'user-name' });
      expect(user.name).to.equal('user-name');
    });

    it('stores id', function () {
      const id = '11111';
      let user = new User({ id });
      expect(user.id).to.equal(id);
    });

    describe('instance properties', function () {
      describe('isTempUser', function () {
        it('is correct when user name is provided', function () {
          let user = new User({ name: 'user-name' });
          expect(user.isTempUser).to.equal(false);
        });

        it('is correct when user name is not provided', function () {
          let user = new User();
          expect(user.isTempUser).to.equal(true);
        });
      });

      describe('dataAdapter', function () {
        it('receives and instantiates a DataAdapter', function () {
          let user = new User({ dataAdapter: new MockDataAdapter() });
          expect(user.dataAdapter).to.be.an.instanceof(MockDataAdapter);
        });
      });
    });

    describe('static methods', function () {
      describe('create', function () {
        it('exists', function () {
          expect(User).itself.to.respondTo('create');
        });

        describe('sufficient arguments', function () {
          describe('given valid arguments', function () {
            it('returns a non-temporary User instance', function () {
              const opts = {
                name: 'test-user',
                password: 'password',
                dataAdapter: new MockDataAdapter()
              };
              const promise = User.create(opts);

              return promise.then(user => {
                expect(user).to.be.an.instanceof(User);
                expect(user.name).to.equal(opts.name);
                expect(user.id).to.equal(tempUserId);
                expect(user.isTempUser).to.equal(false);
              });
            });
          });

          describe('user exists', function () {
            it('returns an error object', function () {
              const promise = User.create({
                name: MockDataAdapter.existingUserName,
                password: '_',
                dataAdapter: new MockDataAdapter()
              });

              return promise.catch(
                err => expect(err)
                  .to.deep.equal({
                    errorMessage: DataAdapter.USER_EXISTS
                  })
              );
            });
          });

          describe('given invalid arguments', function () {
            it('returns an error', function () {
              const promise = User.create({
                name: 1,
                password: 2,
                dataAdapter: new MockDataAdapter()
              });

              return promise.catch(
                err => expect(err)
                  .to.deep.equal({
                    errorMessage: User.INSUFFICIENT_ARGUMENTS
                  })
              );
            });
          });
        });

        describe('insufficient arguments', function () {
          it('returns an error', function () {
            const promise = User.create({ name: 'some-user' });

            return promise.catch(
              err => expect(err)
                .to.deep.equal({
                  errorMessage: User.INSUFFICIENT_ARGUMENTS
                })
            );
          });
        });
      });

      describe('doesExist', function () {
        it('exists', function () {
          expect(User).itself.to.respondTo('doesExist');
        });

        describe('lookup by name', function () {
          describe('user exists', function () {
            it('returns correct result', () =>
              User.doesExist({
                dataAdapter: new MockDataAdapter(),
                name: MockDataAdapter.existingUserName
              })
              .then(
                doesUserExist => expect(doesUserExist).to.equal(true)
              )
            );
          });

          describe('user does not exist', function () {
            it('returns correct result', () =>
              User.doesExist({
                dataAdapter: new MockDataAdapter(),
                name: MockDataAdapter.nonExistingUserName
              })
              .then(
                doesUserExist => expect(doesUserExist).to.equal(false)
              )
            );
          });
        });

        describe('lookup by id', function () {
          describe('user exists', function () {
            it('returns correct result', () =>
              User.doesExist({
                dataAdapter: new MockDataAdapter(),
                id: MockDataAdapter.existingUserId
              })
              .then(
                doesUserExist => expect(doesUserExist).to.equal(true)
              )
            );
          });

          describe('user does not exist', function () {
            it('returns correct result', () =>
              User.doesExist({
                dataAdapter: new MockDataAdapter(),
                id: MockDataAdapter.nonExistingUserId
              })
              .then(
                doesUserExist => expect(doesUserExist).to.equal(false)
              )
            );
          });
        });
      });
    });

    describe('instance methods', function () {
      describe('toJSON', function () {
        let user;
        beforeEach(function () {
          user = new User({
            name: 'invalid-user'
            ,id: '22222'
            ,dataAdapter: new MockDataAdapter()
          });
        });

        it('exists', function () {
          expect(user).to.respondTo('toJSON');
        });

        it('contains expected properties', function () {
          expect(user.toJSON()).to.deep.equal({
            name: 'invalid-user',
            id: '22222',
            isTempUser: false
          });
        });
      });
    });
  });
});
