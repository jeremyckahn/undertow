const { describe, it, beforeEach } = require('mocha');
const chai = require('chai');
const { expect } = chai;

const User = require('../../models/user');
const MockDataAdapter = require('../utils/mock-data-adapter');

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
          let user = new User({ DataAdapter: MockDataAdapter });
          expect(user.dataAdapter).to.be.an.instanceof(MockDataAdapter);
        });
      });
    });

    describe('static methods', function () {
      describe('create', function () {
        it('is a function', function () {
          expect(User.create).to.be.a('function');
        });

        describe('given valid arguments', function () {
          it('returns a non-temporary User instance', function () {
            const opts = {
              name: 'test-user'
              ,password: 'password'
              ,dataAdapter: MockDataAdapter
            };
            const promise = User.create(opts);

            return promise.then(user => {
              expect(user).to.be.an.instanceof(User);
              expect(user.name).to.equal(opts.name);
              expect(user.id).to.equal(MockDataAdapter.tempUserId);
              expect(user.isTempUser).to.equal(false);
            });
          });
        });

        describe('given invalid arguments', function () {
          it('returns an error', function () {
            const promise = User.create({
              name: 'invalid-user'
              ,password: 'invalid-password'
              ,dataAdapter: MockDataAdapter
            });

            return promise.catch(
              err => expect(err).to.be.an.instanceof(Error)
            );
          });
        });
      });
    });
  });
});
