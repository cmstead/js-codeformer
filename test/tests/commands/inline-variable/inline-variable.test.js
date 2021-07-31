const { getSurroundingScope } = require("../../../../modules/commands/inline-variable/inline-variable");
const { buildNodePath } = require("../../../../modules/node-path");
const { parse } = require("../../../../modules/parser/parser");
const { buildLocationFromEditorCoordinates, buildEditorCoordinates } = require("../../../utilities/editor-to-location-selection-builder");
const { readFileSource } = require("../../../utilities/file-reader");

describe('inline variable', function () {
    describe('get surrounding scope', function () {
        it('selects surrounding block scope when inside of a block', function () {
            const sourceCode = readFileSource(__dirname, 'fixtures/test-source.js');
            const parsedSource = parse(sourceCode);

            const selection = buildLocationFromEditorCoordinates({
                start: buildEditorCoordinates({ line: 4, column: 12}),
                end: buildEditorCoordinates({ line: 4, column: 12})
            });

            const selectionPath = buildNodePath(parsedSource, selection);

            const surroundingScope = getSurroundingScope(selectionPath);

            this.verifyAsJSON(surroundingScope);
        });        
    });
});