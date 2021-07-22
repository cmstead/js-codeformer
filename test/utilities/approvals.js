const approvals = require('approvals');

function configure() {
    const outputDirectory = `${process.cwd()}/test/approvals`;

    approvals
        .configure({
            reporters: ['vscode'],

            normalizeLineEndingsTo: '\n',

            appendEOL: true,

            EOL: "\n",

            errorOnStaleApprovedFiles: false,

            shouldIgnoreStaleApprovedFile: function (/*fileName*/) { return false; },

            stripBOM: true,

            forceApproveAll: false

        })
        .mocha(outputDirectory);
}

module.exports = {
    configure
};