class ScriptState {
    constructor() {
        this.currentState = false;
        this.stateChanged = false;
    }

    setState(newState) {
        this.stateChanged = this.currentState !== newState;

        this.currentState = newState;
    }

    readCurrentState() {
        return this.currentState;
    }

    didStateChange() {
        return this.stateChanged;
    }

    updateState(stateComputer) {
        this.setState(stateComputer(this.currentState));
    }
}

function buildNewScriptState() {
    return new ScriptState();
}

module.exports = {
    ScriptState,
    buildNewScriptState
};