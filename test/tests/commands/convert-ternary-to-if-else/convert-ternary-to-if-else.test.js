const { readFileSource } = require("../../../utilities/file-reader");
const { parse } = require('../../../../modules/parser/parser');
const { buildLocationFromEditorCoordinates, buildEditorCoordinates } = require("../../../utilities/editor-to-location-selection-builder");
const { buildNodePath } = require("../../../../modules/node-path");
const { findNodeInPath } = require("../../../../modules/edit-utils/node-path-utils");
const { CONDITIONAL_EXPRESSION, RETURN_STATEMENT, VARIABLE_DECLARATION, PROGRAM } = require("../../../../modules/constants/ast-node-types");
const { buildNewIfStatement } = require("../../../../modules/commands/convert-ternary-to-if-else/convert-ternary-to-if-else");

require('../../../utilities/approvals').configure();

describe('build new if from ternary expression', function () {
    it('builds an if which returns from both blocks when ternary is returned', function () {
        const fixtureText = readFileSource(__dirname, 'fixtures/test-fixture.js');
        const parsedSource = parse(fixtureText);

        const selectedLocation = buildLocationFromEditorCoordinates({
            start: buildEditorCoordinates({ line: 2, column: 18 }),
            end: buildEditorCoordinates({ line: 2, column: 18 })
        });

        const selectionPath = buildNodePath(parsedSource, selectedLocation);

        const ternary = findNodeInPath(selectionPath, CONDITIONAL_EXPRESSION);
        const returnNode = findNodeInPath(selectionPath, RETURN_STATEMENT);

        const newIfStatement = buildNewIfStatement(fixtureText, returnNode, ternary);

        this.verify(newIfStatement);
    });

    it('builds an if which which assigns to the same variable from both blocks', function () {
        const fixtureText = readFileSource(__dirname, 'fixtures/test-fixture.js');
        const parsedSource = parse(fixtureText);

        const selectedLocation = buildLocationFromEditorCoordinates({
            start: buildEditorCoordinates({ line: 5, column: 20 }),
            end: buildEditorCoordinates({ line: 5, column: 20 })
        });

        const selectionPath = buildNodePath(parsedSource, selectedLocation);

        const ternary = findNodeInPath(selectionPath, CONDITIONAL_EXPRESSION);
        const variableDeclarationNode = findNodeInPath(selectionPath, VARIABLE_DECLARATION);

        const newIfStatement = buildNewIfStatement(fixtureText, variableDeclarationNode, ternary);

        this.verify(newIfStatement);
    });

    it('builds an if which executes an expression when ternary is executed alone', function () {
        const fixtureText = readFileSource(__dirname, 'fixtures/test-fixture.js');
        const parsedSource = parse(fixtureText);

        const selectedLocation = buildLocationFromEditorCoordinates({
            start: buildEditorCoordinates({ line: 7, column: 10 }),
            end: buildEditorCoordinates({ line: 7, column: 10 })
        });

        const selectionPath = buildNodePath(parsedSource, selectedLocation);

        const ternary = findNodeInPath(selectionPath, CONDITIONAL_EXPRESSION);
        const programNode = findNodeInPath(selectionPath, PROGRAM);

        const newIfStatement = buildNewIfStatement(fixtureText, programNode, ternary);

        this.verify(newIfStatement);
    });

});