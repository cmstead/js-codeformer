const { findSymbolToRename } = require("../../../../modules/commands/rename/rename");
const { buildNodePath } = require("../../../../modules/node-path");
const { buildLocationFromEditorCoordinates, buildEditorCoordinates } = require("../../../utilities/editor-to-location-selection-builder");
const { readFileSource } = require("../../../utilities/file-reader");
const { parse } = require('../../../../modules/parser/parser');

require('../../../utilities/approvals').configure();

describe('select literal or associated node for rename', function () {
    it('selects a simple variable name', function () {
        const selection = buildLocationFromEditorCoordinates({
            start: buildEditorCoordinates({ line: 4, column: 20 }),
            end: buildEditorCoordinates({ line: 4, column: 20 })
        });

        const fixtureText = readFileSource(__dirname, 'fixtures/identifier-selection-fixture.js');
        const parsedSource = parse(fixtureText)
        const selectionPath = buildNodePath(parsedSource, selection);

        const symbolToRename = findSymbolToRename(selectionPath);

        this.verifyAsJSON(symbolToRename);
    });

    it('selects a function name', function () {
        const selection = buildLocationFromEditorCoordinates({
            start: buildEditorCoordinates({ line: 3, column: 20 }),
            end: buildEditorCoordinates({ line: 3, column: 20 })
        });

        const fixtureText = readFileSource(__dirname, 'fixtures/identifier-selection-fixture.js');
        const parsedSource = parse(fixtureText)
        const selectionPath = buildNodePath(parsedSource, selection);

        const symbolToRename = findSymbolToRename(selectionPath);

        this.verifyAsJSON(symbolToRename);
    });

    it('selects a method name', function () {
        const selection = buildLocationFromEditorCoordinates({
            start: buildEditorCoordinates({ line: 2, column: 7 }),
            end: buildEditorCoordinates({ line: 2, column: 7 })
        });

        const fixtureText = readFileSource(__dirname, 'fixtures/identifier-selection-fixture.js');
        const parsedSource = parse(fixtureText)
        const selectionPath = buildNodePath(parsedSource, selection);

        const symbolToRename = findSymbolToRename(selectionPath);

        this.verifyAsJSON(symbolToRename);
    });

    it('selects a simple parameter name', function () {
        const selection = buildLocationFromEditorCoordinates({
            start: buildEditorCoordinates({ line: 3, column: 25 }),
            end: buildEditorCoordinates({ line: 3, column: 25 })
        });

        const fixtureText = readFileSource(__dirname, 'fixtures/identifier-selection-fixture.js');
        const parsedSource = parse(fixtureText)
        const selectionPath = buildNodePath(parsedSource, selection);

        const symbolToRename = findSymbolToRename(selectionPath);

        this.verifyAsJSON(symbolToRename);
    });

    it('selects an assignment parameter name', function () {
        const selection = buildLocationFromEditorCoordinates({
            start: buildEditorCoordinates({ line: 2, column: 14 }),
            end: buildEditorCoordinates({ line: 2, column: 14 })
        });

        const fixtureText = readFileSource(__dirname, 'fixtures/identifier-selection-fixture.js');
        const parsedSource = parse(fixtureText)
        const selectionPath = buildNodePath(parsedSource, selection);

        const symbolToRename = findSymbolToRename(selectionPath);

        this.verifyAsJSON(symbolToRename);
    });

    it('selects a destructured object parameter name', function () {
        const selection = buildLocationFromEditorCoordinates({
            start: buildEditorCoordinates({ line: 2, column: 22 }),
            end: buildEditorCoordinates({ line: 2, column: 22 })
        });

        const fixtureText = readFileSource(__dirname, 'fixtures/identifier-selection-fixture.js');
        const parsedSource = parse(fixtureText)
        const selectionPath = buildNodePath(parsedSource, selection);

        const symbolToRename = findSymbolToRename(selectionPath);

        this.verifyAsJSON(symbolToRename);
    });

    it('selects a destructured array parameter name', function () {
        const selection = buildLocationFromEditorCoordinates({
            start: buildEditorCoordinates({ line: 2, column: 30 }),
            end: buildEditorCoordinates({ line: 2, column: 30 })
        });

        const fixtureText = readFileSource(__dirname, 'fixtures/identifier-selection-fixture.js');
        const parsedSource = parse(fixtureText)
        const selectionPath = buildNodePath(parsedSource, selection);

        const symbolToRename = findSymbolToRename(selectionPath);

        this.verifyAsJSON(symbolToRename);
    });
});