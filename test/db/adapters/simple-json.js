const { describe, it, beforeEach } = require('mocha');
const chai = require('chai');
const { expect } = chai;

const DataAdapter = require('../../../db/data-adapter');
const SimpleJsonDataAdapter = require('../../../db/adapters/simple-json');

describe('SimpleJsonDataAdapter', function () {
  let simpleDataAdapter;

  beforeEach(function () {
    simpleDataAdapter = new SimpleJsonDataAdapter();
  });

  it('inherits DataAdapter', function () {
    expect(simpleDataAdapter).to.be.an.instanceof(DataAdapter);
  });
});
