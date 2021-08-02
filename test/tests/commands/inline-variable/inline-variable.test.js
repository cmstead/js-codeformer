const { getSurroundingScope, getVariableDeclaractor, selectReplacementLocations, getDeclarationBody } = require("../../../../modules/commands/inline-variable/inline-variable");
const { buildNodePath } = require("../../../../modules/node-path");
const { parse } = require("../../../../modules/parser/parser");
const { buildLocationFromEditorCoordinates, buildEditorCoordinates } = require("../../../utilities/editor-to-location-selection-builder");
const { readFileSource } = require("../../../utilities/file-reader");

describe('inline variable', function () {
    describe('get surrounding scope', function () {
        it('selects surrounding block scope when inside of a block', function () {
            const sourceCode = readFileSource(__dirname, 'fixtures/test-source.js');
            const parsedSource = parse(sourceCode);

            const selection = buildLocationFromEditorCoordinates({
                start: buildEditorCoordinates({ line: 4, column: 12 }),
                end: buildEditorCoordinates({ line: 4, column: 12 })
            });

            const selectionPath = buildNodePath(parsedSource, selection);

            const surroundingScope = getSurroundingScope(selectionPath);

            this.verifyAsJSON(surroundingScope);
        });

        it('selects program scope when not inside of any block', function () {
            const sourceCode = readFileSource(__dirname, 'fixtures/test-source.js');
            const parsedSource = parse(sourceCode);

            const selection = buildLocationFromEditorCoordinates({
                start: buildEditorCoordinates({ line: 1, column: 8 }),
                end: buildEditorCoordinates({ line: 1, column: 8 })
            });

            const selectionPath = buildNodePath(parsedSource, selection);

            const surroundingScope = getSurroundingScope(selectionPath);

            this.verifyAsJSON(surroundingScope);
        });
    });

    describe('select variable declarator', function () {
        it('finds the variable declarator from the selection path', function () {
            const sourceCode = readFileSource(__dirname, 'fixtures/test-source.js');
            const parsedSource = parse(sourceCode);

            const selection = buildLocationFromEditorCoordinates({
                start: buildEditorCoordinates({ line: 4, column: 12 }),
                end: buildEditorCoordinates({ line: 4, column: 12 })
            });

            const selectionPath = buildNodePath(parsedSource, selection);

            const variableDeclarator = getVariableDeclaractor(selectionPath);

            this.verifyAsJSON(variableDeclarator);
        });
    });

    describe('get declarator body', function () {
        it('returns variable declaration body text', function () {
            const sourceCode = readFileSource(__dirname, 'fixtures/test-source.js');
            const parsedSource = parse(sourceCode);

            const selection = buildLocationFromEditorCoordinates({
                start: buildEditorCoordinates({ line: 4, column: 12 }),
                end: buildEditorCoordinates({ line: 4, column: 12 })
            });

            const selectionPath = buildNodePath(parsedSource, selection);

            const variableDeclarator = getVariableDeclaractor(selectionPath);

            const declaratorBody = getDeclarationBody(variableDeclarator, sourceCode);

            this.verify(declaratorBody);
        });
    });

    describe('select replacement locations', function () {
        it('captures only appropriate identifiers for replacement', function () {
            const sourceCode = readFileSource(__dirname, 'fixtures/test-source.js');
            const parsedSource = parse(sourceCode);

            const selection = buildLocationFromEditorCoordinates({
                start: buildEditorCoordinates({ line: 4, column: 12 }),
                end: buildEditorCoordinates({ line: 4, column: 12 })
            });

            const selectionPath = buildNodePath(parsedSource, selection);

            const surroundingScope = getSurroundingScope(selectionPath);
            const variableDeclarator = getVariableDeclaractor(selectionPath);

            const selectedLocations = selectReplacementLocations(surroundingScope, variableDeclarator);

            this.verifyAsJSON(selectedLocations);
        });

        it('captures variable use in a returned binary expression', function () {
            const sourceCode = readFileSource(__dirname, 'fixtures/nested-source.js');
            const parsedSource = parse(sourceCode);

            const selection = buildLocationFromEditorCoordinates({
                start: buildEditorCoordinates({ line: 14, column: 31 }),
                end: buildEditorCoordinates({ line: 14, column: 31 })
            });

            const selectionPath = buildNodePath(parsedSource, selection);

            const surroundingScope = getSurroundingScope(selectionPath);
            const variableDeclarator = getVariableDeclaractor(selectionPath);

            const selectedLocations = selectReplacementLocations(surroundingScope, variableDeclarator);

            this.verifyAsJSON(selectedLocations);
        });
    });
});