const { getNewFunctionString, isAnonymousFunction } = require("../../../../modules/commands/lift-and-name-function-expression/lift-and-name-function-expression");
const { FUNCTION_EXPRESSION, ARROW_FUNCTION_EXPRESSION } = require("../../../../modules/constants/ast-node-types");
const { findNodeInPath } = require("../../../../modules/edit-utils/node-path-utils");
const { buildNodePath } = require("../../../../modules/node-path");
const { parse } = require("../../../../modules/parser/parser");
const { buildLocationFromEditorCoordinates, buildEditorCoordinates } = require("../../../utilities/editor-to-location-selection-builder");
const { readFileSource } = require("../../../utilities/file-reader");

const { assert } = require('chai');
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

        it('builds a function declaration for a named function expression', function () {
            const fixtureText = readFileSource(__dirname, 'fixtures/test-fixture.js');
            const parsedSource = parse(fixtureText);

            const selectedLocation = buildLocationFromEditorCoordinates({
                start: buildEditorCoordinates({ line: 5, column: 39 }),
                end: buildEditorCoordinates({ line: 5, column: 39 })
            });

            const selectionPath = buildNodePath(parsedSource, selectedLocation);
            const functionNode = findNodeInPath(selectionPath, FUNCTION_EXPRESSION);

            const newFunctionString = getNewFunctionString(functionNode, 'notTheSameName', fixtureText);

            this.verify(newFunctionString);
        });

        it('builds a function declaration assigned to a variable for an arrow function expression', function () {
            const fixtureText = readFileSource(__dirname, 'fixtures/test-fixture.js');
            const parsedSource = parse(fixtureText);

            const selectedLocation = buildLocationFromEditorCoordinates({
                start: buildEditorCoordinates({ line: 9, column: 32 }),
                end: buildEditorCoordinates({ line: 9, column: 32 })
            });

            const selectionPath = buildNodePath(parsedSource, selectedLocation);
            const functionNode = findNodeInPath(selectionPath, ARROW_FUNCTION_EXPRESSION);

            const newFunctionString = getNewFunctionString(functionNode, 'anArrowFunctionName', fixtureText);

            this.verify(newFunctionString);
        });
    });

    describe('validate function node for appropriateness', function () {
        it('returns true on an unnamed function expression', function () {
            const fixtureText = readFileSource(__dirname, 'fixtures/test-fixture.js');
            const parsedSource = parse(fixtureText);

            const selectedLocation = buildLocationFromEditorCoordinates({
                start: buildEditorCoordinates({ line: 1, column: 39 }),
                end: buildEditorCoordinates({ line: 1, column: 39 })
            });

            const selectionPath = buildNodePath(parsedSource, selectedLocation);
            const functionNode = findNodeInPath(selectionPath, FUNCTION_EXPRESSION);

            const result = isAnonymousFunction(functionNode);

            assert.isTrue(result);
        });

        it('returns true on a named function expression', function () {
            const fixtureText = readFileSource(__dirname, 'fixtures/test-fixture.js');
            const parsedSource = parse(fixtureText);

            const selectedLocation = buildLocationFromEditorCoordinates({
                start: buildEditorCoordinates({ line: 5, column: 39 }),
                end: buildEditorCoordinates({ line: 5, column: 39 })
            });

            const selectionPath = buildNodePath(parsedSource, selectedLocation);
            const functionNode = findNodeInPath(selectionPath, FUNCTION_EXPRESSION);

            const result = isAnonymousFunction(functionNode);

            assert.isTrue(result);
        });

        it('returns true on an arrow function expression', function () {
            const fixtureText = readFileSource(__dirname, 'fixtures/test-fixture.js');
            const parsedSource = parse(fixtureText);

            const selectedLocation = buildLocationFromEditorCoordinates({
                start: buildEditorCoordinates({ line: 9, column: 32 }),
                end: buildEditorCoordinates({ line: 9, column: 32 })
            });

            const selectionPath = buildNodePath(parsedSource, selectedLocation);
            const functionNode = findNodeInPath(selectionPath, ARROW_FUNCTION_EXPRESSION);

            const result = isAnonymousFunction(functionNode);

            assert.isTrue(result);
        });

        it('returns false on a function declaration', function () {
            const fixtureText = readFileSource(__dirname, 'fixtures/test-fixture.js');
            const parsedSource = parse(fixtureText);

            const selectedLocation = buildLocationFromEditorCoordinates({
                start: buildEditorCoordinates({ line: 13, column: 19 }),
                end: buildEditorCoordinates({ line: 13, column: 19 })
            });

            const selectionPath = buildNodePath(parsedSource, selectedLocation);
            const functionNode = findNodeInPath(selectionPath, ARROW_FUNCTION_EXPRESSION);

            const result = isAnonymousFunction(functionNode);

            assert.isFalse(result);
        });
    });
});