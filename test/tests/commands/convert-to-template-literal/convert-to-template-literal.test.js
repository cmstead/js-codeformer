const { assert } = require('chai');
require('../../../utilities/approvals').configure();

const { findNearestExpressionToConvert, checkExpressionTree, buildTemplateLiteral } = require("../../../../modules/commands/convert-to-template-literal/convert-to-template-literal");
const { buildNodePath } = require("../../../../modules/node-path");
const { parse } = require("../../../../modules/parser/parser");
const { buildLocationFromEditorCoordinates, buildEditorCoordinates } = require("../../../utilities/editor-to-location-selection-builder");
const { readFileSource } = require("../../../utilities/file-reader");

describe('convert to template literal', function () {
    describe('check expression tree', function () {
        it('returns true if expression is a string literal', function () {
            const fixtureText = readFileSource(__dirname, 'fixtures/test-fixture.js');
            const parsedSource = parse(fixtureText);

            const selectedLocation = buildLocationFromEditorCoordinates({
                start: buildEditorCoordinates({ line: 1, column: 8 }),
                end: buildEditorCoordinates({ line: 1, column: 8 })
            });

            const selectionPath = buildNodePath(parsedSource, selectedLocation);

            const expression = findNearestExpressionToConvert(selectionPath);

            const result = checkExpressionTree(expression);

            assert.isTrue(result);
        });

        it('returns true if expression is a binary expression', function () {
            const fixtureText = readFileSource(__dirname, 'fixtures/test-fixture.js');
            const parsedSource = parse(fixtureText);

            const selectedLocation = buildLocationFromEditorCoordinates({
                start: buildEditorCoordinates({ line: 3, column: 5 }),
                end: buildEditorCoordinates({ line: 3, column: 5 })
            });

            const selectionPath = buildNodePath(parsedSource, selectedLocation);

            const expression = findNearestExpressionToConvert(selectionPath);

            const result = checkExpressionTree(expression);

            assert.isTrue(result);
        });

        it('returns false if expression is not a concat operation', function () {
            const fixtureText = readFileSource(__dirname, 'fixtures/test-fixture.js');
            const parsedSource = parse(fixtureText);

            const selectedLocation = buildLocationFromEditorCoordinates({
                start: buildEditorCoordinates({ line: 5, column: 4 }),
                end: buildEditorCoordinates({ line: 5, column: 4 })
            });

            const selectionPath = buildNodePath(parsedSource, selectedLocation);

            const expression = findNearestExpressionToConvert(selectionPath);

            const result = checkExpressionTree(expression);

            assert.isFalse(result);
        });
    });

    describe('build template literal', function () {
        it('properly builds a template literal from a concatenation expression', function () {
            const fixtureText = readFileSource(__dirname, 'fixtures/test-fixture.js');
            const parsedSource = parse(fixtureText);

            const selectedLocation = buildLocationFromEditorCoordinates({
                start: buildEditorCoordinates({ line: 3, column: 7 }),
                end: buildEditorCoordinates({ line: 3, column: 7 })
            });

            const selectionPath = buildNodePath(parsedSource, selectedLocation);

            const expression = findNearestExpressionToConvert(selectionPath);

            const result = buildTemplateLiteral(expression, fixtureText);

            this.verify(result);
        });
    });
});