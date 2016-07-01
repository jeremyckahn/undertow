const { describe, it, beforeEach } = require('mocha');
const chai = require('chai');
const { expect } = chai;
const fs = require('fs');
const jsonfile = require('jsonfile');
const shell = require('shelljs');

const DataAdapter = require('../../../db/data-adapter');
const SimpleJsonDataAdapter = require('../../../db/adapters/simple-json');

describe('SimpleJsonDataAdapter', function () {
  let simpleDataAdapter;
  const testDbFilePath = '/tmp/simple-json-db.json';

  beforeEach(function () {
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
    describe('writeFile', function () {
      beforeEach(function () {
        if (shell.test('-e', testDbFilePath)) {
          shell.rm(testDbFilePath);
        }
      });

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
  });
});
