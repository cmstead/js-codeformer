const { readFileSource } = require("../../../utilities/file-reader");
const { parse } = require('../../../../modules/parser/parser');
const { buildLocationFromEditorCoordinates, buildEditorCoordinates } = require("../../../utilities/editor-to-location-selection-builder");
const { buildNodePath } = require("../../../../modules/node-path");
const { findNodeInPath } = require("../../../../modules/edit-utils/node-path-utils");
const { FUNCTION_DECLARATION, FUNCTION_EXPRESSION, ARROW_FUNCTION_EXPRESSION } = require("../../../../modules/constants/ast-node-types");
const { 
    getFunctionDeclaration,
    getFunctionName
 } = require("../../../../modules/commands/move-function-into-class/move-function-into-class");

require('../../../utilities/approvals').configure();

const { assert } = require('chai');

describe('Move function into class', function () {
    describe('get function declaration', function () {
        it('locates a function declaration node', function () {
            const fixtureText = readFileSource(__dirname, 'fixtures/test-fixture.js');
            const parsedSource = parse(fixtureText);

            const selectionLocation = buildLocationFromEditorCoordinates({
                start: buildEditorCoordinates({ line: 1, column: 14 }),
                end: buildEditorCoordinates({ line: 1, column: 14 })
            });

            const selectionPath = buildNodePath(parsedSource, selectionLocation);

            const functionNode = findNodeInPath(selectionPath, FUNCTION_DECLARATION);

            const functionDeclarationNode = getFunctionDeclaration(functionNode, selectionPath);

            this.verifyAsJSON(functionDeclarationNode);
        });

        it('locates a function expression assigned in a declaration', function () {
            const fixtureText = readFileSource(__dirname, 'fixtures/test-fixture.js');
            const parsedSource = parse(fixtureText);

            const selectionLocation = buildLocationFromEditorCoordinates({
                start: buildEditorCoordinates({ line: 5, column: 28 }),
                end: buildEditorCoordinates({ line: 5, column: 28 })
            });

            const selectionPath = buildNodePath(parsedSource, selectionLocation);

            const functionNode = findNodeInPath(selectionPath, FUNCTION_EXPRESSION);

            const functionDeclarationNode = getFunctionDeclaration(functionNode, selectionPath);

            this.verifyAsJSON(functionDeclarationNode);
        });

        it('locates a function expression assigned among multiple declarators', function () {
            const fixtureText = readFileSource(__dirname, 'fixtures/test-fixture.js');
            const parsedSource = parse(fixtureText);

            const selectionLocation = buildLocationFromEditorCoordinates({
                start: buildEditorCoordinates({ line: 10, column: 23 }),
                end: buildEditorCoordinates({ line: 10, column: 23 })
            });

            const selectionPath = buildNodePath(parsedSource, selectionLocation);

            const functionNode = findNodeInPath(selectionPath, ARROW_FUNCTION_EXPRESSION);

            const functionDeclarationNode = getFunctionDeclaration(functionNode, selectionPath);

            this.verifyAsJSON(functionDeclarationNode);
        });
    });

    describe('get function name', function () {
        it('locates a function declaration node', function () {
            const fixtureText = readFileSource(__dirname, 'fixtures/test-fixture.js');
            const parsedSource = parse(fixtureText);

            const selectionLocation = buildLocationFromEditorCoordinates({
                start: buildEditorCoordinates({ line: 1, column: 14 }),
                end: buildEditorCoordinates({ line: 1, column: 14 })
            });

            const selectionPath = buildNodePath(parsedSource, selectionLocation);

            const functionNode = findNodeInPath(selectionPath, FUNCTION_DECLARATION);

            const functionDeclarationNode = getFunctionDeclaration(functionNode, selectionPath);

            const functionName = getFunctionName(functionDeclarationNode);

            assert.equal(functionName, 'aFunctionDeclaration');
        });

        it('locates a function expression assigned in a declaration', function () {
            const fixtureText = readFileSource(__dirname, 'fixtures/test-fixture.js');
            const parsedSource = parse(fixtureText);

            const selectionLocation = buildLocationFromEditorCoordinates({
                start: buildEditorCoordinates({ line: 5, column: 28 }),
                end: buildEditorCoordinates({ line: 5, column: 28 })
            });

            const selectionPath = buildNodePath(parsedSource, selectionLocation);

            const functionNode = findNodeInPath(selectionPath, FUNCTION_EXPRESSION);

            const functionDeclarationNode = getFunctionDeclaration(functionNode, selectionPath);

            const functionName = getFunctionName(functionDeclarationNode);

            assert.equal(functionName, 'aFunctionConst');
        });

        it('locates a function expression assigned among multiple declarators', function () {
            const fixtureText = readFileSource(__dirname, 'fixtures/test-fixture.js');
            const parsedSource = parse(fixtureText);

            const selectionLocation = buildLocationFromEditorCoordinates({
                start: buildEditorCoordinates({ line: 10, column: 23 }),
                end: buildEditorCoordinates({ line: 10, column: 23 })
            });

            const selectionPath = buildNodePath(parsedSource, selectionLocation);

            const functionNode = findNodeInPath(selectionPath, ARROW_FUNCTION_EXPRESSION);

            const functionDeclarationNode = getFunctionDeclaration(functionNode, selectionPath);

            const functionName = getFunctionName(functionDeclarationNode);

            assert.equal(functionName, 'myFunction');

        });
    });
});