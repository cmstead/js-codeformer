const functionExpression = function () {
    console.log('boo');
};

const arrowFunctionExpression = () => 1 + 2;

const multilineArrowFunctionExpression = () => {
    console.log('yay');
    console.log('something');
};

const namedFunctionExpression = function notTheSameAsTheVarName () {
    console.log('boo');
};

const declarator1 = 'foo',
declarator2 = function notTheSameAsTheVarName () {
    console.log('boo');
;}
