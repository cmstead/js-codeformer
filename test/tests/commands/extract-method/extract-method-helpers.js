const { readFileSource } = require('../../../utilities/file-reader');

function readTestSource() {
    return readFileSource(__dirname, 'fixtures/test-source.js');
}