require('approvals').configure();

const { assert } = require('chai');
const { getNewFunctionString } = require('../../../../modules/commands/convert-to-arrow-function/convert-to-arrow-function');
const { FUNCTION_DECLARATION, FUNCTION_EXPRESSION } = require('../../../../modules/constants/ast-node-types');

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

    it('Converts fn expression to arrow function assigned to const', function () {
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
});