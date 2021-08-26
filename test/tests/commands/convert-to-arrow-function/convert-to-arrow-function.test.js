require('approvals').configure();

const { getNewFunctionString, functionNodeTypes } = require('../../../../modules/commands/convert-to-arrow-function/convert-to-arrow-function');
const { FUNCTION_DECLARATION, FUNCTION_EXPRESSION, METHOD_DEFINITION } = require('../../../../modules/constants/ast-node-types');
const { findFunctionNode } = require('../../../../modules/function-utils/function-node');

const { buildNodePath } = require('../../../../modules/node-path');
const { parse } = require('../../../../modules/parser/parser');
const { buildLocationFromEditorCoordinates, buildEditorCoordinates } = require('../../../utilities/editor-to-location-selection-builder');
const { readFileSource } = require('../../../utilities/file-reader');

describe('convert to arrow function', function () {
    it('Converts fn declaration to arrow function assigned to const', function () {
        const selectedLocation = buildLocationFromEditorCoordinates({
            start: buildEditorCoordinates({ line: 12, column: 22 }),
            end: buildEditorCoordinates({ line: 12, column: 22 })
        });

        const testSource = readFileSource(__dirname, 'fixtures/test-fixture.js');

        const parsedSource = parse(testSource);
        const nodePath = buildNodePath(parsedSource, selectedLocation);

        const functionNode = nodePath.find(node => node.type === FUNCTION_DECLARATION);

        const convertedFunctionString = getNewFunctionString(functionNode, testSource);

        this.verify(convertedFunctionString);
    });

    it('Converts fn expression to arrow function', function () {
        const selectedLocation = buildLocationFromEditorCoordinates({
            start: buildEditorCoordinates({ line: 7, column: 31 }),
            end: buildEditorCoordinates({ line: 7, column: 31 })
        });

        const testSource = readFileSource(__dirname, 'fixtures/test-fixture.js');

        const parsedSource = parse(testSource);
        const nodePath = buildNodePath(parsedSource, selectedLocation);

        const functionNode = nodePath.find(node => node.type === FUNCTION_EXPRESSION);

        const convertedFunctionString = getNewFunctionString(functionNode, testSource);

        this.verify(convertedFunctionString);
    });

    it('Converts method to arrow function assigned to property', function () {
        const selectedLocation = buildLocationFromEditorCoordinates({
            start: buildEditorCoordinates({ line: 2, column: 12 }),
            end: buildEditorCoordinates({ line: 2, column: 12 })
        });

        const testSource = readFileSource(__dirname, 'fixtures/test-fixture.js');

        const parsedSource = parse(testSource);
        const nodePath = buildNodePath(parsedSource, selectedLocation);

        const functionNode = nodePath.find(node => node.type === METHOD_DEFINITION);

        const convertedFunctionString = getNewFunctionString(functionNode, testSource);

        this.verify(convertedFunctionString);
    });

    it('Does not add extra const on named function expression', function () {
        const selectedLocation = buildLocationFromEditorCoordinates({
            start: buildEditorCoordinates({ line: 16, column: 37 }),
            end: buildEditorCoordinates({ line: 16, column: 37 })
        });

        const testSource = readFileSource(__dirname, 'fixtures/test-fixture.js');

        const parsedSource = parse(testSource);
        const nodePath = buildNodePath(parsedSource, selectedLocation);

        const functionNode = nodePath.find(node => node.type === FUNCTION_EXPRESSION);

        const convertedFunctionString = getNewFunctionString(functionNode, testSource);

        this.verify(convertedFunctionString);
    });

    it('converts method to property when cursor is elsewhere on function def', function () {
        const selectedLocation = buildLocationFromEditorCoordinates({
            start: buildEditorCoordinates({ line: 2, column: 18 }),
            end: buildEditorCoordinates({ line: 2, column: 18 })
        });

        const testSource = readFileSource(__dirname, 'fixtures/test-fixture.js');

        const parsedSource = parse(testSource);
        const nodePath = buildNodePath(parsedSource, selectedLocation);

        const functionNode = findFunctionNode(nodePath, functionNodeTypes);

        const convertedFunctionString = getNewFunctionString(functionNode, testSource);

        this.verify(convertedFunctionString);        
    });
});