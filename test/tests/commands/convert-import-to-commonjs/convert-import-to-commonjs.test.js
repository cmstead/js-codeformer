const { assert } = require('chai');

const { readFileSource } = require("../../../utilities/file-reader");
const { parse } = require('../../../../modules/parser/parser');
const { convertToRequire } = require("../../../../modules/commands/convert-import-to-commonjs/convert-import-to-commonjs");

describe('convert import to common js', function () {
    it('converts non-default specifiers to require statement', function () {
        const testSource = readFileSource(__dirname, 'fixtures/test-fixture.js');
        const parsedSource = parse(testSource);

        const requireValue = convertToRequire(parsedSource.body[1]);

        const expectedValue = `const { test, test2: anotherTest } = require('./some-test')`;
       
        assert.equal(requireValue, expectedValue);
    });

    it('converts namespace specifier to require statement', function () {
        const testSource = readFileSource(__dirname, 'fixtures/test-fixture.js');
        const parsedSource = parse(testSource);

        const requireValue = convertToRequire(parsedSource.body[2]);

        const expectedValue = `const bar = require('./some-other-test')`;
       
        assert.equal(requireValue, expectedValue);
    });
});