const { readFileSource } = require("../../../utilities/file-reader");
const { parse } = require('../../../../modules/parser/parser');
const { buildLocationFromEditorCoordinates, buildEditorCoordinates } = require("../../../utilities/editor-to-location-selection-builder");
const { buildNodePath } = require("../../../../modules/node-path");
const { findNodeInPath } = require("../../../../modules/edit-utils/node-path-utils");
const { FUNCTION_DECLARATION } = require("../../../../modules/constants/ast-node-types");
const { getFunctionDeclaration } = require("../../../../modules/commands/move-function-into-class/move-function-into-class");

require('../../../utilities/approvals').configure();

describe('Move function into class', function () {
    describe('get function declaration', function () {
        it('locates a function declaration node', function () {
            const fixtureText = readFileSource(__dirname, 'fixtures/test-fixture.js');
            const parsedSource = parse(fixtureText);

            const selectionLocation = buildLocationFromEditorCoordinates({
                start: buildEditorCoordinates({ line: 1, column: 14 }),
                start: buildEditorCoordinates({ line: 1, column: 14 })
            });

            const selectionPath = buildNodePath(parsedSource, selectionLocation);

            const functionNode = findNodeInPath(selectionPath, FUNCTION_DECLARATION);

            const functionDeclarationNode = getFunctionDeclaration(functionNode, selectionPath);

            this.verifyAsJSON(functionDeclarationNode);
        });
    });
});