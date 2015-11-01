describe('V4Validator', function() {

    describe('constructor', function () {

        it('should create a new instance of V4Validator', function () {

            var V4Validator = require('../src/factory')();

            var validator = new V4Validator();
        });
    });
});