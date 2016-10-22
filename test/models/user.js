const { describe, it, beforeEach } = require('mocha');
const chai = require('chai');
const { expect } = chai;

const User = require('../../models/user');
const DataAdapter = require('../../db/data-adapter');
const MockDataAdapter = require('../utils/mock-data-adapter');

const {
  tempUserId,
    newUserName,
    newUserId,
    newUserEmail,
    newUserPassword,
    existingUserName,
    existingUserEmail,
    existingUserPassword,
    existingUserId,
    nonExistingUserName,
    nonExistingUserEmail,
    nonExistingUserId
} = MockDataAdapter;

describe('User model', function () {
  let dataAdapter;
  beforeEach(function () {
    dataAdapter = new MockDataAdapter();
  });

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
          let user = new User({ dataAdapter });
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
          describe('given an invalid email address', function () {
            it('rejects with an error object', function () {
              const promise = User.create({
                name: newUserName,
                email: '-',
                password: newUserPassword,
                dataAdapter
              });

              return promise.catch(
                err => expect(err)
                  .to.deep.equal({
                    errorMessage: User.INVALID_ARGUMENTS
                  })
              );
            });
          });

          describe('given valid arguments', function () {
            it('resolves with a non-temporary User instance', function () {
              const opts = {
                name: newUserName,
                email: newUserEmail,
                password: newUserPassword,
                dataAdapter
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
            it('rejects with an error object', function () {
              const promise = User.create({
                name: existingUserName,
                email: existingUserEmail,
                password: '_',
                dataAdapter
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
            it('rejects with an error object', function () {
              const promise = User.create({
                name: 1,
                password: 2,
                dataAdapter
              });

              return promise.catch(
                err => expect(err)
                  .to.deep.equal({
                    errorMessage: User.INVALID_ARGUMENTS
                  })
              );
            });
          });
        });

        describe('missing arguments', function () {
          it('rejects with an error object', function () {
            const promise = User.create({ name: 'some-user' });

            return promise.catch(
              err => expect(err)
                .to.deep.equal({
                  errorMessage: User.INVALID_ARGUMENTS
                })
            );
          });
        });
      });

      describe('doesExist', function () {
        const name = existingUserName;
        const id = existingUserId;
        const password = existingUserPassword;

        it('exists', function () {
          expect(User).itself.to.respondTo('doesExist');
        });

        describe('lookup by name', function () {
          describe('user exists', function () {
            it('resolves with correct result', () =>
              User
                .doesExist({ dataAdapter, name, password })
                .then(
                  doesUserExist => expect(doesUserExist).to.equal(true)
                )
            );
          });

          describe('user does not exist', function () {
            it('resolves with correct result', () =>
              User
                .doesExist({ dataAdapter, name })
                .then(
                  doesUserExist => expect(doesUserExist).to.equal(false)
                )
            );
          });
        });

        describe('lookup by id', function () {
          describe('user exists', function () {
            it('resolves with correct result', () =>
              User
                .doesExist({ dataAdapter, id, password })
                .then(
                  doesUserExist => expect(doesUserExist).to.equal(true)
                )
            );
          });

          describe('user does not exist', function () {
            it('resolves with correct result', () =>
              User.doesExist({
                dataAdapter,
                id: nonExistingUserId
              })
              .then(
                doesUserExist => expect(doesUserExist).to.equal(false)
              )
            );
          });
        });
      });

      describe('fetch', function () {
        it('exists', function () {
          expect(User).itself.to.respondTo('fetch');
        });

        describe('valid arguments', function () {
          describe('given valid credentials', function () {
            it('resolves with user object', function () {
              const opts = {
                name: existingUserName,
                password: existingUserPassword,
                dataAdapter
              };

              const promise = User.fetch(opts);

              return promise.then(user => {
                expect(user).to.be.an.instanceof(User);
                expect(user.name).to.equal(opts.name);
                expect(user.id).to.equal(existingUserId);
                expect(user.isTempUser).to.equal(false);
              });
            });
          });

          describe('given invalid credentials', function () {
            it('rejects with an error object', function () {
              const promise = User.fetch({
                name: existingUserName,
                password: '_',
                dataAdapter
              });

              return promise.catch(
                err => expect(err)
                  .to.deep.equal({
                    errorMessage: DataAdapter.INVALID_CREDENTIALS
                  })
              );
            });
          });
        });

        describe('invalid arguments', function () {
          it('rejects with an error object', function () {
            const promise = User.fetch({
              name: 1,
              password: 2,
              dataAdapter
            });

            return promise.catch(
              err => expect(err)
                .to.deep.equal({
                  errorMessage: User.INVALID_ARGUMENTS
                })
            );
          });
        });

        describe('missing arguments', function () {
          it('rejects with an error object', function () {
            const promise = User.fetch({ name: 'some-user' });

            return promise.catch(
              err => expect(err)
                .to.deep.equal({
                  errorMessage: User.INVALID_ARGUMENTS
                })
            );
          });
        });
      });
    });

    describe('instance methods', function () {
      describe('toJSON', function () {
        let user;
        const name = newUserName;
        const id = newUserId;

        beforeEach(function () {
          user = new User({
            name,
            id,
            dataAdapter
          });
        });

        it('exists', function () {
          expect(user).to.respondTo('toJSON');
        });

        it('contains expected properties', function () {
          expect(user.toJSON()).to.deep.equal({
            name,
            id,
            isTempUser: false
          });
        });
      });
    });
  });
});
