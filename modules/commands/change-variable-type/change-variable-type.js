const { getSourceSelection } = require("../../source-utilities");

function getVariableValueString(declaratorNode, source) {
    const initLocation = declaratorNode.init.loc;

    return getSourceSelection(source, initLocation);
}

module.exports = {
    getVariableValueString
};