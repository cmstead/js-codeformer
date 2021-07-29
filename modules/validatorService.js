function validateUserInput({
    value,
    validator = () => false,
    message = 'Unable to validate user input'
}) {
    if (typeof value === 'undefined' || !validator(value)) {
        throw new Error(message);
    }

    return value;
}

module.exports = {
    validateUserInput
};