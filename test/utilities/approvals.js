const approvals = require('approvals');

function configure() {
    const outputDirectory = `${process.cwd()}/test/approvals`;

    approvals
        .configure({
            reporters: ['vscode'],

            normalizeLineEndingsTo: '\n',

            appendEOL: true,

            EOL: require('os').EOL,

            errorOnStaleApprovedFiles: false,

            shouldIgnoreStaleApprovedFile: function (/*fileName*/) { return false; },

            stripBOM: false,

            forceApproveAll: false,

            failOnLineEndingDifferences: true

        })
        .mocha(outputDirectory);
}

module.exports = {
    configure
};