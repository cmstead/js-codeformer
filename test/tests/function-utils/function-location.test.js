require('../../utilities/approvals').configure()

const { FUNCTION_DECLARATION } = require("../../../modules/constants/ast-node-types");
const { getNodeType } = require('../../../modules/core-utils');
const { getBodyCoordinates } = require("../../../modules/function-utils/function-location");
const { buildNodePath } = require("../../../modules/node-path");
const { parse } = require("../../../modules/parser/parser");
const { buildLocationFromEditorCoordinates, buildEditorCoordinates } = require("../../utilities/editor-to-location-selection-builder");
const { readFileSource } = require("../../utilities/file-reader");

describe('function location utilities', function () {
    describe('get function body location', function () {
        it('gets the location for a function with body source lines', function () {
            const sourceText = readFileSource(__dirname, 'fixtures/test-source.js');

            const sourceAst = parse(sourceText);

            const location = buildLocationFromEditorCoordinates({
                start: buildEditorCoordinates({
                    line: 2,
                    column: 15
                }),
                end: buildEditorCoordinates({
                    line: 2,
                    column: 15
                })
            });

            const selectionPath = buildNodePath(sourceAst, location);

            selectionPath.reverse();

            const functionNode = selectionPath.find(node => getNodeType(node) === FUNCTION_DECLARATION);

            const bodyCoordinates = getBodyCoordinates(functionNode.body);

            this.verifyAsJSON(bodyCoordinates);
        });
    });

    it('gets the location for a function with body source lines', function () {
        const sourceText = readFileSource(__dirname, 'fixtures/test-source.js');

        const sourceAst = parse(sourceText);

        const location = buildLocationFromEditorCoordinates({
            start: buildEditorCoordinates({
                line: 8,
                column: 5
            }),
            end: buildEditorCoordinates({
                line: 8,
                column: 5
            })
        });

        const selectionPath = buildNodePath(sourceAst, location);

        selectionPath.reverse();

        const functionNode = selectionPath.find(node => getNodeType(node) === FUNCTION_DECLARATION);

        const bodyCoordinates = getBodyCoordinates(functionNode.body);

        this.verifyAsJSON(bodyCoordinates);
    });
});
