const ScriptMode = require('./ScriptMode');
const { buildParseMode } = require('./ParseMode');

function isScriptStartLine(sourceLine) {
    return /.*<script.*/ig.test(sourceLine);
}

function isScriptEndLine(sourceLine) {
    return /.*<\/script.*/ig.test(sourceLine);
}

function getNewScriptModeBuilder(sourceLine) {
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
    let sourceScriptMode = new ScriptMode();

    return source
        .split(/\r?\n/)
        .map(sourceLine => {
            const scriptModeBuilder = getNewScriptModeBuilder(sourceLine)
            sourceScriptMode.updateMode(scriptModeBuilder);

            const scriptModeUnchanged = !sourceScriptMode.didModeChange()
            const inScriptMode = sourceScriptMode.readCurrentMode();

            return inScriptMode
                && scriptModeUnchanged
                ? sourceLine
                : '';
        })
        .join('\n');
}

module.exports = {
    parseMode: buildParseMode({
        verify: isHtml,
        prepare: stripHtml
    })
};