require('../../utilities/approvals').configure();

const {
    buildEditorCoordinates,
    buildSelectionFromEditorCoordinates
} = require('../../utilities/selection-builder');

const { readFileSource } = require('../../utilities/file-reader');
const { loadModule } = require('../../utilities/module-loader');

const { parse } = loadModule('parser/parser');
const { buildNodePath } = loadModule('node-path');

describe('node path builder', function () {
    it('builds an array of parent nodes to selection', function () {
        const fileSource = readFileSource(__dirname, 'fixtures/nested-nodes.js');

        const parsedSource = parse(fileSource);

        const selection = buildSelectionFromEditorCoordinates({
            start: buildEditorCoordinates({ line: 11, column: 44 }),
            end: buildEditorCoordinates({ line: 11, column: 45 })
        });

        const nodePath = buildNodePath(parsedSource, selection);

        this.verifyAsJSON(nodePath.map(node => node.type));
    });
});