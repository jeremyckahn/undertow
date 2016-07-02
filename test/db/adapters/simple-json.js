const { describe, it, beforeEach, afterEach } = require('mocha');
const chai = require('chai');
const { expect } = chai;
const fs = require('fs');
const jsonfile = require('jsonfile');
const shell = require('shelljs');

const DataAdapter = require('../../../db/data-adapter');
const SimpleJsonDataAdapter = require('../../../db/adapters/simple-json');

describe('SimpleJsonDataAdapter', function () {
  const testDbFilePath = '/tmp/simple-json-db.json';
  const testUserData = { name: 'test-user', password: 'test-password' };
  let simpleDataAdapter;

  beforeEach(function () {
    if (shell.test('-e', testDbFilePath)) {
      shell.rm(testDbFilePath);
    }

    simpleDataAdapter = new SimpleJsonDataAdapter({
      dbFile: testDbFilePath
    });
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
    describe('initStore', function () {
      const testData = { foo: 'bar' };

      it('exists', function () {
        expect(simpleDataAdapter.initStore).to.be.a('function');
      });

      describe('db file already exists', function () {
        beforeEach(function () {
          jsonfile.writeFileSync(testDbFilePath, testData);
        });

        it('populates store with dbFile', function () {
          simpleDataAdapter.initStore();
          expect(simpleDataAdapter.store).to.deep.equal(testData);
        });
      });

      describe('db file does not already exist', function () {
        it('populates store with empty object', function () {
          simpleDataAdapter.initStore();
          expect(simpleDataAdapter.store).to.deep.equal({});
        });
      });
    });

    describe('writeFile', function () {
      it('exists', function () {
        expect(simpleDataAdapter.writeFile).to.be.a('function');
      });

      it('writes data to dbFile path', function () {
        simpleDataAdapter.writeFile();
        const fileData = JSON.parse(fs.readFileSync(testDbFilePath));
        expect(fileData).to.deep.equal({});
      });
    });

    describe('readFile', function () {
      const testData = { foo: 'bar' };

      beforeEach(function () {
        jsonfile.writeFileSync(testDbFilePath, testData);
      });

      it('exists', function () {
        expect(simpleDataAdapter.readFile).to.be.a('function');
      });

      it('reads data from dbFile path', function () {
        simpleDataAdapter.readFile();
        expect(simpleDataAdapter.store).to.deep.equal(testData);
      });
    });

    describe('createUser', function () {
      it('exists', function () {
        expect(simpleDataAdapter.createUser).to.be.a('function');
      });

      describe('no preexisting user data', function () {
        beforeEach(function () {
          simpleDataAdapter.createUser(testUserData);
        });

        it('creates a user object', function () {
          expect(
            simpleDataAdapter.store.users[testUserData.name]
          ).to.deep.equal(
            testUserData
          );
        });
      });
    });
  });
});
