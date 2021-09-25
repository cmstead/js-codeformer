const { asyncPrepareActionSetup } = require("../../action-setup");
const { getMethodBuilder, methodTypes } = require("../../builders/MethodBuilder");
const { METHOD_DEFINITION, CLASS_DECLARATION } = require("../../constants/ast-node-types");
const { findNodeInPath } = require("../../edit-utils/node-path-utils");
const { getNewSourceEdit } = require("../../edit-utils/SourceEdit");
const { transformLocationToRange, transformLocationPartToPosition } = require("../../edit-utils/textEditTransforms");
const { getFunctionParametersString, getFunctionBody } = require("../../function-utils/function-source");
const { validateUserInput } = require("../../validatorService");
const { methodDoesNotUseThis } = require("./move-method-out-of-class");

function moveMethodOutOfClass() {
    let actionSetup = null;
    let methodNode = null;
    let classDeclaration = null;

    return asyncPrepareActionSetup()
        .then((newActionSetup) => actionSetup = newActionSetup)

        .then(() => findNodeInPath(actionSetup.selectionPath, METHOD_DEFINITION))
        .then((methodNode) => validateUserInput({
            value: methodNode,
            validator: (methodNode) => methodNode !== null && methodNode.kind === 'method',
            message: 'No method definition found'
        }))

        .then((methodNode) => validateUserInput({
            value: methodNode,
            validator: (methodNode) => methodDoesNotUseThis(methodNode),
            message: 'Method is still coupled to class -- cannot move if using "this"'
        }))

        .then((newMethodNode) => methodNode = newMethodNode)

        .then(() => findNodeInPath(actionSetup.selectionPath, CLASS_DECLARATION))
        .then((newClassDeclaration) => classDeclaration = newClassDeclaration)

        .then(() => getMethodBuilder({
            functionType: methodTypes.FUNCTION_DECLARATION,
            functionName: methodNode.key.name,
            functionParameters: getFunctionParametersString(methodNode.value, actionSetup.source),
            functionBody: getFunctionBody(methodNode.value, actionSetup.source),
            async: methodNode.value.async,
            generator: methodNode.value.generator
        }).buildNewMethod())

        .then((functionString) => {
            const insertPosition = transformLocationPartToPosition(classDeclaration.loc.start);
            const replacementRange = transformLocationToRange(methodNode.loc);

            return getNewSourceEdit()
                .addReplacementEdit(replacementRange, '')
                .addInsertEdit(insertPosition, `${functionString}\n`)
                .applyEdit();
        })
}

module.exports = {
    moveMethodOutOfClass
};