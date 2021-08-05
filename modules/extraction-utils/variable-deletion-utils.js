const { VARIABLE_DECLARATION, VARIABLE_DECLARATOR } = require("../constants/ast-node-types");
const { getSourceSelection } = require("../source-utilities");

function getSourceLines(source, selectedLocation) {
    const lineStart = selectedLocation.start.line - 1;
    const lineEnd = selectedLocation.end.line;

    return source
        .split(/\r?\n/g)
        .slice(lineStart, lineEnd)
        .join('\n')
}

function normalizeSelection(textSelection) {
    return textSelection.trim().replace(/\s+/g, ' ');
}

function getNormalizedSourceSelection(source, selectedLocation) {
    const selection = getSourceSelection(source, selectedLocation);

    return normalizeSelection(selection);
}

function getNormalizedSourceLines(source, selectedLocation) {
    const sourceLines = getSourceLines(source, selectedLocation);

    return normalizeSelection(sourceLines);
}

function buildDeletionLocation(
    sourceIsDifferentThanLocation,
    selectedLocation,
    selectedNode
) {
    const {
        start: { line: startLine, column: startColumn },
        end: { line: endLine, column: endColumn}
    } = selectedLocation;

    const selectionIsADeclaration = selectedNode.type === VARIABLE_DECLARATION;
    const selectionIsADeclarator = selectedNode.type === VARIABLE_DECLARATOR;
    const onlyDeleteSelection = sourceIsDifferentThanLocation && selectionIsADeclaration;

    if (onlyDeleteSelection) {
        return selectedLocation;
    } else if (selectionIsADeclarator) {
        return {
            start: { line: startLine, column: startColumn },
            end: { line: endLine, column: endColumn + 1 }
        };
    } else {
        return {
            start: { line: startLine, column: 0 },
            end: { line: endLine + 1, column: 0 }
        };
    }
}

function chooseDeclarationNode(declaratorNode, declarationNode) {
    const multipleDeclarationsExist = declarationNode.declarations.length > 1;
    return multipleDeclarationsExist ? declaratorNode : declarationNode
}

function pickVariableDeletionLocation(declaratorNode, declarationNode, source) {
    const selectedNode = chooseDeclarationNode(declaratorNode, declarationNode);
    const selectedLocation = selectedNode.loc;

    const declarationSourceLines = getNormalizedSourceSelection(source, selectedLocation);
    const rawSourceLines = getNormalizedSourceLines(source, selectedLocation);

    return buildDeletionLocation(
        rawSourceLines !== declarationSourceLines,
        selectedLocation,
        selectedNode
    );
}

module.exports = {
    pickVariableDeletionLocation
};