require('../../../utilities/approvals').configure();

const {
    buildEditorCoordinates,
    buildSelectionFromEditorCoordinates
} = require('../../../utilities/selection-builder');

const { readFileSource } = require('../../../utilities/file-reader');
const { loadModule } = require('../../../utilities/module-loader');

const { parse } = loadModule('parser/parser');
const { buildNodePath } = loadModule('node-path');

// const { buildExtractionPath } = loadModule('commands/extract-variable/extract-variable');
const { ExtractionPathBuilder, buildExtractionPath } = loadModule('commands/extract-variable/ExtractionPathBuilder')

describe('extract variable', function () {
    describe('extraction path construction', function () {
        it('builds an extraction path', function () {
            const sourceCode = readFileSource(__dirname, 'fixtures/test-source.js');
            const parsedSource = parse(sourceCode);

            const selection = buildSelectionFromEditorCoordinates({
                start: buildEditorCoordinates({ line: 10, column: 40 }),
                end: buildEditorCoordinates({ line: 10, column: 41 })
            });

            const nodePath = buildNodePath(parsedSource, selection);

            const extractionPath = buildExtractionPath(nodePath);

            const last = values => values[values.length - 1];

            this.verifyAsJSON(extractionPath.map(nodes => last(nodes).type));
        });
    });
});