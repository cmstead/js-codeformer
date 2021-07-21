
// Stuff to do to extract a variable:

// Acceptable scopes:
// - Program
// - Function
// - FunctionExpression
// - ArrowFunctionExpression (only with FunctionBody)

// 1. get the scope for extraction (window.showQuickPick)
// 2. get the variable name (window.showInputBox)
// 3. create variable declaration code
// 4. create variable name replacement
// 5. select location for variable declaration insertion
// 6. create array of edits: [value replacement + location, variable declaration + location]

function buildExtractionPath(nodePath) {
    let extractionPath = [];
    let seekingParentNode = false;

    let acceptableNodeTypes = [
        'ArrowFunctionExpression',
        'FunctionDeclaration',
        'FunctionExpression',
        'IfStatement',
        'MethodDefinition'
    ];
    let currentNodeSet = [];

    const copiedNodePath = nodePath.slice();
    copiedNodePath.reverse()

    copiedNodePath.forEach(node => {
        if (node.type === 'Program' || node.type === 'ObjectExpression') {
            extractionPath.push([node])
        } else if (node.type === 'BlockStatement') {
            if(currentNodeSet.length > 0) {
                extractionPath.push(currentNodeSet);
            }
            seekingParentNode = true;
            currentNodeSet = [node];
        } else if (seekingParentNode) {
            if (acceptableNodeTypes.includes(node.type)) {
                currentNodeSet.push(node);
            } else {
                extractionPath.push(currentNodeSet);
                currentNodeSet = [];
                seekingParentNode = false;
            }
        }
    });

    return extractionPath;
}

module.exports = {
    buildExtractionPath
};