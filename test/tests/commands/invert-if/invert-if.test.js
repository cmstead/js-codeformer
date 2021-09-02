const { readFileSource } = require("../../../utilities/file-reader");
const { parse } = require("../../../../modules/parser/parser");
const { buildLocationFromEditorCoordinates, buildEditorCoordinates } = require("../../../utilities/editor-to-location-selection-builder");
const { buildNodePath } = require("../../../../modules/node-path");
const { findNodeInPath } = require("../../../../modules/edit-utils/node-path-utils");
const { IF_STATEMENT } = require("../../../../modules/constants/ast-node-types");
const { invertTestExpression } = require("../../../../modules/commands/invert-if/invert-if");

require('../../../utilities/approvals').configure();

describe('invert if', function () {
    describe('invert test expression', function () {
        it('inverts a positive expression', function () {
            const fixtureText = readFileSource(__dirname, 'fixtures/test-fixture.js');
            const parsedSource = parse(fixtureText);
            const selection = buildLocationFromEditorCoordinates({
                start: buildEditorCoordinates({ line: 2, column: 13 }),
                end: buildEditorCoordinates({ line: 2, column: 13 })
            });

            const selectionPath = buildNodePath(parsedSource, selection);

            const ifNode = findNodeInPath(selectionPath, IF_STATEMENT);

            const result = invertTestExpression(fixtureText, ifNode.test);

            this.verify(result);
        });

        it('inverts a negated expression', function () {
            const fixtureText = readFileSource(__dirname, 'fixtures/test-fixture.js');
            const parsedSource = parse(fixtureText);
            const selection = buildLocationFromEditorCoordinates({
                start: buildEditorCoordinates({ line: 8, column: 13 }),
                end: buildEditorCoordinates({ line: 8, column: 13 })
            });

            const selectionPath = buildNodePath(parsedSource, selection);

            const ifNode = findNodeInPath(selectionPath, IF_STATEMENT);

            const result = invertTestExpression(fixtureText, ifNode.test);

            this.verify(result);
        });
    });
});