const { getPropertyDeclarationString } = require("../../../../modules/commands/toggle-property-declaration/toggle-property-declaration");
const { PROPERTY } = require("../../../../modules/constants/ast-node-types");
const { findNodeInPath } = require("../../../../modules/edit-utils/node-path-utils");
const { buildNodePath } = require("../../../../modules/node-path");
const { parse } = require("../../../../modules/parser/parser");
const { buildLocationFromEditorCoordinates, buildEditorCoordinates } = require("../../../utilities/editor-to-location-selection-builder");
const { readFileSource } = require("../../../utilities/file-reader");

const { assert } = require('chai');

describe('Toggle property declaration type', function () {
    describe('get property declaration string', function () {
        it('returns standard property declaration string when property is shorthand', function () {
            const fixtureText = readFileSource(__dirname, 'fixtures/test-fixture.js');
            const parsedSource  = parse(fixtureText);

            const selectedLocation = buildLocationFromEditorCoordinates({
                start: buildEditorCoordinates({ line: 5, column: 7 }),
                end: buildEditorCoordinates({ line: 5, column: 7 })
            });

            const selectionPath = buildNodePath(parsedSource, selectedLocation);

            const propertyNode = findNodeInPath(selectionPath, PROPERTY);

            const declarationString = getPropertyDeclarationString(propertyNode);
            const expectedString = 'foo: foo';

            assert.equal(declarationString, expectedString);
        });
    });
});