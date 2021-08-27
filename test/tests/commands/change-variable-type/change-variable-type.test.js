const { variableTypes } = require("../../../../modules/builders/VariableBuilder");
const { getNewVariableString } = require("../../../../modules/commands/change-variable-type/change-variable-type");
const { VARIABLE_DECLARATOR } = require("../../../../modules/constants/ast-node-types");
const { findNodeInPath } = require("../../../../modules/edit-utils/node-path-utils");
const { buildNodePath } = require("../../../../modules/node-path");
const { parse } = require("../../../../modules/parser/parser");
const { buildLocationFromEditorCoordinates, buildEditorCoordinates } = require("../../../utilities/editor-to-location-selection-builder");
const { readFileSource } = require("../../../utilities/file-reader");

require('../../../utilities/approvals').configure();

describe('change variable type', function () {
    it('rewrites the variable declaration with a new type', function () {
        const fixtureText = readFileSource(__dirname, '/fixtures/test-fixture.js');
        const parsedSource = parse(fixtureText);

        const selectedLocation = buildLocationFromEditorCoordinates({
            start: buildEditorCoordinates({ line: 1, column: 10 })
        });

        const selectionPath = buildNodePath(parsedSource, selectedLocation);

        const variableDeclarator = findNodeInPath(selectionPath, VARIABLE_DECLARATOR);

        const variableString = getNewVariableString(
            variableTypes.CONST,
            variableDeclarator,
            fixtureText);

        this.verify(variableString);
    });
});