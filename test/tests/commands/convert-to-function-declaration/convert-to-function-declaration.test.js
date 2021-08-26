const { findVariableDeclaration, buildFunctionString } = require('../../../../modules/commands/convert-to-function-declaration/convert-to-function-declaration');
const { buildNodePath } = require('../../../../modules/node-path');
const { parse } = require('../../../../modules/parser/parser');
const { buildLocationFromEditorCoordinates, buildEditorCoordinates } = require('../../../utilities/editor-to-location-selection-builder');
const { readFileSource } = require('../../../utilities/file-reader');

require('../../../utilities/approvals').configure();

describe('convert to function declaration', function () {
    it('converts a function expression assigned to a variable to a named declaration', function () {
        const fixtureText = readFileSource(__dirname, 'fixtures/test-fixture.js');
        const parsedText = parse(fixtureText);

        const selection = buildLocationFromEditorCoordinates({
            start: buildEditorCoordinates({ line: 1, column: 36 }),
            end: buildEditorCoordinates({ line: 1, column: 36 })
        });

        const selectionPath = buildNodePath(parsedText, selection);

        const variableNode = findVariableDeclaration(selectionPath);

        const functionString = buildFunctionString(variableNode, fixtureText);

        this.verify(functionString);
    });
});