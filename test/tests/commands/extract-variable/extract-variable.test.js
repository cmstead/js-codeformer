require('../../../utilities/approvals').configure();

const {
    buildEditorCoordinates,
    buildSelectionFromEditorCoordinates
} = require('../../../utilities/selection-builder');

const { readFileSource } = require('../../../utilities/file-reader');
const { loadModule } = require('../../../utilities/module-loader');

const { parse } = loadModule('parser/parser');
const { buildNodePath } = loadModule('node-path');