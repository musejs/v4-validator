"use strict";
var should = require('should');
var V4Validator = require('../../src/factory')();

describe('max', function() {


    it('should not pass without the max argument', function (done) {

        var data = {
            field_1: 'hello',
            field_2: 5,
            field_3: ['hello', 'hey', 'hi', 'yo', 'sup']
        };
        var rules = {
            field_1: 'max'
        };

        var validator = new V4Validator(data, rules);

        validator.validate(function(err) {

            err.should.be.ok;
            done();
        });
    });

    it('should pass when the field under validation is less than or equal to a maximum value. Strings, numerics, and files are evaluated in the same fashion as the size rule', function (done) {

        var data = {
            field_1: 'hello',
            field_2: 5,
            field_3: ['hello', 'hey', 'hi', 'yo', 'sup']
        };
        var rules = {
            field_1: 'max:5|max:6',
            field_2: 'max:5|max:6',
            field_3: 'max:5|max:6'

        };

        var validator = new V4Validator(data, rules);

        validator.validate(function(err) {

            if (err) {

                throw err;
            }
            done();
        });
    });

    it('should not pass if the field under validation is not less than or equal to a maximum value. Strings, numerics, and files are evaluated in the same fashion as the size rule', function (done) {

        var data = {
            field_1: 'hello',
            field_2: 5,
            field_3: ['hello', 'hey', 'hi', 'yo', 'sup']
        };
        var rules = {
            field_1: 'max:4|max:3',
            field_2: 'max:4|max:3',
            field_3: 'max:4|max:3'

        };

        var validator = new V4Validator(data, rules);

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

