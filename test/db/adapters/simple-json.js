const { describe, it, beforeEach, afterEach } = require('mocha');
const chai = require('chai');
const { expect } = chai;
const fs = require('fs');
const jsonfile = require('jsonfile');
const shell = require('shelljs');
const objectHash = require('object-hash');

const DataAdapter = require('../../../db/data-adapter');
const SimpleJsonDataAdapter = require('../../../db/adapters/simple-json');

const testDbFilePath = '/tmp/simple-json-db.json';
const newUserData = { name: 'new-user', password: 'new-user-password' };
const newUserDataWithId = Object.assign({},
  newUserData,
  { id: objectHash(newUserData.name) }
);

describe.only('SimpleJsonDataAdapter', function () {
  let simpleDataAdapter;

  beforeEach(function () {
    if (shell.test('-e', testDbFilePath)) {
      shell.rm(testDbFilePath);
    }

    simpleDataAdapter = new SimpleJsonDataAdapter({
      dbFile: testDbFilePath
    });

    return simpleDataAdapter.connect();
  });

  it('inherits DataAdapter', function () {
    expect(simpleDataAdapter).to.be.an.instanceof(DataAdapter);
  });

  it('has a store', function () {
    expect(simpleDataAdapter.store).to.deep.equal({});
  });

  it('has a dbFile path configured', function () {
    expect(simpleDataAdapter.dbFile).to.equal(testDbFilePath);
  });

  describe('instance methods', function () {
    describe('connect', function () {
      const testData = { foo: 'bar' };

      it('exists', function () {
        expect(simpleDataAdapter).to.respondTo('connect');
      });

      describe('db file already exists', function () {
        beforeEach(function () {
          jsonfile.writeFileSync(testDbFilePath, testData);
        });

        it('populates store with dbFile', function () {
          return simpleDataAdapter.connect().then(_ =>
            expect(simpleDataAdapter.store).to.deep.equal(testData)
          );
        });
      });

      describe('db file does not already exist', function () {
        it('populates store with empty object', function () {
          simpleDataAdapter.connect().then(
            _ => expect(simpleDataAdapter.store).to.deep.equal({})
          );
        });
      });
    });

    describe('writeToDisk', function () {
      it('exists', function () {
        expect(simpleDataAdapter).to.respondTo('writeToDisk');
      });

      it('writes data to dbFile path', function () {
        return simpleDataAdapter.writeToDisk().then(_ => {
          const fileData = JSON.parse(fs.readFileSync(testDbFilePath));
          expect(fileData).to.deep.equal({});
        });
      });
    });

    describe('readFromDisk', function () {
      const testData = { foo: 'bar' };

      beforeEach(function () {
        jsonfile.writeFileSync(testDbFilePath, testData);
      });

      it('exists', function () {
        expect(simpleDataAdapter).to.respondTo('readFromDisk');
      });

      it('reads data from dbFile path', function () {
        return simpleDataAdapter.readFromDisk().then(data => {
          expect(simpleDataAdapter.store).to.deep.equal(testData);
          expect(simpleDataAdapter.store).to.deep.equal(data);
        });
      });
    });

    describe('createUser', function () {
      it('exists', function () {
        expect(simpleDataAdapter).to.respondTo('createUser');
      });

      describe('no preexisting user data', function () {
        it('creates a user object', function () {
          return simpleDataAdapter.createUser(newUserData).then(_ =>
            expect(
              simpleDataAdapter.store.users[newUserData.name]
            ).to.deep.equal(
              newUserDataWithId
            )
          );
        });
      });

      describe('preexisting data', function () {
        beforeEach(function () {
          simpleDataAdapter.createUser(newUserData);
        });

        it('throws an error if user already exists', function () {
          return simpleDataAdapter.createUser(newUserData).catch(error =>
            expect(
              error
            ).to.equal(
              'users.new-user already exists'
            )
          );
        });
      });
    });
  });
});
