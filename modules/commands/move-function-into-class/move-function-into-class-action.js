const { asyncPrepareActionSetup } = require('../../action-setup');
const { findNodeByCheckFunction } = require('../../edit-utils/node-path-utils');
const { getNodeType, first } = require('../../core-utils');
const { parseAndShowMessage, buildInfoMessage } = require('../../ui-services/messageService');
const { validateUserInput } = require('../../validatorService');

const {
    FUNCTION_DECLARATION,
    FUNCTION_EXPRESSION,
    ARROW_FUNCTION_EXPRESSION,
    METHOD_DEFINITION,
    CLASS_DECLARATION
} = require('../../constants/ast-node-types');

const { getFunctionDeclaration, getFunctionName, getFunctionNode, getMethodWriteLocation } = require('./move-function-into-class');
const { getMethodBuilder } = require('../../builders/MethodBuilder');
const { getFunctionBody, getFunctionParametersString } = require('../../function-utils/function-source');
const { openSelectList } = require('../../ui-services/inputService');
const { transformLocationToRange, transformLocationPartToPosition } = require('../../edit-utils/textEditTransforms');
const { getNewSourceEdit } = require('../../edit-utils/SourceEdit');
const { compareLocations } = require('../../edit-utils/location-service');

let functionTypes = [
    FUNCTION_DECLARATION,
    FUNCTION_EXPRESSION,
    ARROW_FUNCTION_EXPRESSION
];

const UNNAMED_CLASS = 'unnamed class';
function moveFunctionIntoClass() {
    let actionSetup = null;
    let methodString = null;
    let classNodes = null;
    let receivingClass = null;
    let functionDeclaration = null;

    return asyncPrepareActionSetup()
        .then((newActionSetup) => actionSetup = newActionSetup)

        .then(() => findNodeByCheckFunction(
            actionSetup.selectionPath,
            (node) => functionTypes.includes(getNodeType(node))))

        .then((functionNode) =>
            getFunctionDeclaration(functionNode, actionSetup.selectionPath))

        .then((functionDeclaration) => validateUserInput({
            value: functionDeclaration,
            validator: (functionDeclaration) => functionDeclaration !== null,
            message: buildInfoMessage('Unable to find a function declaration to move')
        }))

        .then((newFunctionDeclaration) => functionDeclaration = newFunctionDeclaration)

        .then((functionDeclaration) => ({
            functionName: getFunctionName(functionDeclaration),
            functionNode: getFunctionNode(functionDeclaration)
        }))

        .then(({ functionName, functionNode }) => getMethodBuilder({
            functionType: METHOD_DEFINITION,
            functionName,
            functionBody: getFunctionBody(functionNode, actionSetup.source),
            functionParameters: getFunctionParametersString(functionNode),
            async: functionNode.async,
            generator: functionNode.generator
        }).buildNewMethod())

        .then((newMethodString) => methodString = newMethodString)

        .then(() => first(actionSetup.selectionPath).body.filter(node => getNodeType(node) === CLASS_DECLARATION))
        .then((classNodes) => validateUserInput({
            value: classNodes,
            validator: (classNodes) => classNodes.length > 0,
            message: buildInfoMessage('Unable to locate classes to receive moved function')
        }))

        .then((newClassNodes) => classNodes = newClassNodes)

        .then((classNodes) => openSelectList({
            values: classNodes.map((node) => node.id !== null ? node.id.name : UNNAMED_CLASS),
            title: 'Move to which class?'
        }))
        .then((className) => validateUserInput({
            value: className,
            validator: (className) => className.trim() !== '',
            message: buildInfoMessage('No class selected to receive moved function; are your classes defined at the top of your module?')
        }))

        .then((className) => receivingClass = classNodes.find((node) =>
            (className === UNNAMED_CLASS && node.id === null)
            || (node.id !== null && node.id.name === className)))

        .then(() => getMethodWriteLocation(receivingClass))

        .then((methodWriteLocation) => {
            const methodWriteIsFirst = compareLocations(methodWriteLocation, functionDeclaration.loc) > 0;

            const methodWritePosition = transformLocationPartToPosition(methodWriteLocation.end);
            const functionDeleteRange = transformLocationToRange(functionDeclaration.loc);

            const sourceEdit = getNewSourceEdit();

            if (methodWriteIsFirst) {
                sourceEdit.addReplacementEdit(functionDeleteRange, '');
                sourceEdit.addInsertEdit(methodWritePosition, `\n${methodString}`);
            } else {
                sourceEdit.addInsertEdit(methodWritePosition, `\n${methodString}`);
                sourceEdit.addReplacementEdit(functionDeleteRange, '');
            }

            return sourceEdit.applyEdit();
        })

        .catch(function (error) {
            parseAndShowMessage(error);
        });
}

module.exports = {
    moveFunctionIntoClass
};