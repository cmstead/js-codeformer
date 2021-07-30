require('../../../utilities/approvals').configure();

const { assert } = require('chai');

const {
    buildEditorCoordinates,
    buildLocationFromEditorCoordinates
} = require('../../../utilities/editor-to-location-selection-builder');

const { loadModule } = require('../../../utilities/module-loader');

const { readFileSource } = require('../../../utilities/file-reader');

const {
    findAppropriateParameters,
    parseSelectedText
} = loadModule('commands/extract-method/extract-method');

describe('extract method behaviors', function () {

    describe('get parsed selection', function () {
        it('captures selected text and parses it', function () {
            const selectedLocation = buildLocationFromEditorCoordinates({
                start: buildEditorCoordinates({ line: 9, column: 32 }),
                end: buildEditorCoordinates({ line: 12, column: 26 })
            });

            const testSource = readFileSource(__dirname, 'fixtures/test-source.js');

            const parsedSelection = parseSelectedText(testSource, selectedLocation);

            this.verifyAsJSON(parsedSelection);
        });

        it('throws human readable error when selection is unparseable', function () {
            const selectedLocation = buildLocationFromEditorCoordinates({
                start: buildEditorCoordinates({ line: 9, column: 33 }),
                end: buildEditorCoordinates({ line: 12, column: 26 })
            });

            const testSource = readFileSource(__dirname, 'fixtures/test-source.js');

            assert.throws(
                () => parseSelectedText(testSource, selectedLocation),
                'Selected source cannot be interpreted, unable to extract method'
            );
        });
    });

    describe('select parameters', function () {
        it('captures necessary parameters for all bound variables from simple local scope', function () {
            const selectedLocation = buildLocationFromEditorCoordinates({
                start: buildEditorCoordinates({ line: 14, column: 25 }),
                end: buildEditorCoordinates({ line: 24, column: 52 })
            });

            const testSource = readFileSource(__dirname, 'fixtures/test-source.js');

            const parsedSelection = parseSelectedText(testSource, selectedLocation);

            const selectedParameters = findAppropriateParameters(parsedSelection);

            assert.equal(JSON.stringify(selectedParameters), JSON.stringify(['b', 'a']));
        });
    });

    describe('create method text', function () {
        it('creates a function declaration by default', function () {
            
        });
    });
});