const { buildParameterObjectSnippet } = require("../../../../modules/commands/toggle-parameters-type/toggle-parameters-type");
const { FUNCTION_DECLARATION } = require("../../../../modules/constants/ast-node-types");
const { findNodeInPath } = require("../../../../modules/edit-utils/node-path-utils");
const { buildNodePath } = require("../../../../modules/node-path");
const { parse } = require("../../../../modules/parser/parser");
const { buildLocationFromEditorCoordinates, buildEditorCoordinates } = require("../../../utilities/editor-to-location-selection-builder");
const { readFileSource } = require("../../../utilities/file-reader");

require('../../../utilities/approvals').configure();

describe('toggle parameters type', function () {
    describe('build parameter object template', function () {
        it('creates a new template string to insert for existing parameters', function () {
            const fixtureText = readFileSource(__dirname, 'fixtures/test-fixture.js');
            const parsedSource = parse(fixtureText);
            const selectionLocation = buildLocationFromEditorCoordinates({
                start: buildEditorCoordinates({ line: 1, column: 34 }),
                end: buildEditorCoordinates({ line: 1, column: 34 })
            });

            const selectionPath = buildNodePath(parsedSource, selectionLocation);

            const functionNode = findNodeInPath(selectionPath, FUNCTION_DECLARATION);

            const parameters = functionNode.params;

            const snippetText = buildParameterObjectSnippet(fixtureText, parameters);

            this.verify(snippetText);
        });
    });
});