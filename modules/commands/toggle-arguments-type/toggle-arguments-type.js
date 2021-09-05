const { first, last } = require("../../core-utils");
const { getSourceSelection } = require("../../source-utilities");

function buildArgumentTabStop(source, argumentNode, tabStopNumber) {
    const argumentString = getSourceSelection(source, argumentNode.loc);
    return `\${${tabStopNumber}:propertyName${tabStopNumber}}: ${argumentString}`;
}

function buildArgumentObjectSnippet(source, args) {
    const argumentStrings = args
        .map((argumentNode, index) =>
            buildArgumentTabStop(source, argumentNode, index + 1));

    return `{ ${argumentStrings.join(', ')} }`;
}

function buildPositionalArgumentString(source, args) {
    const argumentStrings = first(args).properties
        .map((property) =>
            getSourceSelection(source, property.value.loc));

    return argumentStrings.join(', ');
}

function getArgumentListLocation(argumentList) {
    const firstArgument = first(argumentList);
    const lastArgument = last(argumentList);

    return {
        start: firstArgument.loc.start,
        end: lastArgument.loc.end
    };
}

module.exports = {
    buildArgumentObjectSnippet,
    buildPositionalArgumentString,
    getArgumentListLocation
};