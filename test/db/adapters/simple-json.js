const { describe, it, beforeEach } = require('mocha');
const chai = require('chai');
const { expect } = chai;
const fs = require('fs');
const jsonfile = require('jsonfile');
const shell = require('shelljs');
const objectHash = require('object-hash');

const DataAdapter = require('../../../db/data-adapter');
const SimpleJsonDataAdapter = require('../../../db/adapters/simple-json');

const MockDataAdapter = require('../../utils/mock-data-adapter');
const {
  newUserName,
  newUserEmail,
  newUserPassword,
} = MockDataAdapter;

const testDbFilePath = '/tmp/simple-json-db.json';
const newUserData = {
  name: newUserName,
  email: newUserEmail,
  password: newUserPassword
};

const newUserDataWithId = Object.assign({},
  newUserData,
  { id: objectHash(newUserData.name) }
);

describe('SimpleJsonDataAdapter', function () {
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

        it('populates store with dbFile', () =>
          simpleDataAdapter.connect().then(_ =>
            expect(simpleDataAdapter.store).to.deep.equal(testData)
          )
        );
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

      it('writes data to dbFile path', () =>
        simpleDataAdapter.writeToDisk().then(_ => {
          const fileData = JSON.parse(fs.readFileSync(testDbFilePath));
          expect(fileData).to.deep.equal({});
        })
      );

      it('returns written data via promise', function () {
        const sampleData = { foo: 'bar' };
        simpleDataAdapter.store = sampleData;

        return simpleDataAdapter.writeToDisk().then((data) =>
          expect(data).to.deep.equal(sampleData)
        );
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

      it('reads data from dbFile path', () =>
        simpleDataAdapter.readFromDisk().then(data =>
          expect(simpleDataAdapter.store)
            .to.deep.equal(testData)
            .and
            .to.deep.equal(data)
        )
      );
    });

    describe('doesUserExist', function () {
      it('exists', function () {
        expect(simpleDataAdapter).to.respondTo('doesUserExist');
      });

      describe('lookup by name', function () {
        const { name, password } = newUserData;

        describe('user does not exist', function () {
          it('returns the correct result', () =>
            simpleDataAdapter.doesUserExist({ name, password }).then(
              doesUserExist => expect(doesUserExist).to.equal(false)
            )
          );
        });

        describe('user does exist', function () {
          beforeEach(() =>
            simpleDataAdapter.createUser(newUserData)
          );

          it('returns the correct result', () =>
            simpleDataAdapter.doesUserExist({ name, password }).then(
              doesUserExist => expect(doesUserExist).to.equal(true)
            )
          );
        });
      });

      describe('lookup by id', function () {
        const { name, id, password } = newUserDataWithId;

        describe('user does not exist', function () {
          it('returns the correct result', () =>
            simpleDataAdapter.doesUserExist({ id, password }).then(
              doesUserExist => expect(doesUserExist).to.equal(false)
            )
          );
        });

        describe('user does exist', function () {
          beforeEach(() =>
            simpleDataAdapter.createUser(newUserData)
          );

          it('returns the correct result', () =>
            simpleDataAdapter.doesUserExist({ id, password }).then(
              doesUserExist => expect(doesUserExist).to.equal(true)
            )
          );
        });
      });
    });

    describe('createUser', function () {
      it('exists', function () {
        expect(simpleDataAdapter).to.respondTo('createUser');
      });

      describe('no preexisting user data', function () {
        it('creates a user object', () =>
          simpleDataAdapter.createUser(newUserData).then(data =>
            expect(data).to.deep.equal(newUserDataWithId)
          )
        );
      });

      describe('preexisting data', function () {
        beforeEach(function () {
          simpleDataAdapter.createUser(newUserData);
        });

        it('throws an error if user already exists', () =>
          simpleDataAdapter.createUser(newUserData).catch(error =>
            expect(
              error
            ).to.equal(
              'users.new-user already exists'
            )
          )
        );
      });
    });

    describe('fetchUser', function () {
      const { name, password } = newUserDataWithId;

      it('exists', function () {
        expect(simpleDataAdapter).to.respondTo('fetchUser');
      });

      describe('given valid credentials', function () {
        beforeEach(() =>
          simpleDataAdapter.createUser(newUserData)
        );

        it('resolves with a user object', () =>
          simpleDataAdapter.fetchUser({ name, password }).then(user =>
            expect(user).to.deep.equal(newUserDataWithId)
          )
        );
      });

      describe('given invalid credentials', function () {
        it('rejects with an error object', () =>
          simpleDataAdapter.fetchUser({ name, password }).catch(err =>
            expect(err).to.deep.equal(
              { errorMessage: DataAdapter.INVALID_CREDENTIALS }
            )
          )
        );
      });
    });
  });
});
