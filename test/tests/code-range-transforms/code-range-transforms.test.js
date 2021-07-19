require('../../utilities/approvals').configure();

const { loadModule } = require('../../utilities/module-loader');

const { transformSelectionToLocation, transformLocationToSelection } = loadModule('code-range-transforms');

describe('Code Range Transforms', function () {
    it('transforms vs code selections to ast locations', function () {
        const selectionObject = {
            start: {
                character: 0,
                line: 0
            },
            end: {
                character: 10,
                line: 10
            }
        };

        const astLocation = transformSelectionToLocation(selectionObject);

        this.verifyAsJSON(astLocation);
    });

    it('transforms ast locations to vs code selections', function () {
        const selectionObject = {
            start: {
                column: 0,
                line: 1
            },
            end: {
                column: 10,
                line: 11
            }
        };

        const vscodeSelection = transformLocationToSelection(selectionObject);

        this.verifyAsJSON(vscodeSelection);
    });
});