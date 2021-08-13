class SomeTestClass {
    thisOldTestMethod() {
        return 'foo';
    }

    someOtherTestMethod() {
        const aBadIdeaThatPeopleDoAnyway = this.thisOldTestMethod;

        const thisOldTestMethod = function (){};

        function whatever() {
            this.thisOldTestMethod();
        }

        const anotherWhatever = function () {
            this.thisOldTestMethod();
        }

        const somethingObjecty = {
            value: this.thisOldTestMethod
        }

        const butThisTho = () => this.thisOldTestMethod()

        return this.thisOldTestMethod();
    }
}