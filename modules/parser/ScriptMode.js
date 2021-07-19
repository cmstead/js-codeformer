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

module.exports = ScriptMode;