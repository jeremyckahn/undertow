const { describe, it, beforeEach } = require('mocha');
const chai = require('chai');
const { expect } = chai;

const User = require('../../models/user');
const MockDataAdapter = require('../utils/mock-data-adapter');

describe('User model', function () {
  describe('constructor', function () {
    it('stores id', function () {
      let user = new User({ id: 'user-id' });
      expect(user.id).to.equal('user-id');
    });

    describe('instance properties', function () {
      describe('isTempUser', function () {
        it('is correct when user ID is provided', function () {
          let user = new User({ id: 'user-id' });
          expect(user.isTempUser).to.equal(false);
        });

        it('is correct when user ID is not provided', function () {
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
          it('returns a User instance', function () {
            const promise = User.create({
              name: 'test-user'
              ,password: 'password'
              ,dataAdapter: MockDataAdapter
            });

            return promise.then(user => expect(user).to.be.an.instanceof(User));
          });
        });
      });
    });
  });
});
