const { getNewVariableBuilder } = require("../../builders/VariableBuilder");
const { getSourceSelection } = require("../../source-utilities");

function getVariableValueString(declaratorNode, source) {
    const initLocation = declaratorNode.init.loc;

    return getSourceSelection(source, initLocation);
}

function getNewVariableString(variableType, variableDeclaratorNode, source) {
    return getNewVariableBuilder({
        type: variableType,
        name: variableDeclaratorNode.id.name,
        value: getVariableValueString(variableDeclaratorNode, source)
    })
        .buildVariableDeclaration();
}

module.exports = {
    getNewVariableString
};