require('../../../utilities/approvals').configure();

const { assert } = require('chai');

const {
    getLocallyScopedDeclarations,
    getSubordinateScopeParameters
} = require('../../../../modules/commands/extract-method/parameter-search');

const {
    buildEditorCoordinates,
    buildLocationFromEditorCoordinates
} = require('../../../utilities/editor-to-location-selection-builder');

const { loadModule } = require('../../../utilities/module-loader');
const { readFileSource } = require('../../../utilities/file-reader');
const { parse } = require('../../../../modules/parser/parser');
const { buildNodePath } = require('../../../../modules/node-path');
const { buildExtractionPath } = require('../../../../modules/extraction-utils/ExtractionPathBuilder');
const { acceptableNodeTypes, buildMethodCallText } = require('../../../../modules/commands/extract-method/extract-method');
const { JSX_ELEMENT } = require('../../../../modules/constants/ast-node-types');

const { getSourceSelection } = loadModule('source-utilities');
const {
    BLOCK_STATEMENT,
    CLASS_BODY,
    OBJECT_EXPRESSION
} = loadModule('constants/ast-node-types');

const {
    buildMethodText,
    parseSelectedText
} = loadModule('commands/extract-method/extract-method');

describe('extract method behaviors', function () {

    describe('get parsed selection', function () {
        it('captures selected text and parses it', function () {
            const selectedLocation = buildLocationFromEditorCoordinates({
                start: buildEditorCoordinates({ line: 9, column: 32 }),
                end: buildEditorCoordinates({ line: 12, column: 26 })
            });

            const testSource = readFileSource(__dirname, 'fixtures/test-source.js');

            const parsedSelection = parseSelectedText(testSource, selectedLocation);

            this.verifyAsJSON(parsedSelection);
        });

        it('throws human readable error when selection is unparseable', function () {
            const selectedLocation = buildLocationFromEditorCoordinates({
                start: buildEditorCoordinates({ line: 9, column: 33 }),
                end: buildEditorCoordinates({ line: 12, column: 26 })
            });

            const testSource = readFileSource(__dirname, 'fixtures/test-source.js');

            assert.throws(
                () => parseSelectedText(testSource, selectedLocation),
                'Selected source cannot be interpreted, unable to extract method'
            );
        });
    });

    describe('select parameters', function () {
        it('captures necessary parameters for all bound variables from simple local scope', function () {
            const selectedLocation = buildLocationFromEditorCoordinates({
                start: buildEditorCoordinates({ line: 14, column: 25 }),
                end: buildEditorCoordinates({ line: 24, column: 52 })
            });

            const testSource = readFileSource(__dirname, 'fixtures/test-source.js');

            const parsedSelection = parseSelectedText(testSource, selectedLocation);

            const selectedParameters = getSubordinateScopeParameters(parsedSelection);

            assert.equal(JSON.stringify(selectedParameters), JSON.stringify(['b', 'a']))
        });

        it('excludes variables declared in ancestor scopes to extraction location', function () {
            const selectedLocation = buildLocationFromEditorCoordinates({
                start: buildEditorCoordinates({ line: 5, column: 16 }),
                end: buildEditorCoordinates({ line: 5, column: 21 })
            });

            const testSource = readFileSource(__dirname, 'fixtures/mixed-scope-var-declarations.js');

            const parsedSource = parse(testSource);
            const nodePath = buildNodePath(parsedSource, selectedLocation);
            const extractionPath = buildExtractionPath(nodePath, acceptableNodeTypes);
            const extractionLocation = extractionPath[1][0];

            const capturedDeclarations = getLocallyScopedDeclarations(extractionPath, extractionLocation);

            assert.equal(JSON.stringify(capturedDeclarations), JSON.stringify(['a']));
        });
    });

    describe('create method text', function () {
        it('creates a function declaration by default', function () {
            const selectedLocation = buildLocationFromEditorCoordinates({
                start: buildEditorCoordinates({ line: 14, column: 25 }),
                end: buildEditorCoordinates({ line: 24, column: 52 })
            });

            const testSource = readFileSource(__dirname, 'fixtures/test-source.js');

            const selectedSource = getSourceSelection(testSource, selectedLocation);

            const methodText = buildMethodText({
                destinationType: BLOCK_STATEMENT,
                methodBody: selectedSource,
                methodName: 'testMethod',
                parameters: ['a', 'b', 'c']
            });

            this.verify(methodText);
        });

        it('creates a class method when destination is a class body', function () {
            const selectedLocation = buildLocationFromEditorCoordinates({
                start: buildEditorCoordinates({ line: 14, column: 25 }),
                end: buildEditorCoordinates({ line: 24, column: 52 })
            });

            const testSource = readFileSource(__dirname, 'fixtures/test-source.js');

            const selectedSource = getSourceSelection(testSource, selectedLocation);

            const methodText = buildMethodText({
                destinationType: CLASS_BODY,
                methodBody: selectedSource,
                methodName: 'testMethod',
                parameters: ['a', 'b', 'c']
            });

            this.verify(methodText);
        });

        it('creates a object literal method when destination is an object expression', function () {
            const selectedLocation = buildLocationFromEditorCoordinates({
                start: buildEditorCoordinates({ line: 14, column: 25 }),
                end: buildEditorCoordinates({ line: 24, column: 52 })
            });

            const testSource = readFileSource(__dirname, 'fixtures/test-source.js');

            const selectedSource = getSourceSelection(testSource, selectedLocation);

            const methodText = buildMethodText({
                destinationType: OBJECT_EXPRESSION,
                methodBody: selectedSource,
                methodName: 'testMethod',
                parameters: ['a', 'b', 'c']
            });

            this.verify(methodText);
        });

        it('does not add return to for loop expression', function () {
            const selectedLocation = buildLocationFromEditorCoordinates({
                start: buildEditorCoordinates({ line: 1, column: 1 }),
                end: buildEditorCoordinates({ line: 3, column: 2 })
            });

            const testSource = readFileSource(__dirname, 'fixtures/for-loop-source.js');

            const selectedSource = getSourceSelection(testSource, selectedLocation);

            const methodText = buildMethodText({
                destinationType: OBJECT_EXPRESSION,
                methodBody: selectedSource,
                methodName: 'testMethod',
                parameters: ['a', 'b', 'c']
            });

            this.verify(methodText);
        });

        it('returns final value if final statement is an initialized variable declaration', function () {
            const selectedLocation = buildLocationFromEditorCoordinates({
                start: buildEditorCoordinates({ line: 2, column: 5 }),
                end: buildEditorCoordinates({ line: 3, column: 47 })
            });

            const testSource = readFileSource(__dirname, 'fixtures/extract-with-variable-declaration.js');

            const selectedSource = getSourceSelection(testSource, selectedLocation);

            const methodText = buildMethodText({
                destinationType: OBJECT_EXPRESSION,
                methodBody: selectedSource,
                methodName: 'testMethod',
                parameters: ['a', 'b', 'c']
            });

            this.verify(methodText);
        });

        it('returns final value even when declaration is the only statement', function () {
            const selectedLocation = buildLocationFromEditorCoordinates({
                start: buildEditorCoordinates({ line: 2, column: 5 }),
                end: buildEditorCoordinates({ line: 2, column: 29 })
            });

            const testSource = readFileSource(__dirname, 'fixtures/extract-with-variable-declaration.js');

            const selectedSource = getSourceSelection(testSource, selectedLocation);

            const methodText = buildMethodText({
                destinationType: OBJECT_EXPRESSION,
                methodBody: selectedSource,
                methodName: 'testMethod',
                parameters: ['a', 'b', 'c']
            });

            this.verify(methodText);
        });
    });

    describe('build method call text', function () {

        it('returns a simple function call when extraction is to a block scope', function () {
            const destinationType = BLOCK_STATEMENT;
            const methodName = 'testFunction';
            const parameters = 'a, b, c';

            const functionString = buildMethodCallText({
                destinationType,
                methodName,
                parameters
            });

            this.verify(functionString);
        });

        it('returns a method-stype function call when extracted to an object scope', function () {
            const destinationType = CLASS_BODY;
            const methodName = 'testFunction';
            const parameters = 'a, b, c';

            const functionString = buildMethodCallText({
                destinationType,
                methodName,
                parameters
            });

            this.verify(functionString);
        });

        it('returns a JSX expression when replacement node is a JSX element', function () {
            const destinationType = CLASS_BODY;
            const methodName = 'testFunction';
            const parameters = 'a, b, c';
            const selectedReplacementNode = { type: JSX_ELEMENT }

            const functionString = buildMethodCallText({
                destinationType,
                methodName,
                parameters,
                selectedNode: selectedReplacementNode
            });

            this.verify(functionString);
        });

        it('assigns returned value to a variable when the body has a variable declaration at the end', function () {
            const destinationType = CLASS_BODY;
            const methodName = 'testFunction';
            const parameters = 'a, b, c';
            const methodBody = 'const testVar = "this is a test"';

            const functionString = buildMethodCallText({
                destinationType,
                methodName,
                parameters,
                methodBody
            });

            this.verify(functionString);
        });

    });
});