const { readFileSource } = require("../../../utilities/file-reader");
const { parse } = require('../../../../modules/parser/parser');
const { buildLocationFromEditorCoordinates, buildEditorCoordinates } = require("../../../utilities/editor-to-location-selection-builder");
const { buildNodePath } = require("../../../../modules/node-path");
const { findNodeInPath } = require("../../../../modules/edit-utils/node-path-utils");
const { FUNCTION_DECLARATION, FUNCTION_EXPRESSION, ARROW_FUNCTION_EXPRESSION, CLASS_DECLARATION } = require("../../../../modules/constants/ast-node-types");
const {
    getFunctionDeclaration,
    getFunctionName,
    getFunctionNode,
    getMethodWriteLocation
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

        it('returns null when function node is null', function () {
            const functionDeclarationNode = getFunctionDeclaration(null, []);

            assert.equal(functionDeclarationNode, null);
        });

        it('returns null when function node is an expression, but not assigned to anything', function () {
            const fixtureText = readFileSource(__dirname, 'fixtures/test-fixture.js');
            const parsedSource = parse(fixtureText);

            const selectionLocation = buildLocationFromEditorCoordinates({
                start: buildEditorCoordinates({ line: 14, column: 23 }),
                end: buildEditorCoordinates({ line: 14, column: 23 })
            });

            const selectionPath = buildNodePath(parsedSource, selectionLocation);

            const functionNode = findNodeInPath(selectionPath, ARROW_FUNCTION_EXPRESSION);

            const functionDeclarationNode = getFunctionDeclaration(functionNode, selectionPath);

            assert.equal(functionDeclarationNode, null);
        });
    });

    describe('get function name', function () {
        it('returns function name from function declaration', function () {
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

        it('returns variable name from function expression assigned to a single declaration', function () {
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

        it('returns variable name from function expression assigned a declarator in a multi-declarator declaration', function () {
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

    describe('get function name', function () {
        it('returns function node from function declaration', function () {
            const fixtureText = readFileSource(__dirname, 'fixtures/test-fixture.js');
            const parsedSource = parse(fixtureText);

            const selectionLocation = buildLocationFromEditorCoordinates({
                start: buildEditorCoordinates({ line: 1, column: 14 }),
                end: buildEditorCoordinates({ line: 1, column: 14 })
            });

            const selectionPath = buildNodePath(parsedSource, selectionLocation);

            const functionNode = findNodeInPath(selectionPath, FUNCTION_DECLARATION);

            const functionDeclarationNode = getFunctionDeclaration(functionNode, selectionPath);

            const locatedFunctionNode = getFunctionNode(functionDeclarationNode);

            assert.equal(locatedFunctionNode, functionNode);
        });

        it('returns function node from function expression assigned to a single declaration', function () {
            const fixtureText = readFileSource(__dirname, 'fixtures/test-fixture.js');
            const parsedSource = parse(fixtureText);

            const selectionLocation = buildLocationFromEditorCoordinates({
                start: buildEditorCoordinates({ line: 5, column: 28 }),
                end: buildEditorCoordinates({ line: 5, column: 28 })
            });

            const selectionPath = buildNodePath(parsedSource, selectionLocation);

            const functionNode = findNodeInPath(selectionPath, FUNCTION_EXPRESSION);

            const functionDeclarationNode = getFunctionDeclaration(functionNode, selectionPath);

            const locatedFunctionNode = getFunctionNode(functionDeclarationNode);

            assert.equal(locatedFunctionNode, functionNode);
        });

        it('returns function node from function expression assigned a declarator in a multi-declarator declaration', function () {
            const fixtureText = readFileSource(__dirname, 'fixtures/test-fixture.js');
            const parsedSource = parse(fixtureText);

            const selectionLocation = buildLocationFromEditorCoordinates({
                start: buildEditorCoordinates({ line: 10, column: 23 }),
                end: buildEditorCoordinates({ line: 10, column: 23 })
            });

            const selectionPath = buildNodePath(parsedSource, selectionLocation);

            const functionNode = findNodeInPath(selectionPath, ARROW_FUNCTION_EXPRESSION);

            const functionDeclarationNode = getFunctionDeclaration(functionNode, selectionPath);

            const locatedFunctionNode = getFunctionNode(functionDeclarationNode);

            assert.equal(locatedFunctionNode, functionNode);

        });
    });

    describe('get method write location in class', function () {
        it('returns the end of the last body node when class has nodes in the body', function () {
            const fixtureText = readFileSource(__dirname, 'fixtures/test-fixture.js');
            const parsedSource = parse(fixtureText);

            const selectionLocation = buildLocationFromEditorCoordinates({
                start: buildEditorCoordinates({ line: 16, column: 15 }),
                end: buildEditorCoordinates({ line: 16, column: 15 })
            });

            const selectionPath = buildNodePath(parsedSource, selectionLocation);

            const classNode = findNodeInPath(selectionPath, CLASS_DECLARATION);

            const writeLocation = getMethodWriteLocation(classNode);

            this.verifyAsJSON(writeLocation);
        });
        it('returns the location inside the closing braket when class body is empty', function () {
            const fixtureText = readFileSource(__dirname, 'fixtures/test-fixture.js');
            const parsedSource = parse(fixtureText);

            const selectionLocation = buildLocationFromEditorCoordinates({
                start: buildEditorCoordinates({ line: 22, column: 20 }),
                end: buildEditorCoordinates({ line: 22, column: 20 })
            });

            const selectionPath = buildNodePath(parsedSource, selectionLocation);

            const classNode = findNodeInPath(selectionPath, CLASS_DECLARATION);

            const writeLocation = getMethodWriteLocation(classNode);

            this.verifyAsJSON(writeLocation);
        });
    });
});