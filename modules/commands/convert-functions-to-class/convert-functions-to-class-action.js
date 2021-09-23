const { asyncPrepareActionSetup } = require("../../action-setup");
const { getNewClassBuilder } = require("../../builders/ClassBuilder");
const { getMethodBuilder } = require("../../builders/MethodBuilder");
const { FUNCTION_DECLARATION, FUNCTION_EXPRESSION, ARROW_FUNCTION_EXPRESSION, METHOD_DEFINITION } = require("../../constants/ast-node-types");
const { getNodeType } = require("../../core-utils");
const { findNodeByCheckFunction } = require("../../edit-utils/node-path-utils");
const { getFunctionBody, getFunctionParametersString } = require("../../function-utils/function-source");
const { buildInfoMessage, parseAndShowMessage } = require("../../ui-services/messageService");
const { validateUserInput } = require("../../validatorService");
const { selectExtractionLocation } = require('../../extraction-utils/extraction-location-service');

const { getFunctionDeclaration, getFunctionName, getFunctionNode } = require("./convert-functions-to-class");
const { getNewSourceEdit } = require("../../edit-utils/SourceEdit");
const { transformLocationToRange } = require("../../edit-utils/textEditTransforms");
const { insertSnippet } = require("../../edit-utils/snippet-service");

const functionTypes = [
    FUNCTION_DECLARATION,
    FUNCTION_EXPRESSION,
    ARROW_FUNCTION_EXPRESSION
];

function convertFunctionsToClass() {
    let locationsSetup = null;
    let functionDeclarations = null;
    let actionSetup = null;
    let methodStrings = null;
    let classSnippetString = null;
    let extractionLocation = null;

    return asyncPrepareActionSetup()
        .then((newActionSetup) => {
            actionSetup = newActionSetup;
            locationsSetup = newActionSetup.getLocationsSetup();
        })

        .then(() => {
            functionDeclarations = locationsSetup
                .map(({ selectionPath }) => {
                    const functionNode = findNodeByCheckFunction(
                        selectionPath,
                        (node) => functionTypes.includes(getNodeType(node)));

                    return functionNode !== null
                        ? getFunctionDeclaration(functionNode, selectionPath)
                        : null
                })
                .filter((node) => node !== null);
        })
        .then(() => validateUserInput({
            value: functionDeclarations,
            validator: (functionDeclarations) => functionDeclarations.length > 0,
            message: buildInfoMessage('No functions selected, cannot convert to class')
        }))

        .then(() => {
            methodStrings = functionDeclarations.map((functionDeclaration) => {
                const functionName = getFunctionName(functionDeclaration);
                const functionNode = getFunctionNode(functionDeclaration);

                return getMethodBuilder({
                    functionType: METHOD_DEFINITION,
                    functionName,
                    functionBody: getFunctionBody(functionNode, actionSetup.source),
                    functionParameters: getFunctionParametersString(functionNode, actionSetup.source),
                    async: functionNode.async,
                    generator: functionNode.generator
                }).buildNewMethod();
            })
        })

        .then(() => getNewClassBuilder({
            classBody: methodStrings.join('\n\n'),
            className: '${1:NewClass}${2: extends ${3:SuperclassName}}',
            constructorParameters: '$4',
            constructorBody: '$0'
        }).buildClass())

        .then((newClassSnippetString) => classSnippetString = newClassSnippetString)

        .then(() => {
            const selectionPath = locationsSetup[0].selectionPath;
            extractionLocation = selectExtractionLocation(selectionPath, selectionPath[0]);
        })

        .then(() => {
            const sourceEdit = getNewSourceEdit();

            functionDeclarations.slice(0).reverse().forEach((declarationNode) => {
                const replacementRange = transformLocationToRange(declarationNode.loc);

                sourceEdit.addReplacementEdit(replacementRange, '');
            });

            return sourceEdit.applyEdit();
        })

        .then(() => {
            const insertRange = transformLocationToRange({
                start: extractionLocation.start,
                end: extractionLocation.start
            });

            return insertSnippet(classSnippetString, insertRange);
        })

        .catch(function (error) {
            parseAndShowMessage(error);
        });
}

module.exports = {
    convertFunctionsToClass
};