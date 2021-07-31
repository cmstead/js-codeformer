const { buildNodePath } = require("../../../../modules/node-path");
const { readFileSource } = require("../../../utilities/file-reader");

describe('inline variable', function () {
    describe('get surrounding scope', function () {
        it('selects surrounding block scope when inside of a block', function () {
            const sourceCode = readFileSource(__dirname, 'test-source.js')
            const selectionPath = buildNodePath()
        });        
    });
});