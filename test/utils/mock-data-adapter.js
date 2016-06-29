const DataAdapter = require('../../db/data-adapter');

class MockDataAdapter extends DataAdapter {
  constructor () {
    super();
  }
}

module.exports = MockDataAdapter;
