const { assert } = require('chai');

const { FUNCTION_DECLARATION, METHOD_DEFINITION, FUNCTION_EXPRESSION, ARROW_FUNCTION_EXPRESSION } = require("../../../modules/constants/ast-node-types");
const { getFunctionName, getFunctionParametersString } = require("../../../modules/function-utils/function-source");
const { buildNodePath } = require("../../../modules/node-path");
const { parse } = require("../../../modules/parser/parser");
const { buildSelectionLocation, buildEditorCoordinates } = require("../../utilities/editor-to-location-selection-builder");
const { readFileSource } = require("../../utilities/file-reader");

function getSelectedFunction(selection, nodeType) {
    const sourceCode = readFileSource(__dirname, 'fixtures/function-source.js');
    const ast = parse(sourceCode);

    const selectionPath = buildNodePath(ast, selection);
    selectionPath.reverse();

    const functionNode = selectionPath.find(node => node.type === nodeType);

    return {
        functionNode,
        source: sourceCode
    };
}

describe('function source utils', function () {
    describe('get function name', function () {
        it('gets name from a function declaration', function () {
            const sourceCode = readFileSource(__dirname, 'fixtures/function-source.js');
            const ast = parse(sourceCode);

            const selection = buildSelectionLocation({
                start: buildEditorCoordinates({
                    line: 8,
                    column: 1
                }),
                end: buildEditorCoordinates({
                    line: 8,
                    column: 1
                })
            });

            const selectionPath = buildNodePath(ast, selection);
            selectionPath.reverse();

            const functionNode = selectionPath.find(node => node.type === FUNCTION_DECLARATION);

            const functionName = getFunctionName(functionNode);

            assert.equal(functionName, 'namedTestFunction');
        });

        it('gets name from a method defintion', function () {
            const sourceCode = readFileSource(__dirname, 'fixtures/function-source.js');
            const ast = parse(sourceCode);

            const selection = buildSelectionLocation({
                start: buildEditorCoordinates({
                    line: 3,
                    column: 1
                }),
                end: buildEditorCoordinates({
                    line: 3,
                    column: 1
                })
            });

            const selectionPath = buildNodePath(ast, selection);
            selectionPath.reverse();

            const functionNode = selectionPath.find(node => node.type === METHOD_DEFINITION);

            const functionName = getFunctionName(functionNode);

            assert.equal(functionName, 'testMethod');
        });

        it('returns empty string for anonymous function', function () {
            const sourceCode = readFileSource(__dirname, 'fixtures/function-source.js');
            const ast = parse(sourceCode);

            const selection = buildSelectionLocation({
                start: buildEditorCoordinates({
                    line: 12,
                    column: 1
                }),
                end: buildEditorCoordinates({
                    line: 12,
                    column: 1
                })
            });

            const selectionPath = buildNodePath(ast, selection);
            selectionPath.reverse();

            const functionNode = selectionPath.find(node => node.type === FUNCTION_EXPRESSION);

            const functionName = getFunctionName(functionNode);

            assert.equal(functionName, '');
        });

        it('returns empty string for arrow function', function () {
            const sourceCode = readFileSource(__dirname, 'fixtures/function-source.js');
            const ast = parse(sourceCode);

            const selection = buildSelectionLocation({
                start: buildEditorCoordinates({
                    line: 16,
                    column: 1
                }),
                end: buildEditorCoordinates({
                    line: 16,
                    column: 1
                })
            });

            const selectionPath = buildNodePath(ast, selection);
            selectionPath.reverse();

            const functionNode = selectionPath.find(node => node.type === ARROW_FUNCTION_EXPRESSION);

            const functionName = getFunctionName(functionNode);

            assert.equal(functionName, '');
        });
    });

    describe('get function parameters string', function () {
        it('returns an empty string when no parameters exist', function () {
            const selection = buildSelectionLocation({
                start: buildEditorCoordinates({
                    line: 3,
                    column: 1
                }),
                end: buildEditorCoordinates({
                    line: 3,
                    column: 1
                })
            });

            const { source, functionNode } = getSelectedFunction(selection, METHOD_DEFINITION);

            const parameterString = getFunctionParametersString(functionNode, source);

            assert.equal(parameterString, '');
        });

        it('returns a simple parameter list string when params exist',  function () {
            const selection = buildSelectionLocation({
                start: buildEditorCoordinates({
                    line: 8,
                    column: 1
                }),
                end: buildEditorCoordinates({
                    line: 8,
                    column: 1
                })
            });

            const { source, functionNode } = getSelectedFunction(selection, FUNCTION_DECLARATION);

            const parameterString = getFunctionParametersString(functionNode, source);

            assert.equal(parameterString, 'a, b');
        });

        it('returns a destructured-parameter string',  function () {
            const selection = buildSelectionLocation({
                start: buildEditorCoordinates({
                    line: 12,
                    column: 1
                }),
                end: buildEditorCoordinates({
                    line: 12,
                    column: 1
                })
            });

            const { source, functionNode } = getSelectedFunction(selection, FUNCTION_EXPRESSION);

            const parameterString = getFunctionParametersString(functionNode, source);

            assert.equal(parameterString, '{ x, y, z}');
        });

        it('returns a mixed simple parameter, and destructured-parameter string',  function () {
            const selection = buildSelectionLocation({
                start: buildEditorCoordinates({
                    line: 16,
                    column: 1
                }),
                end: buildEditorCoordinates({
                    line: 16,
                    column: 1
                })
            });

            const { source, functionNode } = getSelectedFunction(selection, ARROW_FUNCTION_EXPRESSION);

            const parameterString = getFunctionParametersString(functionNode, source);

            assert.equal(parameterString, 'a, { x }');
        });
    });
});