class ConvertToMethodTestClass {
    arrowFunctionProperty = () => 'testing'

    functionExpressionProperty = function () {
        console.log('something in the body');
    }

    namedFunctionExpressionProperty = function withAName () {
        console.log('something else in the body');
    }
}