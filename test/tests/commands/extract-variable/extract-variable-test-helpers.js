const { readFileSource } = require('../../../utilities/file-reader');
const { loadModule } = require('../../../utilities/module-loader');
const { last } = require('../../../../modules/core-utils');

const { parse } = loadModule('parser/parser');
const { buildNodePath } = loadModule('node-path');

const {
    buildEditorCoordinates,
    buildLocationFromEditorCoordinates
} = require('../../../utilities/editor-to-location-selection-builder');


function readTestSource() {
    return readFileSource(__dirname, 'fixtures/test-source.js');
}

function buildPathToSelection(selection) {
    const sourceCode = readTestSource();
    const parsedSource = parse(sourceCode);

    return buildNodePath(parsedSource, selection);
}

function getSharedSelection() {
    return buildLocationFromEditorCoordinates({
        start: buildEditorCoordinates({ line: 10, column: 40 }),
        end: buildEditorCoordinates({ line: 10, column: 41 })
    });
}

module.exports = {
    readTestSource,
    buildPathToSelection,
    getSharedSelection,
    last
};