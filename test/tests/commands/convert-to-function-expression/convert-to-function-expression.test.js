const { functionNodeTypes, getNewFunctionString } = require("../../../../modules/commands/convert-to-function-expression/convert-to-function-expression");
const { findFunctionNode } = require("../../../../modules/function-utils/function-node");
const { buildNodePath } = require("../../../../modules/node-path");
const { parse } = require("../../../../modules/parser/parser");
const { buildLocationFromEditorCoordinates, buildEditorCoordinates } = require("../../../utilities/editor-to-location-selection-builder");
const { readFileSource } = require("../../../utilities/file-reader");

require('../../../utilities/approvals').configure();

describe('convert to function expression', function () {
    it('converts a function declaration to a function expression assigned to a const', function () {
        const fixtureText = readFileSource(__dirname, 'fixtures/test-fixture.js');
        const parsedSource = parse(fixtureText);

        const selectionLocation = buildLocationFromEditorCoordinates({
            start: buildEditorCoordinates({ line: 1, column: 18 }),
            end: buildEditorCoordinates({ line: 1, column: 18 })
        });

        const selectionPath = buildNodePath(parsedSource, selectionLocation);

        const functionNode = findFunctionNode(selectionPath, functionNodeTypes);

        const functionString = getNewFunctionString(functionNode, fixtureText);

        this.verify(functionString);
    });

    it('converts a single-line arrow function to a function expression', function () {
        const fixtureText = readFileSource(__dirname, 'fixtures/test-fixture.js');
        const parsedSource = parse(fixtureText);

        const selectionLocation = buildLocationFromEditorCoordinates({
            start: buildEditorCoordinates({ line: 5, column: 39 }),
            end: buildEditorCoordinates({ line: 5, column: 39 })
        });

        const selectionPath = buildNodePath(parsedSource, selectionLocation);

        const functionNode = findFunctionNode(selectionPath, functionNodeTypes);

        const functionString = getNewFunctionString(functionNode, fixtureText);

        this.verify(functionString);
    });

    it('converts a multi-line arrow function to a function expression', function () {
        const fixtureText = readFileSource(__dirname, 'fixtures/test-fixture.js');
        const parsedSource = parse(fixtureText);

        const selectionLocation = buildLocationFromEditorCoordinates({
            start: buildEditorCoordinates({ line: 7, column: 39 }),
            end: buildEditorCoordinates({ line: 7, column: 39 })
        });

        const selectionPath = buildNodePath(parsedSource, selectionLocation);

        const functionNode = findFunctionNode(selectionPath, functionNodeTypes);

        const functionString = getNewFunctionString(functionNode, fixtureText);

        this.verify(functionString);
    });

    it('converts a method to a function expression assigned to a property', function () {
        const fixtureText = readFileSource(__dirname, 'fixtures/test-fixture.js');
        const parsedSource = parse(fixtureText);

        const selectionLocation = buildLocationFromEditorCoordinates({
            start: buildEditorCoordinates({ line: 13, column: 13 }),
            end: buildEditorCoordinates({ line: 13, column: 13 })
        });

        const selectionPath = buildNodePath(parsedSource, selectionLocation);

        const functionNode = findFunctionNode(selectionPath, functionNodeTypes);

        const functionString = getNewFunctionString(functionNode, fixtureText);

        this.verify(functionString);
    });

    it('converts method to property when cursor is elsewhere on function def', function () {
        const selectedLocation = buildLocationFromEditorCoordinates({
            start: buildEditorCoordinates({ line: 13, column: 24 }),
            end: buildEditorCoordinates({ line: 13, column: 24 })
        });

        const testSource = readFileSource(__dirname, 'fixtures/test-fixture.js');

        const parsedSource = parse(testSource);
        const nodePath = buildNodePath(parsedSource, selectedLocation);

        const functionNode = findFunctionNode(nodePath, functionNodeTypes);

        const convertedFunctionString = getNewFunctionString(functionNode, testSource);

        this.verify(convertedFunctionString);        
    });
});