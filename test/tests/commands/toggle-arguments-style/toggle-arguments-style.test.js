const { getArgumentListLocation, buildArgumentObjectSnippet, buildPositionalArgumentString } = require("../../../../modules/commands/toggle-arguments-type/toggle-arguments-type");
const { CALL_EXPRESSION } = require("../../../../modules/constants/ast-node-types");
const { findNodeInPath } = require("../../../../modules/edit-utils/node-path-utils");
const { buildNodePath } = require("../../../../modules/node-path");
const { parse } = require("../../../../modules/parser/parser");
const { buildLocationFromEditorCoordinates, buildEditorCoordinates } = require("../../../utilities/editor-to-location-selection-builder");
const { readFileSource } = require("../../../utilities/file-reader");

require('../../../utilities/approvals').configure();

describe('toggle function call argument style -- positional or object', function () {
    describe('get arguments location', function () {
        it('returns position for entire arguments list', function () {
            const fixtureText = readFileSource(__dirname, "fixtures/test-fixture.js");
            const parsedSource = parse(fixtureText);

            const selectionLocation = buildLocationFromEditorCoordinates({
                start: buildEditorCoordinates({ line: 1, column: 15 }),
                end: buildEditorCoordinates({ line: 1, column: 15 })
            })

            const selectionPath = buildNodePath(parsedSource, selectionLocation);

            const callNode = findNodeInPath(selectionPath, CALL_EXPRESSION);

            const argumentListLocation = getArgumentListLocation(callNode.arguments);

            this.verifyAsJSON(argumentListLocation);
        });
    });

    describe('build argument object snippet', function () {
        it('returns a tab-stopped snippet for an object-style argument', function () {
            const fixtureText = readFileSource(__dirname, "fixtures/test-fixture.js");
            const parsedSource = parse(fixtureText);

            const selectionLocation = buildLocationFromEditorCoordinates({
                start: buildEditorCoordinates({ line: 1, column: 15 }),
                end: buildEditorCoordinates({ line: 1, column: 15 })
            })

            const selectionPath = buildNodePath(parsedSource, selectionLocation);

            const callNode = findNodeInPath(selectionPath, CALL_EXPRESSION);

            const argumentObjectSnippet = buildArgumentObjectSnippet(fixtureText, callNode.arguments);

            this.verify(argumentObjectSnippet);
        });
    });

    describe('build positional argument string', function () {
        it('returns a positional argument string when arguments are an object', function () {
            const fixtureText = readFileSource(__dirname, "fixtures/test-fixture.js");
            const parsedSource = parse(fixtureText);

            const selectionLocation = buildLocationFromEditorCoordinates({
                start: buildEditorCoordinates({ line: 2, column: 15 }),
                end: buildEditorCoordinates({ line: 2, column: 15 })
            })

            const selectionPath = buildNodePath(parsedSource, selectionLocation);

            const callNode = findNodeInPath(selectionPath, CALL_EXPRESSION);

            const argumentObjectSnippet = buildPositionalArgumentString(fixtureText, callNode.arguments);

            this.verify(argumentObjectSnippet);
        });
    });
});