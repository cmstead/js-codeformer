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

module.exports = {
    groups,
    groupTitles
};