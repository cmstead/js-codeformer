function testing () {
    return a ? b : c;
}

const testVar = a ? b : c;

a ? b() : c();

function somethingOrOther() {
    a ? b() : c();
}