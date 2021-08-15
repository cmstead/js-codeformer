const { asyncPrepareActionSetup } = require("../../action-setup");
const { showErrorMessage } = require("../../ui-services/messageService");

function liftAndNameAnonymousFunction() {
    let actionSetup = null;

    return asyncPrepareActionSetup()
        .then((newActionSetup) => actionSetup = newActionSetup)

        .catch(function(error){
            showErrorMessage(error.message);
        });
}

module.exports = {
    liftAndNameAnonymousFunction
};