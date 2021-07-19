const { buildNewScriptState } = require('./ScriptState');
const { buildParseMode } = require('./ParseMode');

function isScriptStartLine(sourceLine) {
    return /.*<script.*/ig.test(sourceLine);
}

function isScriptEndLine(sourceLine) {
    return /.*<\/script.*/ig.test(sourceLine);
}

function getNewScriptStateBuilder(sourceLine) {
    return function (currentScriptMode) {
        if (isScriptStartLine(sourceLine)) {
            return true;
        } else if (isScriptEndLine(sourceLine)) {
            return false;
        }

        return currentScriptMode;
    }
}

function isHtml(source) {
    return (/\<script.*\>/ig).test(source);
}

function stripHtml(source) {
    let sourceScriptState = buildNewScriptState();

    return source
        .split(/\r?\n/)
        .map(sourceLine => {
            const scriptStateBuilder = getNewScriptStateBuilder(sourceLine)
            sourceScriptState.updateState(scriptStateBuilder);

            const scriptStateUnchanged = !sourceScriptState.didStateChange()
            const inScriptState = sourceScriptState.readCurrentState();

            return inScriptState
                && scriptStateUnchanged
                ? sourceLine
                : '';
        })
        .join('\n');
}

module.exports = {
    parseMode: buildParseMode({
        verify: isHtml,
        transform: stripHtml
    })
};