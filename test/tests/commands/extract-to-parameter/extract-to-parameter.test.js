const { findVariableDeclaration, findVariableDeclarator, findFunction, pickVariableDeletionLocation, getVariableName, getFunctionString } = require("../../../../modules/commands/extract-to-parameter/extract-to-parameter");
const { buildNodePath } = require("../../../../modules/node-path");
const { parse } = require("../../../../modules/parser/parser");
const { buildLocationFromEditorCoordinates, buildEditorCoordinates } = require("../../../utilities/editor-to-location-selection-builder");
const { readFileSource } = require("../../../utilities/file-reader");

require('../../../utilities/approvals').configure();

describe('extract to parameter', function () {
    it('extracts a variable into the paramter list of a function', function () {
        const fixtureText = readFileSource(__dirname, 'fixtures/test-fixture.js');
        const parsedSource = parse(fixtureText);

        const selectedLocation = buildLocationFromEditorCoordinates({
            start: buildEditorCoordinates({ line: 2, column: 24 }),
            end: buildEditorCoordinates({ line: 2, column: 24 })
        });

        const selectionPath = buildNodePath(parsedSource, selectedLocation);

        const variableDeclarator = findVariableDeclarator(selectionPath);
        const variableDeclaration = findVariableDeclaration(selectionPath);
        const functionNode = findFunction(selectionPath);
        const variableDeletionLocation = pickVariableDeletionLocation(variableDeclarator, variableDeclaration, fixtureText);
        const variableName = getVariableName(variableDeclarator);

        const functionString = getFunctionString(functionNode, variableName, fixtureText, variableDeletionLocation);

        this.verify(functionString);
    });
});