const groups = {
    REFACTORINGS: 'Refactorings',
    CONVERSIONS: 'Conversions',
    ACTIONS: 'Actions',
    NONE: 'None'
};

const groupTitles = {
    'Refactor Code': groups.REFACTORINGS,
    'Convert Expression': groups.CONVERSIONS,
    'Other Actions': groups.ACTIONS
};

const groupOrder = {
    [groups.REFACTORINGS]: 1,
    [groups.CONVERSIONS]: 2,
    [groups.ACTIONS]: 3,
}

module.exports = {
    groups,
    groupOrder,
    groupTitles
};