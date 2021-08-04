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
const { acceptableNodeTypes } = require('../../../../modules/commands/extract-method/extract-method');

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

            const expectedOutput = {
                "declaredVariables": { "d": true, "addSomething": true, "foo": true },
                "variablesInUse": { "b": true, "addSomething": true, "a": true, "d": true }
            };

            assert.equal(JSON.stringify(selectedParameters), JSON.stringify(expectedOutput));
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

            assert.equal(JSON.stringify(capturedDeclarations), JSON.stringify({ a: true }));
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
    });
});