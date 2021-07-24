require('../../../utilities/approvals').configure();

const { assert } = require('chai');

const {
    buildEditorCoordinates,
    buildLocationFromEditorCoordinates,
    buildSelectionLocation
} = require('../../../utilities/editor-to-location-selection-builder');

const { loadModule } = require('../../../utilities/module-loader');

const {
    acceptableNodeTypes,
    acceptableVariableTypes,
    buildExtractionScopeList,
    buildVariableDeclaration,
    selectExtractionScopes,
    selectExtractionLocation,
    getSourceSelection
} = loadModule('commands/extract-variable/extract-variable');

const { buildExtractionPath } = loadModule('commands/extract-variable/ExtractionPathBuilder');

const {
    readTestSource,
    buildPathToSelection,
    getSharedSelection,
    last
} = require('./extract-variable-test-helpers');

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
                extractionScope: last(selectedScopes.extractionScope).type
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
                extractionScope: last(selectedScopes.extractionScope).type
            });
        });
    });

    describe('capture selected text', function () {
        it('returns a single line of selected text', function () {
            const selection = buildSelectionLocation({
                start: { line: 6, column: 25 },
                end: { line: 6, column: 32 }
            });

            const sourceCode = readTestSource();

            const sourceSelection = getSourceSelection(sourceCode, selection);

            assert.equal(sourceSelection, 'a === b');
        });

        it('returns multiple lines of selected text', function () {
            const selection = buildLocationFromEditorCoordinates({
                start: buildEditorCoordinates({ line: 9, column: 32 }),
                end: buildEditorCoordinates({ line: 12, column: 26 })
            });

            const sourceCode = readTestSource();

            const sourceSelection = getSourceSelection(sourceCode, selection);

            this.verify(sourceSelection);
        });
    });

    describe('build variable declaration for source insertion', function () {
        it('given a variable type, variable name, and source substring, a variable declaration should be created', function () {
            const variableType = acceptableVariableTypes.CONST;
            const variableName = 'testVar';
            const source = '[\na, \n() => { return b; } \n]';

            const variableDeclaration = buildVariableDeclaration({ variableType, variableName, source });

            assert.equal(variableDeclaration, `${variableType} ${variableName} = ${source};`);
        });

        it('does not double trailing semicolon if source already contains one', function () {
            const variableType = acceptableVariableTypes.CONST;
            const variableName = 'testVar';
            const source = '[\na, \n() => { return b; } \n];';

            const variableDeclaration = buildVariableDeclaration({ variableType, variableName, source });

            assert.equal(variableDeclaration, `${variableType} ${variableName} = ${source}`);
        });
    });

    describe('select extraction location', function () {
        it('selects next surrounding node down from current selected block location', function () {
            const selection = getSharedSelection();
            const nodePath = buildPathToSelection(selection);

            const extractionPath = buildExtractionPath(nodePath, acceptableNodeTypes);

            const extractionScopeList = buildExtractionScopeList(extractionPath);

            const userSelection = extractionScopeList[0];

            const selectedScopes = selectExtractionScopes(extractionPath, userSelection);

            const extractionBlock = selectedScopes.extractionScope[0];
            const extractionLocation = selectExtractionLocation(nodePath, extractionBlock);

            this.verifyAsJSON(extractionLocation);
        });
    });

});