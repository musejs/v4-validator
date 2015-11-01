"use strict";
var should = require('should');
var V4Validator = require('../../src/factory')();

describe('min', function() {

    it('should not pass without the min argument', function (done) {

        var data = {
            field_1: 'hello',
            field_2: 5,
            field_3: ['hello', 'hey', 'hi', 'yo', 'sup']
        };
        var rules = {
            field_1: 'min'
        };

        var validator = V4Validator.make(data, rules);

        validator.validate(function(err) {

            err.should.be.ok;
            done();
        });
    });

    it('should pass when the field under validation has a minimum value. Strings, numerics, and files are evaluated in the same fashion as the size rule', function (done) {

        var data = {
            field_1: 'hello',
            field_2: 5,
            field_3: ['hello', 'hey', 'hi', 'yo', 'sup']
        };
        var rules = {
            field_1: 'min:5|min:4',
            field_2: 'min:5|min:4',
            field_3: 'min:5|min:4'

        };

        var validator = V4Validator.make(data, rules);

        validator.validate(function(err) {

            if (err) {

                throw err;
            }
            done();
        });
    });

    it('should not pass if the field under validation does not have a minimum value. Strings, numerics, and files are evaluated in the same fashion as the size rule', function (done) {

        var data = {
            field_1: 'hello',
            field_2: 5,
            field_3: ['hello', 'hey', 'hi', 'yo', 'sup']
        };
        var rules = {
            field_1: 'min:6|min:7',
            field_2: 'min:6|min:7',
            field_3: 'min:6|min:7'

        };

        var validator = V4Validator.make(data, rules);

        validator.validate(function(err) {

            err.should.be.ok;
            err.should.have.property('meta');
            err.meta.should.have.property('field_1');
            err.meta.should.have.property('field_2');
            err.meta.should.have.property('field_3');
            done();
        });

    });
});


