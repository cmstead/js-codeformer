const { getNewFunctionString } = require("../../../../modules/commands/lift-and-name-function-expression/lift-and-name-function-expression");
const { FUNCTION_EXPRESSION } = require("../../../../modules/constants/ast-node-types");
const { findNodeInPath } = require("../../../../modules/edit-utils/node-path-utils");
const { buildNodePath } = require("../../../../modules/node-path");
const { parse } = require("../../../../modules/parser/parser");
const { buildLocationFromEditorCoordinates, buildEditorCoordinates } = require("../../../utilities/editor-to-location-selection-builder");
const { readFileSource } = require("../../../utilities/file-reader");

require('../../../utilities/approvals').configure();

describe('lift and name function expression', function () {
    describe('get new function string', function () {
        it('builds a function declaration for an unnamed function expression', function () {
            const fixtureText = readFileSource(__dirname, 'fixtures/test-fixture.js');
            const parsedSource = parse(fixtureText);

            const selectedLocation = buildLocationFromEditorCoordinates({
                start: buildEditorCoordinates({ line: 1, column: 39 }),
                end: buildEditorCoordinates({ line: 1, column: 39 })
            });

            const selectionPath = buildNodePath(parsedSource, selectedLocation);
            const functionNode = findNodeInPath(selectionPath, FUNCTION_EXPRESSION);

            const newFunctionString = getNewFunctionString(functionNode, 'aNewFunctionName', fixtureText);

            this.verify(newFunctionString);
        });
    });
});