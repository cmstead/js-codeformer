const { assert } = require('chai');

const { FUNCTION_DECLARATION, METHOD_DEFINITION, FUNCTION_EXPRESSION, ARROW_FUNCTION_EXPRESSION } = require("../../../modules/constants/ast-node-types");
const { getNodeType } = require('../../../modules/core-utils');
const { getFunctionName, getFunctionParametersString, getFunctionBody } = require("../../../modules/function-utils/function-source");
const { buildNodePath } = require("../../../modules/node-path");
const { parse } = require("../../../modules/parser/parser");
const { buildSelectionLocation, buildEditorCoordinates } = require("../../utilities/editor-to-location-selection-builder");
const { readFileSource } = require("../../utilities/file-reader");

function getSelectedFunction(selection, nodeType) {
    const sourceCode = readFileSource(__dirname, 'fixtures/function-source.js');
    const ast = parse(sourceCode);

    const selectionPath = buildNodePath(ast, selection);
    selectionPath.reverse();

    const functionNode = selectionPath.find(node => getNodeType(node) === nodeType);

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

            const functionNode = selectionPath.find(node => getNodeType(node) === FUNCTION_DECLARATION);

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

            const functionNode = selectionPath.find(node => getNodeType(node) === METHOD_DEFINITION);

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

            const functionNode = selectionPath.find(node => getNodeType(node) === FUNCTION_EXPRESSION);

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

            const functionNode = selectionPath.find(node => getNodeType(node) === ARROW_FUNCTION_EXPRESSION);

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

        it('returns a simple parameter list string when params exist', function () {
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

        it('returns a destructured-parameter string', function () {
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

        it('returns a mixed simple parameter, and destructured-parameter string', function () {
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

    describe('get function body', function () {
        it('returns the body of a method', function () {
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

            const functionBody = getFunctionBody(functionNode, source);

            assert.equal(functionBody, 'return \'hi\';');
        });

        it('returns the body of a function declaration', function () {
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

            const functionBody = getFunctionBody(functionNode, source);

            assert.equal(functionBody, 'return a + b;');
        });

        it('returns the body of a function expression', function () {
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

            const functionBody = getFunctionBody(functionNode, source);

            assert.equal(functionBody, 'return (x**2 + y**2 + z**2)**0.5;');
        });

        it('returns the body of a arrow function with a block body', function () {
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

            const functionBody = getFunctionBody(functionNode, source);

            assert.equal(functionBody, 'return a - x;');
        });

        it('returns the body of a one-line arrow function', function () {
            const selection = buildSelectionLocation({
                start: buildEditorCoordinates({
                    line: 19,
                    column: 41
                }),
                end: buildEditorCoordinates({
                    line: 19,
                    column: 41
                })
            });

            const { source, functionNode } = getSelectedFunction(selection, ARROW_FUNCTION_EXPRESSION);

            const functionBody = getFunctionBody(functionNode, source);

            assert.equal(functionBody, '\'foo!\'');
        });
    });
});