"use strict";
var should = require('should');
var V4Validator = require('../../src/factory')();

describe('different', function() {

    it('should not pass if a field parameter is not specified', function (done) {

        var data = {
            field_1: 'hello',
            field_2: 'hi'
        };
        var rules = {
            field_1: 'different'
        };

        var validator = new V4Validator(data, rules);

        validator.validate(function(err) {

            err.should.be.ok;
            err.should.be.instanceOf(Error);
            done();
        });


    });

    it('should pass when the field under validation is a different value than field', function (done) {

        var data = {
            field_1: 'hello',
            field_2: 'hi'
        };
        var rules = {
            field_1: 'different:field_2'
        };

        var validator = new V4Validator(data, rules);

        validator.validate(function(err) {

            if (err) {

                throw err;
            }
            done();
        });
    });

    it('should not pass if the field under validation is not a different value than field', function (done) {

        var data = {
            field_1: 'hello',
            field_2: 'hi',
            field_3: 'yo',
            field_4: 'yo'
        };
        var rules = {
            field_1: 'different:field_2',
            field_3: 'different:field_4'
        };


        var validator = new V4Validator(data, rules);

        validator.validate(function(err) {

            err.should.be.ok;
            err.should.have.property('meta');
            err.meta.should.have.property('field_3');
            err.meta.should.not.have.property('field_1');
            done();
        });

    });
});

