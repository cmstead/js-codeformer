const { findClassPropertyDeclaration, buildFunctionString } = require("../../../../modules/commands/convert-to-method/convert-to-method");
const { buildNodePath } = require("../../../../modules/node-path");
const { parse } = require("../../../../modules/parser/parser");
const { buildLocationFromEditorCoordinates, buildEditorCoordinates } = require("../../../utilities/editor-to-location-selection-builder");
const { readFileSource } = require("../../../utilities/file-reader");

require('../../../utilities/approvals').configure();

describe('convert to method', function () {
    it('converts arrow function property to method', function () {
        const fixtureText = readFileSource(__dirname, 'fixtures/test-fixture.ts');
        const parsedSource = parse(fixtureText);

        const selectedLocation = buildLocationFromEditorCoordinates({
            start: buildEditorCoordinates({ line: 2, column: 33 }),
            end: buildEditorCoordinates({ line: 2, column: 33 })
        });

        const selectionPath = buildNodePath(parsedSource, selectedLocation);

        const propertyNode = findClassPropertyDeclaration(selectionPath);

        const methodString = buildFunctionString(propertyNode, fixtureText);

        this.verify(methodString);
    });

    it('converts function expression property to method', function () {
        const fixtureText = readFileSource(__dirname, 'fixtures/test-fixture.ts');
        const parsedSource = parse(fixtureText);

        const selectedLocation = buildLocationFromEditorCoordinates({
            start: buildEditorCoordinates({ line: 4, column: 43 }),
            end: buildEditorCoordinates({ line: 4, column: 43 })
        });

        const selectionPath = buildNodePath(parsedSource, selectedLocation);

        const propertyNode = findClassPropertyDeclaration(selectionPath);

        const methodString = buildFunctionString(propertyNode, fixtureText);

        this.verify(methodString);
    });
});