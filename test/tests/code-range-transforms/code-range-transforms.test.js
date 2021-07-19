require('../../utilities/approvals').configure();

const { loadModule } = require('../../utilities/module-loader');

const { transformSelectionToLocation } = loadModule('code-range-transforms');

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
});