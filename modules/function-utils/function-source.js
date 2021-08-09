const { first, last } = require("../core-utils");
const { getSourceSelection } = require("../source-utilities");


function getParametersLocation(parameterNodes) {
    const startLocation = first(parameterNodes).loc.start;
    const endLocation = last(parameterNodes).loc.end;

    return {
        start: startLocation,
        end: endLocation
    }
}

function getFunctionParametersString(functionNode, sourceText) {
    const functionHasValueNode = typeof functionNode.value !== 'undefined';
    const parameterNodes = functionHasValueNode
        ? functionNode.value.params
        : functionNode.params;

    if (parameterNodes.length > 0) {
        const parametersLocation = getParametersLocation(parameterNodes);

        return getSourceSelection(sourceText, parametersLocation);
    } else {
        return '';
    }
}

function getBodyNodeFromFunctionNode(functionNode) {
    return typeof functionNode.value !== 'undefined'
        ? functionNode.value.body
        : functionNode.body
}

function buildLocationFromBodyNodes(functionBodyNodes) {
    const firstLocation = first(functionBodyNodes).loc;
    const lastLocation = last(functionBodyNodes).loc;

    return {
        start: firstLocation.start,
        end: lastLocation.end
    };
}

function getBodyLocationFromEmptyBody(functionBody) {
    return {
        start: {
            line: functionBody.loc.start.line,
            column: functionBody.loc.start.column + 1
        },
        end: {
            line: functionBody.loc.end.line,
            column: functionBody.loc.end.column - 1
        }
    };
}

function getBodyLocation(functionBody) {
    const bodyIsABlock = Array.isArray(functionBody.body);
    const bodyIsNonemptyBlock = bodyIsABlock && functionBody.body.length > 0;

    if (bodyIsNonemptyBlock) {
        return buildLocationFromBodyNodes(functionBody.body);
    } else if (bodyIsABlock) {
        return getBodyLocationFromEmptyBody(functionBody);
    } else {
        return functionBody.loc;
    }
}

function getFunctionBody(functionNode, sourceText) {
    const functionBody = getBodyNodeFromFunctionNode(functionNode);
    const bodyLocation = getBodyLocation(functionBody);

    return getSourceSelection(sourceText, bodyLocation);
}

function getFunctionName(functionNode) {
    if (Boolean(functionNode.id)) {
        return functionNode.id.name;
    } else if (Boolean(functionNode.key)) {
        return functionNode.key.name;
    } else {
        return '';
    }
}

module.exports = {
    getFunctionBody,
    getFunctionName,
    getFunctionParametersString
};