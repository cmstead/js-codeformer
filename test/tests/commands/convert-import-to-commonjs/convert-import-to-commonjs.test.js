const { assert } = require('chai');

const { readFileSource } = require("../../../utilities/file-reader");
const { parse } = require('../../../../modules/parser/parser');
const { convertToRequire, validateImportNode } = require("../../../../modules/commands/convert-import-to-commonjs/convert-import-to-commonjs");

describe('convert import to common js', function () {
    describe('convert to require', function () {
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

    describe('check for unacceptable types', function () {
        it('returns false on default import', function () {
            const testSource = readFileSource(__dirname, 'fixtures/test-fixture.js');
            const parsedSource = parse(testSource);

            const importNode = parsedSource.body[0];

            const checkResult = validateImportNode(importNode);

            assert.isFalse(checkResult);
        });

        it('returns false on empty imports', function () {
            const testSource = readFileSource(__dirname, 'fixtures/test-fixture.js');
            const parsedSource = parse(testSource);

            const importNode = parsedSource.body[3];

            const checkResult = validateImportNode(importNode);

            assert.isFalse(checkResult);
        });
    });
});