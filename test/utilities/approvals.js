const approvals = require('approvals');

function configure() {
    const outputDirectory = `${process.cwd()}/test/approvals`;

    approvals
        .configure({
            reporters: ['kdiff3'],

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