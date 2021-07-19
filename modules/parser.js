const tsEsTree = require('@typescript-eslint/typescript-estree');

class ScriptMode {
    constructor() {
        this.currentMode = false;
        this.modeChanged = false;
    }

    setMode(newMode) {
        this.modeChanged = this.currentMode !== newMode;

        this.currentMode = newMode;
    }

    readCurrentMode() {
        return this.currentMode;
    }

    didModeChange() {
        return this.modeChanged;
    }

    updateMode(modeComputer) {
        this.setMode(modeComputer(this.currentMode));
    }
}

function isHtml(source) {
    return (/\<script.*\>/ig).test(source);
}

function isScriptStartLine(sourceLine) {
    return /.*<script.*/ig.test(sourceLine);
}

function isScriptEndLine(sourceLine) {
    return /.*<\/script.*/ig.test(sourceLine);
}

function getNewScriptMode(sourceLine) {
    return function (currentScriptMode) {
        if (isScriptStartLine(sourceLine)) {
            return true;
        } else if (isScriptEndLine(sourceLine)) {
            return false;
        }

        return currentScriptMode;
    }
}

function stripHtml(source) {
    let sourceScriptMode = new ScriptMode();

    return source
        .split(/\r?\n/)
        .map(sourceLine => {
            const newScriptMode = getNewScriptMode(sourceLine)
            sourceScriptMode.updateMode(newScriptMode);

            const scriptModeUnchanged = !sourceScriptMode.didModeChange()
            const inScriptMode = sourceScriptMode.readCurrentMode();

            return scriptModeUnchanged && inScriptMode
                ? sourceLine
                : '';
        })
        .join('\n');
}

const parseModes = [
    {
        verify: isHtml,
        prepare: stripHtml
    }
];

function parse(source) {
    let parseableSource = source;

    const mode = parseModes.find(mode => mode.verify(source));

    if (typeof mode === 'object') {
        parseableSource = mode.prepare(source);
    }

    return tsEsTree.parse(parseableSource, { loc: true });
}

module.exports = {
    parse
};