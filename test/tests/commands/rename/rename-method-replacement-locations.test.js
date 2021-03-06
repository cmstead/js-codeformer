require('../../../utilities/approvals').configure();

const { buildNodePath } = require("../../../../modules/node-path");
const { parse } = require("../../../../modules/parser/parser");
const { buildLocationFromEditorCoordinates, buildEditorCoordinates } = require("../../../utilities/editor-to-location-selection-builder");
const { readFileSource } = require("../../../utilities/file-reader");
const { selectReplacementLocations, getSurroundingScope, findSymbolToRename } = require("../../../../modules/commands/rename/rename");

describe('rename replacement location finder', function () {
    it('find all references to a class method for renaming', function () {
        const sourceCodeToSearch = readFileSource(__dirname, "fixtures/select-class-methods-identifiers.js");
        const parsedSourceCode = parse(sourceCodeToSearch);
        const selectedMethodLocation = buildLocationFromEditorCoordinates({
            start: buildEditorCoordinates({
                line: 2,
                column: 5
            }),
            end: buildEditorCoordinates({
                line: 2,
                column: 5
            })
        });
        const selectionPath = buildNodePath(parsedSourceCode, selectedMethodLocation);

        const nearestScope = getSurroundingScope(selectionPath);

        const variableDeclaratorNode = findSymbolToRename(selectionPath);

        const renameLocations = selectReplacementLocations(nearestScope, variableDeclaratorNode);

        this.verifyAsJSON(renameLocations);

    });

    it('find all references to a object literal method for renaming', function () {
        const sourceCodeToSearch = readFileSource(__dirname, "fixtures/select-object-literal-method-locations.js");
        const parsedSourceCode = parse(sourceCodeToSearch);
        const selectedMethodLocation = buildLocationFromEditorCoordinates({
            start: buildEditorCoordinates({
                line: 2,
                column: 8
            }),
            end: buildEditorCoordinates({
                line: 2,
                column: 8
            })
        });
        const selectionPath = buildNodePath(parsedSourceCode, selectedMethodLocation);

        const nearestScope = getSurroundingScope(selectionPath);

        const variableDeclaratorNode = findSymbolToRename(selectionPath);

        const renameLocations = selectReplacementLocations(nearestScope, variableDeclaratorNode);

        this.verifyAsJSON(renameLocations);

    });
});