require('../../../utilities/approvals').configure();

const { assert } = require('chai');

const {
    buildEditorCoordinates,
    buildSelectionFromEditorCoordinates
} = require('../../../utilities/selection-builder');

const { readFileSource } = require('../../../utilities/file-reader');
const { loadModule } = require('../../../utilities/module-loader');

const { parse } = loadModule('parser/parser');
const { buildNodePath } = loadModule('node-path');

const {
    acceptableNodeTypes,
    buildExtractionScopeList,
    selectExtractionScopes,
    getSourceSelection
} = loadModule('commands/extract-variable/extract-variable');

const { buildExtractionPath } = loadModule('commands/extract-variable/ExtractionPathBuilder');

const { transformSelectionToLocation } = loadModule('code-range-transforms');

function readTestSource() {
    return readFileSource(__dirname, 'fixtures/test-source.js');
}

function buildPathToSelection(selection) {
    const sourceCode = readTestSource();
    const parsedSource = parse(sourceCode);

    return buildNodePath(parsedSource, selection);
}

function getSharedSelection() {
    return buildSelectionFromEditorCoordinates({
        start: buildEditorCoordinates({ line: 10, column: 40 }),
        end: buildEditorCoordinates({ line: 10, column: 41 })
    });
}

const last = values => values[values.length - 1];

describe('extract variable', function () {

    describe('extraction path construction', function () {
        it('builds an extraction path', function () {
            const selection = getSharedSelection();
            const nodePath = buildPathToSelection(selection);

            const extractionPath = buildExtractionPath(nodePath, acceptableNodeTypes);


            this.verifyAsJSON(extractionPath.map(nodes => last(nodes).type));
        });
    });

    describe('extraction scope selection list', function () {
        it('creates a scope selection list from extraction path', function () {
            const selection = getSharedSelection();
            const nodePath = buildPathToSelection(selection);

            const extractionPath = buildExtractionPath(nodePath, acceptableNodeTypes);

            const extractionScopeList = buildExtractionScopeList(extractionPath);

            this.verifyAsJSON(extractionScopeList);
        });
    });

    describe('extraction scope selection', function () {
        it('selects extraction scope using user selected value', function () {
            const selection = getSharedSelection();
            const nodePath = buildPathToSelection(selection);

            const extractionPath = buildExtractionPath(nodePath, acceptableNodeTypes);

            const extractionScopeList = buildExtractionScopeList(extractionPath);

            const userSelection = extractionScopeList[2];

            const selectedScopes = selectExtractionScopes(extractionPath, userSelection);

            this.verifyAsJSON({
                extractionScope: last(selectedScopes.extractionScope).type,
                subordinateScope: last(selectedScopes.subordinateScope).type
            });
        });

        it('sets subordinate scope to null when extraction scope is the local scope', function () {
            const selection = getSharedSelection();
            const nodePath = buildPathToSelection(selection);

            const extractionPath = buildExtractionPath(nodePath, acceptableNodeTypes);

            const extractionScopeList = buildExtractionScopeList(extractionPath);

            const userSelection = extractionScopeList[0];

            const selectedScopes = selectExtractionScopes(extractionPath, userSelection);

            this.verifyAsJSON({
                extractionScope: last(selectedScopes.extractionScope).type,
                subordinateScope: selectedScopes.subordinateScope
            });
        });
    });

    describe('capture selected text', function () {
        it('returns a single line of selected text', function () {
            const selection = buildSelectionFromEditorCoordinates({
                start: buildEditorCoordinates({ line: 6, column: 25 }),
                end: buildEditorCoordinates({ line: 6, column: 32 })
            });

            const sourceCode = readTestSource();

            const sourceSelection = getSourceSelection(sourceCode, selection);

            assert.equal(sourceSelection, 'a === b');
        });

        it('returns multiple lines of selected text', function () {
            const selection = buildSelectionFromEditorCoordinates({
                start: buildEditorCoordinates({ line: 9, column: 32 }),
                end: buildEditorCoordinates({ line: 12, column: 26 })
            });

            const sourceCode = readTestSource();

            const sourceSelection = getSourceSelection(sourceCode, selection);

            this.verify(sourceSelection);
        });
    });

});