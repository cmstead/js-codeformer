const excludePattern = /^(parameter|promise)/i;

function getTemplateList(snippetJson) {
    return Object
        .keys(snippetJson)
        .filter(key => !excludePattern.test(key));
}

function getLanguageSnippetName(document) {
    const languageId = document.languageId;

    if(['javascript', 'javascriptreact', 'jsx'].includes(languageId)) {
        return 'js-snippets';
    } else {
        return 'ts-snippets';
    }
}

function getSnippetText(snippetName, snippetJson) {
    return snippetJson[snippetName].body.join('\n');
}

module.exports = {
    getTemplateList,
    getLanguageSnippetName,
    getSnippetText
};