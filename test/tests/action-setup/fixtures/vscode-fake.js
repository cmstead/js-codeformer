function getVsCodeFake({ sourceCode = '' }) {
    return {
        window: {
            activeTextEditor: {
                selection: {
                    start: {
                        line: 0,
                        character: 0
                    },
                    end: {
                        line: 10,
                        character: 10
                    }
                },
                document: {
                    getText: function () {
                        return sourceCode;
                    }
                }
            }
        }
    };
}

module.exports = {
    getVsCodeFake
}