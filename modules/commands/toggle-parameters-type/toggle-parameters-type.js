const { OBJECT_PATTERN, ARRAY_PATTERN, ASSIGNMENT_PATTERN, IDENTIFIER } = require("../../constants/ast-node-types");
const { getNodeType, first } = require("../../core-utils");
const { getSourceSelection } = require("../../source-utilities");

function buildParameterObjectSnippet(source, parameters) {
    let tabStopNumber = 1;

    const parameterStrings = parameters.map(parameterNode => {
        const parameterNodeType = getNodeType(parameterNode);
        console.log(parameterNodeType);

        if (parameterNodeType === ASSIGNMENT_PATTERN) {
            const assignmentString = getSourceSelection(source, parameterNode.loc);

            return assignmentString;
        } else if ([OBJECT_PATTERN, ARRAY_PATTERN].includes(parameterNodeType)) {
            const objectString = getSourceSelection(source, parameterNode.loc);
            const tabStopString = `\${${tabStopNumber}:parameterName}: ${objectString}`;

            tabStopNumber++;

            return tabStopString;
        } else {
            return parameterNode.name;
        }
    });

    return `{ ${parameterStrings.join(', ')} }`;
}

function buildPositionalParameterString(source, parameters) {
    const parameterStrings = first(parameters).properties
        .map(property => {
            if(getNodeType(property.value) !== IDENTIFIER) {
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