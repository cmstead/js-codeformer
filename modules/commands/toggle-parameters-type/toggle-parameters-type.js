const { OBJECT_PATTERN, ARRAY_PATTERN, ASSIGNMENT_PATTERN, IDENTIFIER } = require("../../constants/ast-node-types");
const { getNodeType, first } = require("../../core-utils");
const { getSourceSelection } = require("../../source-utilities");

function buildParameterTabStop(source, parameterNode, tabStopNumber) {
    const objectString = getSourceSelection(source, parameterNode.loc);
    return `\${${tabStopNumber}:parameterName}: ${objectString}`;
}

function buildParameterObjectSnippet(source, parameters) {
    const destructuringPatterns = [OBJECT_PATTERN, ARRAY_PATTERN];
    let tabStopNumber = 0;

    const parameterStrings = parameters.map(parameterNode => {
        const parameterNodeType = getNodeType(parameterNode);

        if (parameterNodeType === ASSIGNMENT_PATTERN) {
            const assignmentString = getSourceSelection(source, parameterNode.loc);

            return assignmentString;
        } else if (destructuringPatterns.includes(parameterNodeType)) {
            tabStopNumber++;

            return buildParameterTabStop(source, parameterNode, tabStopNumber);
        } else {
            return parameterNode.name;
        }
    });

    return `{ ${parameterStrings.join(', ')} }`;
}

function buildPositionalParameterString(source, parameters) {
    const parameterStrings = first(parameters).properties
        .map(property => {
            if (getNodeType(property.value) !== IDENTIFIER) {
                return getSourceSelection(source, property.value.loc);
            } else {
                return property.value.name;
            }
        });

    return parameterStrings.join(', ');
}

module.exports = {
    buildParameterObjectSnippet,
    buildPositionalParameterString
};