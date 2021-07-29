require('../../../utilities/approvals').configure();

// const { assert } = require('chai');

const {
    buildEditorCoordinates,
    buildLocationFromEditorCoordinates
} = require('../../../utilities/editor-to-location-selection-builder');

const { loadModule } = require('../../../utilities/module-loader');

const { readFileSource } = require('../../../utilities/file-reader');

const { parseSelectedText } = loadModule('commands/extract-method/extract-method');

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
    });

    describe('select parameters', function () {
        it.skip('captures necessary parameters for all bound variables from simple local scope', function () {
            const selectedLocation = buildLocationFromEditorCoordinates({
                start: buildEditorCoordinates({ line: 9, column: 32 }),
                end: buildEditorCoordinates({ line: 12, column: 26 })
            });

            const testSource = readFileSource(__dirname, 'fixtures/test-source.js');

            const parsedSelection = parseSelectedText(testSource, selectedLocation);

            const selectedParameters = findAppropriateParameters(parsedSelection);

            this.verifyAsJSON(selectedParameters);
        });
    });

});