class TestClass {
    testMethod () {
        return 'hi';
    }
}

function namedTestFunction (a, b) {
    return a + b;
}

const anonymousFunction = function({ x, y, z}) {
    return (x**2 + y**2 + z**2)**0.5;
}

const arrowFunctionWithBlock = (a, { x }) => {
    return a - x;
}

const arrowFunctionWithoutBlock = () => 'foo!';