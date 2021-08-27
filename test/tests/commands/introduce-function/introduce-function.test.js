const { getNameOrCall } = require("../../../../modules/commands/introduce-function/introduce-function");
const { buildNodePath } = require("../../../../modules/node-path");
const { parse } = require("../../../../modules/parser/parser");
const { buildLocationFromEditorCoordinates, buildEditorCoordinates } = require("../../../utilities/editor-to-location-selection-builder");
const { readFileSource } = require("../../../utilities/file-reader");

require('../../../utilities/approvals').configure();

describe('introduce function', function () {
    describe('get identifier or call node from selection path', function () {

        it('gets identifier from selection path', function () {
            const fixtureText = readFileSource(__dirname, 'fixtures/test-fixture.js');
            const parsedSource = parse(fixtureText);

            const selectedLocation = buildLocationFromEditorCoordinates({
                start: buildEditorCoordinates({ line: 3, column: 6 }),
                end: buildEditorCoordinates({ line: 3, column: 6 })
            });

            const selectionPath = buildNodePath(parsedSource, selectedLocation);

            const selectedNode = getNameOrCall(selectionPath);

            this.verify(JSON.stringify(selectedNode, null, 4));
        });

        it('gets call expression node from selection path', function () {
            const fixtureText = readFileSource(__dirname, 'fixtures/test-fixture.js');
            const parsedSource = parse(fixtureText);

            const selectedLocation = buildLocationFromEditorCoordinates({
                start: buildEditorCoordinates({ line: 1, column: 6 }),
                end: buildEditorCoordinates({ line: 1, column: 6 })
            });

            const selectionPath = buildNodePath(parsedSource, selectedLocation);

            const selectedNode = getNameOrCall(selectionPath);

            this.verify(JSON.stringify(selectedNode, null, 4));
        });

    });
});