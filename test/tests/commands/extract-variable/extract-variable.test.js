require('../../../utilities/approvals').configure();

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
    selectExtractionScopes
 } = loadModule('commands/extract-variable/extract-variable');
const { buildExtractionPath } = loadModule('commands/extract-variable/ExtractionPathBuilder')

function buildPathToSelection(selection) {
    const sourceCode = readFileSource(__dirname, 'fixtures/test-source.js');
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
    });

});